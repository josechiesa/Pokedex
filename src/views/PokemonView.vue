<template>
	<main>
		<h1>Pokémons</h1>
		<p>Explora la lista de pokémons y sus detalles.</p>

		<div v-if="isLoading" class="text-center py-4">Cargando pokémons...</div>

		<div v-else class="pokemon-grid">
			<PokemonCard v-for="pokemon in pokemons" :key="pokemon.name" :pokemon="pokemon" />
		</div>
	</main>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { usePokemonStore } from "@/stores/pokemonStore";

import PokemonCard from "@/components/PokemonCard.vue";
const pokemonStore = usePokemonStore();
const { pokemons, isLoading } = storeToRefs(pokemonStore);
const { fetchPokemons } = pokemonStore;

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
