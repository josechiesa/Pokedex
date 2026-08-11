import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
	getPokemonList,
	getPokemonByName,
	getPokemonSpecies as apiGetPokemonSpecies,
	getPokemonType as apiGetPokemonType,
} from "@/services/api";
import { useLocalStorage } from "@/composables/useLocalStorage";
import {
	POKEMON_BATCH_SIZE,
	POKEMON_COLOR_MAP,
	findPokemonInList,
	normalizePokemonCacheList,
	normalizeQuery,
	upsertPokemons,
} from "@/stores/pokemonStore.helpers";

export const usePokemonStore = defineStore("pokemon", () => {
	const { read: readStoredPokemons, save: savePokemons } = useLocalStorage("pokedex-list", []);

	const storedPokemons = normalizePokemonCacheList(readStoredPokemons());
	const pokemons = ref(storedPokemons);
	const isLoading = ref(false);
	const isFetchingMore = ref(false);
	const hasError = ref(false);
	const canLoadMore = ref(true);
	const nextOffset = ref(storedPokemons.length);
	const hasMorePokemons = computed(() => canLoadMore.value);
	const pokemonColorMap = ref(POKEMON_COLOR_MAP);

	const species = ref({});
	const typeDetails = ref({});
	const weaknessesByPokemon = ref({});

	// Persists the merged pokemon cache and advances the next API offset cursor.
	const persistPokemonCache = (cachedPokemons, offset = nextOffset.value) => {
		pokemons.value = Array.isArray(cachedPokemons) ? cachedPokemons : [];
		savePokemons(pokemons.value);
		nextOffset.value = Math.max(0, offset);
	};

	// Fetches and caches species details for a pokemon.
	const getPokemonSpecies = async (name = "") => {
		if (!name) return null;
		if (species.value[name]) return species.value[name];
		try {
			const resp = await apiGetPokemonSpecies(name);
			const data = resp?.data ?? null;
			species.value[name] = data;
			return data;
		} catch (err) {
			console.error("getPokemonSpecies error:", err);
			return null;
		}
	};

	// Maps a type key to its localized label.
	const getTypeLabel = (typeName = "") => {
		return pokemonColorMap.value.find((item) => item.type === typeName)?.name || typeName;
	};

	// Maps a type key to its display color.
	const getTypeColor = (typeName = "") => {
		return pokemonColorMap.value.find((item) => item.type === typeName)?.color || typeName;
	};

	// Fetches and caches full type metadata used for weakness calculation.
	const getTypeDetails = async (typeName = "") => {
		if (!typeName) return null;
		if (typeDetails.value[typeName]) return typeDetails.value[typeName];

		try {
			const resp = await apiGetPokemonType(typeName);
			const data = resp?.data ?? null;
			typeDetails.value[typeName] = data;
			return data;
		} catch (err) {
			console.error("getTypeDetails error:", err);
			return null;
		}
	};

	// Computes and caches combined weaknesses for a pokemon based on all its types.
	const getPokemonWeaknesses = async (pokemon) => {
		const pokemonName = pokemon?.name || "";
		if (!pokemonName) return [];
		if (weaknessesByPokemon.value[pokemonName]) return weaknessesByPokemon.value[pokemonName];

		const pokemonTypes = (pokemon?.types || [])
			.map((entry) => entry?.type?.name)
			.filter(Boolean);

		if (!pokemonTypes.length) {
			weaknessesByPokemon.value[pokemonName] = [];
			return [];
		}

		try {
			const detailsList = await Promise.all(
				pokemonTypes.map((typeName) => getTypeDetails(typeName)),
			);

			const weaknessesSet = new Set();
			detailsList.forEach((typeData) => {
				const doubleDamageFrom = typeData?.damage_relations?.double_damage_from || [];
				doubleDamageFrom.forEach((weakType) => {
					if (weakType?.name) weaknessesSet.add(weakType.name);
				});
			});

			const weaknesses = Array.from(weaknessesSet);
			weaknessesByPokemon.value[pokemonName] = weaknesses;
			return weaknesses;
		} catch (err) {
			console.error("getPokemonWeaknesses error:", err);
			return [];
		}
	};

	// Resolves full pokemon details from a list response.
	const applyPokemonList = async (responseData, offset = nextOffset.value) => {
		const basicList = responseData?.results ?? [];
		canLoadMore.value = Boolean(responseData?.next);
		const cachedByName = new Map(pokemons.value.map((pokemon) => [pokemon.name, pokemon]));
		const detailPromises = basicList.map(async (pokemon) => {
			const cachedPokemon = cachedByName.get(pokemon.name);
			if (cachedPokemon) return cachedPokemon;

			try {
				const response = await getPokemonByName(pokemon.name);
				return response?.data ?? null;
			} catch (err) {
				console.error("applyPokemonList item error:", err);
				return null;
			}
		});

		const successful = (await Promise.all(detailPromises)).filter(Boolean);
		const merged = upsertPokemons(pokemons.value, successful);
		persistPokemonCache(merged, offset + basicList.length);
	};

	// Loads one list batch from the API and applies it to the local cache.
	const loadPokemonBatch = async (offset = 0) => {
		const response = await getPokemonList(POKEMON_BATCH_SIZE, offset);
		await applyPokemonList(response?.data, offset);
	};

	// Fetches the next batch of pokemon from the list endpoint.
	const fetchPokemons = async () => {
		if (isLoading.value || isFetchingMore.value) return pokemons.value;

		isLoading.value = true;
		hasError.value = false;

		try {
			await loadPokemonBatch(nextOffset.value);

			return pokemons.value;
		} catch (err) {
			console.error("fetchPokemons error:", err);
			hasError.value = true;
			return pokemons.value;
		} finally {
			isLoading.value = false;
		}
	};

	// Fetches the next batch when the user reaches the end of the grid.
	const fetchMorePokemons = async () => {
		if (isLoading.value || isFetchingMore.value || !hasMorePokemons.value)
			return pokemons.value;

		isFetchingMore.value = true;
		hasError.value = false;

		try {
			await loadPokemonBatch(nextOffset.value);
			return pokemons.value;
		} catch (err) {
			console.error("fetchMorePokemons error:", err);
			hasError.value = true;
			return pokemons.value;
		} finally {
			isFetchingMore.value = false;
		}
	};

	// Searches a pokemon by name or id-compatible query.
	const searchPokemon = async (query = "") => {
		const cachedPokemon = findPokemonInList(pokemons.value, query);
		if (cachedPokemon) return cachedPokemon;

		const normalizedQuery = normalizeQuery(query);
		if (!normalizedQuery) return null;

		try {
			const response = await getPokemonByName(normalizedQuery);
			const rawPokemon = response?.data ?? null;
			if (!rawPokemon) return null;

			const merged = upsertPokemons(pokemons.value, [rawPokemon]);
			persistPokemonCache(merged, nextOffset.value);
			return findPokemonInList(merged, normalizedQuery);
		} catch (err) {
			console.error("searchPokemon error:", err);
			return null;
		}
	};

	return {
		pokemons,
		isLoading,
		isFetchingMore,
		hasError,
		hasMorePokemons,
		pokemonColorMap,
		getPokemonSpecies,
		getPokemonWeaknesses,
		getTypeLabel,
		getTypeColor,
		fetchPokemons,
		fetchMorePokemons,
		searchPokemon,
	};
});
