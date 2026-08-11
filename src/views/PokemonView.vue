<template>
	<main>
		<template v-if="isLoading && !pokemons.length">
			<PokeLoader :size="88" />
		</template>
		<template v-else>
			<h1>Pokémons</h1>
			<p>Explora la lista de pokémons y sus detalles.</p>

			<div class="filter-bar">
				<DropDown v-model="selectedTypes" :options="typeOptions" placeholder="Seleccione" />
				<BulletPill
					v-for="type in selectedTypeOptions"
					:key="type.type"
					:label="type.type"
					:name="type.name"
					:color="type.color"
				/>
			</div>

			<div class="pokemon-grid">
				<PokemonCard
					v-for="pokemon in filteredPokemons"
					:key="pokemon.name"
					:pokemon="pokemon"
				/>
			</div>

			<div ref="scrollSentinel" class="scroll-sentinel" aria-hidden="true"></div>
		</template>
	</main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { usePokemonStore } from "@/stores/pokemonStore";

import PokemonCard from "@/components/PokemonCard.vue";
import DropDown from "@/components/UI/DropDown.vue";
import BulletPill from "@/components/UI/BulletPill.vue";
import PokeLoader from "@/components/UI/PokeLoader.vue";

const pokemonStore = usePokemonStore();
const { pokemons, isLoading, hasMorePokemons, pokemonColorMap } = storeToRefs(pokemonStore);
const { fetchPokemons, fetchMorePokemons } = pokemonStore;

const selectedTypes = ref([]);
const scrollSentinel = ref(null);
let observer = null;

// Exposes all available type options from the store.
const typeOptions = computed(() => pokemonColorMap.value || []);

// Maps the selected type keys to their full option objects.
const selectedTypeOptions = computed(() =>
	typeOptions.value.filter((type) => selectedTypes.value.includes(type.type)),
);

// Filters the pokemon list by selected types, or returns all when no filter is active.
const filteredPokemons = computed(() => {
	if (!selectedTypes.value.length) {
		return pokemons.value;
	}

	return pokemons.value.filter((pokemon) =>
		pokemon.types.some((typeItem) => selectedTypes.value.includes(typeItem.type.name)),
	);
});

// Registers the sentinel observer used to trigger infinite loading near the list end.
const setupObserver = () => {
	if (observer) {
		observer.disconnect();
		observer = null;
	}

	if (!scrollSentinel.value || !hasMorePokemons.value) return;

	observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				fetchMorePokemons();
			}
		},
		{
			root: null,
			rootMargin: "0px 0px 150px 0px",
			threshold: 0.1,
		},
	);

	observer.observe(scrollSentinel.value);
};

// Cleans up the observer when the view is destroyed.
onBeforeUnmount(() => {
	if (observer) observer.disconnect();
});

// Loads the first batch (if needed) and then starts observing the sentinel.
onMounted(async () => {
	if (!pokemons.value.length) {
		await fetchPokemons();
	}

	await nextTick();
	setupObserver();
});
</script>

<style scoped>
.pokemon-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.5rem;
	margin-top: 1.5rem;
}

.scroll-sentinel {
	height: 50px;
	width: 100%;
	margin-top: 1rem;
}

.loading-more {
	display: flex;
	justify-content: center;
	padding: 1.5rem 0 0;
}

.filter-bar {
	display: flex;
	justify-content: start;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.selected-type-pills {
	min-height: 2rem;
}

.selected-type-pill {
	padding: 0.4rem 0.75rem;
	font-size: 0.85rem;
	font-weight: 600;
	border-radius: 999px;
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
