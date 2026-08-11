import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
	getPokemonList,
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
	const totalPokemons = computed(() => pokemons.value.length);
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

	// Resolves full pokemon details from a list response.
	const applyPokemonList = async (responseData) => {
		const basicList = responseData?.results ?? [];
		const detailPromises = basicList.map((pokemon) => getPokemonByName(pokemon.name));
		const settled = await Promise.allSettled(detailPromises);

		const successful = settled
			.filter((result) => result.status === "fulfilled" && result.value && result.value.data)
			.map((result) => result.value.data);

		pokemons.value = successful;
		savePokemons(pokemons.value);
	};

	// Fetches the first 151 pokemon in a single request.
	const fetchPokemons = async () => {
		isLoading.value = true;
		hasError.value = false;

		try {
			const response = await getPokemonList(151, 0);
			await applyPokemonList(response?.data);
		} catch (err) {
			console.error("fetchPokemons error:", err);
			hasError.value = true;
		} finally {
			isLoading.value = false;
		}
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
		totalPokemons,
		pokemonColorMap,
		getPokemonSpecies,
		getPokemonWeaknesses,
		getTypeLabel,
		getTypeColor,
		fetchPokemons,
		searchPokemon,
	};
});
