<template>
	<main>
		<template v-if="isLoading">
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
		</template>
	</main>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { usePokemonStore } from "@/stores/pokemonStore";

import PokemonCard from "@/components/PokemonCard.vue";
import DropDown from "@/components/UI/DropDown.vue";
import BulletPill from "@/components/UI/BulletPill.vue";
import PokeLoader from "@/components/UI/PokeLoader.vue";

const pokemonStore = usePokemonStore();
const { pokemons, isLoading, pokemonColorMap } = storeToRefs(pokemonStore);
const { fetchPokemons } = pokemonStore;

const selectedTypes = ref([]);

const typeOptions = computed(() => pokemonColorMap.value || []);

const selectedTypeOptions = computed(() =>
	typeOptions.value.filter((type) => selectedTypes.value.includes(type.type)),
);

const filteredPokemons = computed(() => {
	if (!selectedTypes.value.length) {
		return pokemons.value;
	}

	return pokemons.value.filter((pokemon) =>
		pokemon.types.some((typeItem) => selectedTypes.value.includes(typeItem.type.name)),
	);
});

onMounted(() => {
	fetchPokemons();
});
</script>

<style scoped>
.pokemon-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.5rem;
	margin-top: 1.5rem;
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
