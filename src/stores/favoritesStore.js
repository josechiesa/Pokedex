import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";

export const useFavoritesStore = defineStore("favorites", () => {
	const { read: readStoredFavorites, save: saveFavorites } = useLocalStorage(
		"pokedex-favorites",
		[],
	);
	const favorites = ref(readStoredFavorites());

	// Checks if a pokemon id is currently in favorites.
	const isFavorite = (id) => favorites.value.some((pokemon) => pokemon.id === id);

	// Adds a pokemon to favorites and persists the updated list.
	const addFavorite = (pokemon) => {
		if (!pokemon) return;
		if (!isFavorite(pokemon.id)) {
			favorites.value.push({
				id: pokemon.id,
				name: pokemon.name,
				data: pokemon.data,
			});
			saveFavorites(favorites.value);
		}
	};

	// Removes a pokemon from favorites by id and persists the updated list.
	const removeFavorite = (id) => {
		favorites.value = favorites.value.filter((pokemon) => pokemon.id !== id);
		saveFavorites(favorites.value);
	};

	// Toggles favorite status for a pokemon.
	const toggleFavorite = (pokemon) => {
		if (!pokemon) return;

		if (isFavorite(pokemon.id)) {
			removeFavorite(pokemon.id);
		} else {
			addFavorite(pokemon);
		}
	};

	// Returns the total number of favorite pokemons.
	const favoriteCount = computed(() => favorites.value.length);

	return {
		favorites,
		isFavorite,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		favoriteCount,
	};
});
