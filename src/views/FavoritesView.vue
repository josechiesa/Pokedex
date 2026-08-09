<template>
	<EmptyState
		v-if="favoriteCount === 0"
		title="No has marcado ningún Pokémon como favorito"
		label="Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí."
	/>
	<main v-else class="favorites-view">
		<h1>Favoritos</h1>
		<p>Encuentra tus pokémons favoritos guardados aquí.</p>
	</main>
</template>

<script setup>
import EmptyState from "@/components/states/EmptyState.vue";
import { storeToRefs } from "pinia";

import { useFavoritesStore } from "@/stores/favoritesStore";
const favoritesStore = useFavoritesStore();
const { favorites, favoriteCount } = storeToRefs(favoritesStore);
</script>
