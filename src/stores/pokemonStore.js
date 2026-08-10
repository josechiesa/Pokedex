import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
	getPokemonList,
	getPokemonListByUrl,
	getPokemonByName,
	getPokemonSpecies as apiGetPokemonSpecies,
	getPokemonType as apiGetPokemonType,
} from "@/services/api";
import { useLocalStorage } from "@/composables/useLocalStorage";

export const usePokemonStore = defineStore("pokemon", () => {
	const { read: readStoredPokemons, save: savePokemons } = useLocalStorage("pokedex-list", []);

	const storedPokemons = readStoredPokemons();
	const pokemons = ref(Array.isArray(storedPokemons) ? storedPokemons : []);
	const isLoading = ref(false);
	const hasError = ref(false);
	const pageLimit = ref(102);
	const pageOffset = ref(0);
	const totalPokemons = ref(0);
	const nextPageUrl = ref(null);
	const previousPageUrl = ref(null);
	const currentPage = computed(() => Math.floor(pageOffset.value / pageLimit.value) + 1);
	const totalPages = computed(() =>
		Math.max(1, Math.ceil(totalPokemons.value / pageLimit.value)),
	);
	const pokemonColorMap = ref([
		{ name: "Acero", type: "steel", color: "#546E7A" },
		{ name: "Agua", type: "water", color: "#2196F3" },
		{ name: "Bicho", type: "bug", color: "#43A047" },
		{ name: "Dragón", type: "dragon", color: "#00ACC1" },
		{ name: "Eléctrico", type: "electric", color: "#FDD835" },
		{ name: "Fantasma", type: "ghost", color: "#8E24AA" },
		{ name: "Fuego", type: "fire", color: "#FF9800" },
		{ name: "Hada", type: "fairy", color: "#E91E63" },
		{ name: "Hielo", type: "ice", color: "#3D8BFF" },
		{ name: "Lucha", type: "fighting", color: "#E53935" },
		{ name: "Normal", type: "normal", color: "#546E7A" },
		{ name: "Planta", type: "grass", color: "#8BC34A" },
		{ name: "Psíquico", type: "psychic", color: "#673AB7" },
		{ name: "Roca", type: "rock", color: "#795548" },
		{ name: "Siniestro", type: "dark", color: "#546E7A" },
		{ name: "Tierra", type: "ground", color: "#FFB300" },
		{ name: "Veneno", type: "poison", color: "#9C27B0" },
		{ name: "Volador", type: "flying", color: "#00BCD4" },
	]);

	const species = ref({});
	const typeDetails = ref({});
	const weaknessesByPokemon = ref({});

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

	// Extracts pagination params from a next/previous URL.
	const parsePageParamsFromUrl = (url) => {
		try {
			const parsedUrl = new URL(url);
			const limitParam = Number(parsedUrl.searchParams.get("limit"));
			const offsetParam = Number(parsedUrl.searchParams.get("offset"));

			return {
				limit: Number.isFinite(limitParam) && limitParam > 0 ? limitParam : pageLimit.value,
				offset: Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0,
			};
		} catch {
			return {
				limit: pageLimit.value,
				offset: pageOffset.value,
			};
		}
	};

	// Applies a paginated response and resolves full pokemon details for the current page.
	const applyPokemonPage = async (responseData, limit, offset) => {
		totalPokemons.value = responseData?.count ?? 0;
		nextPageUrl.value = responseData?.next ?? null;
		previousPageUrl.value = responseData?.previous ?? null;
		pageLimit.value = limit;
		pageOffset.value = offset;

		const basicList = responseData?.results ?? [];
		const detailPromises = basicList.map((pokemon) => getPokemonByName(pokemon.name));
		const settled = await Promise.allSettled(detailPromises);

		const successful = settled
			.filter((result) => result.status === "fulfilled" && result.value && result.value.data)
			.map((result) => result.value.data);

		pokemons.value = successful;
		savePokemons(pokemons.value);
	};

	// Fetches a pokemon page using limit and offset.
	const fetchPokemons = async (limit = pageLimit.value, offset = 0) => {
		isLoading.value = true;
		hasError.value = false;

		try {
			const response = await getPokemonList(limit, offset);
			await applyPokemonPage(response?.data, limit, offset);
		} catch (err) {
			console.error("fetchPokemons error:", err);
			hasError.value = true;
		} finally {
			isLoading.value = false;
		}
	};

	// Fetches a pokemon page directly from a pagination URL.
	const fetchPokemonsByUrl = async (url = "") => {
		if (!url) return;

		isLoading.value = true;
		hasError.value = false;

		const { limit, offset } = parsePageParamsFromUrl(url);

		try {
			const response = await getPokemonListByUrl(url);
			await applyPokemonPage(response?.data, limit, offset);
		} catch (err) {
			console.error("fetchPokemonsByUrl error:", err);
			hasError.value = true;
		} finally {
			isLoading.value = false;
		}
	};

	// Navigates to the next page when available.
	const goToNextPage = async () => {
		if (!nextPageUrl.value) return;
		await fetchPokemonsByUrl(nextPageUrl.value);
	};

	// Navigates to the previous page when available.
	const goToPreviousPage = async () => {
		if (!previousPageUrl.value) return;
		await fetchPokemonsByUrl(previousPageUrl.value);
	};

	// Navigates to a specific page number using current page size.
	const goToPage = async (page = 1) => {
		const safePage = Math.min(Math.max(Number(page) || 1, 1), totalPages.value);
		const offset = (safePage - 1) * pageLimit.value;
		await fetchPokemons(pageLimit.value, offset);
	};

	// Searches a pokemon by name or id-compatible query.
	const searchPokemon = async (query = "") => {
		const normalizedQuery = String(query).trim().toLowerCase().replace(/^#/, "");
		if (!normalizedQuery) return null;

		try {
			const response = await getPokemonByName(normalizedQuery);
			return response?.data || null;
		} catch (err) {
			console.error("searchPokemon error:", err);
			return null;
		}
	};

	return {
		pokemons,
		isLoading,
		hasError,
		pageLimit,
		pageOffset,
		totalPokemons,
		nextPageUrl,
		previousPageUrl,
		currentPage,
		totalPages,
		pokemonColorMap,
		getPokemonSpecies,
		getPokemonWeaknesses,
		getTypeLabel,
		getTypeColor,
		fetchPokemons,
		fetchPokemonsByUrl,
		goToNextPage,
		goToPreviousPage,
		goToPage,
		searchPokemon,
	};
});
