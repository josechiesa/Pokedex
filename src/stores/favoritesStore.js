import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";

export const useFavoritesStore = defineStore("favorites", () => {
	const { read: readStoredFavorites, save: saveFavorites } = useLocalStorage(
		"pokedex-favorites",
		[],
	);
	const favorites = ref(readStoredFavorites());

	const isFavorite = (id) => favorites.value.some((pokemon) => pokemon.id === id);

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

	const removeFavorite = (id) => {
		favorites.value = favorites.value.filter((pokemon) => pokemon.id !== id);
		saveFavorites(favorites.value);
	};

	const toggleFavorite = (pokemon) => {
		if (!pokemon) return;

		if (isFavorite(pokemon.id)) {
			removeFavorite(pokemon.id);
		} else {
			addFavorite(pokemon);
		}
	};

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
