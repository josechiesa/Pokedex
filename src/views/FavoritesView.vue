<template>
	<EmptyState
		v-if="favoriteCount === 0"
		title="No has marcado ningún Pokémon como favorito"
		label="Haz clic en el ícono de corazón de tus Pokémon favoritos y aparecerán aquí."
	/>
	<main v-else class="favorites-view">
		<h1>Favoritos</h1>
		<p>Encuentra tus pokémons favoritos guardados aquí.</p>
		<p v-if="favoriteCount > 100" class="text-muted small mb-0">
			Mostrando {{ paginatedFavorites.length }} de {{ favoriteCount }} favoritos.
		</p>

		<div class="pokemon-grid">
			<PokemonCard
				v-for="favorite in paginatedFavorites"
				:key="favorite.data.name"
				:pokemon="favorite.data"
			/>
		</div>

		<PaginationControls
			v-if="showPaginator"
			class="mt-4"
			:current-page="currentPage"
			:total-pages="totalPages"
			:previous-page-url="currentPage > 1 ? 'previous' : ''"
			:next-page-url="currentPage < totalPages ? 'next' : ''"
			aria-label="Paginacion de favoritos"
			@previous="changePage(-1)"
			@next="changePage(1)"
			@go-page="goToPage"
		/>
	</main>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import EmptyState from "@/components/states/EmptyState.vue";
import PokemonCard from "@/components/PokemonCard.vue";
import PaginationControls from "@/components/UI/PaginationControls.vue";
import { storeToRefs } from "pinia";

import { useFavoritesStore } from "@/stores/favoritesStore";
const favoritesStore = useFavoritesStore();
const { favorites, favoriteCount } = storeToRefs(favoritesStore);

const PAGE_SIZE = 99;
const currentPage = ref(1);

const totalPages = computed(() => Math.max(1, Math.ceil(favoriteCount.value / PAGE_SIZE)));
const showPaginator = computed(() => totalPages.value > 1);
const clampPage = (page) => Math.min(Math.max(page, 1), totalPages.value);

const paginatedFavorites = computed(() => {
	const start = (currentPage.value - 1) * PAGE_SIZE;
	const end = start + PAGE_SIZE;
	return favorites.value.slice(start, end);
});

watch(totalPages, () => {
	currentPage.value = clampPage(currentPage.value);
});

const goToPage = (page) => {
	currentPage.value = clampPage(Number(page) || 1);
};

const changePage = (step) => {
	currentPage.value = clampPage(currentPage.value + step);
};
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
