<template>
	<EmptyState
		v-if="favoriteCount === 0"
		title="No has marcado ningún Pokémon como favorito"
		label="Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí."
	/>
	<main v-else class="favorites-view">
		<h1>Favoritos</h1>
		<p>Encuentra tus pokémons favoritos guardados aquí.</p>

		<div class="pokemon-grid">
			<PokemonCard
				v-for="favorite in favorites"
				:key="favorite.data.name"
				:pokemon="favorite.data"
			/>
		</div>
	</main>
</template>

<script setup>
import EmptyState from "@/components/states/EmptyState.vue";
import PokemonCard from "@/components/PokemonCard.vue";
import { storeToRefs } from "pinia";

import { useFavoritesStore } from "@/stores/favoritesStore";
const favoritesStore = useFavoritesStore();
const { favorites, favoriteCount } = storeToRefs(favoritesStore);
</script>

<style scoped>
.pokemon-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.5rem;
	margin-top: 1.5rem;
}

@media (max-width: 1140px) {
	.pokemon-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 650px) {
	.pokemon-grid {
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}
}
</style>
