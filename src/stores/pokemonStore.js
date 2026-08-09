import { defineStore } from "pinia";
import { ref } from "vue";
import { getPokemonList, getPokemonByName } from "@/services/api";
import { useLocalStorage } from "@/composables/useLocalStorage";

export const usePokemonStore = defineStore("pokemon", () => {
	const { read: readStoredPokemons, save: savePokemons } = useLocalStorage("pokedex-list", []);

	const storedPokemons = readStoredPokemons();
	const pokemons = ref(Array.isArray(storedPokemons) ? storedPokemons : []);
	const isLoading = ref(false);
	const hasError = ref(false);
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

	const fetchPokemons = async () => {
		if (pokemons.value.length > 0) {
			return;
		}

		isLoading.value = true;
		hasError.value = false;

		try {
			const response = await getPokemonList(151, 0);
			const basicList = response.data.results ?? [];

			// Fetch details but avoid failing the whole batch if a single request errors.
			const detailPromises = basicList.map((p) => getPokemonByName(p.name));
			const settled = await Promise.allSettled(detailPromises);

			const successful = settled
				.filter((r) => r.status === "fulfilled" && r.value && r.value.data)
				.map((r) => r.value.data);

			pokemons.value = successful;
			savePokemons(pokemons.value);
		} catch (err) {
			console.error("fetchPokemons error:", err);
			hasError.value = true;
		} finally {
			isLoading.value = false;
		}
	};

	return {
		pokemons,
		isLoading,
		hasError,
		pokemonColorMap,
		fetchPokemons,
	};
});
