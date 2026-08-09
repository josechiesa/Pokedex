<template>
	<main class="container py-4">
		<h1 class="mb-3">Pokémons</h1>
		<p class="text-muted">Explora la lista de pokémons y sus detalles.</p>

		<div v-if="isLoading" class="text-center py-4">Cargando pokémons...</div>

		<div v-else class="pokemon-grid">
			<PokemonCard v-for="(pokemon, index) in pokemons" :key="pokemon.name" :id="index + 1" :name="pokemon.name" :types="pokemon.types" :sprite="pokemon.sprites.front_default"  />
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
</style>
