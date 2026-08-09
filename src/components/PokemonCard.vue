<template>
	<div class="pokemon-card">
		<div class="card-content">
			<div class="card-header">
				<span class="pokemon-id">#{{ formattedId }}</span>
				<h2 class="pokemon-name">{{ pokemon.name }}</h2>
			</div>

			<div class="type-list">
				<BulletPill
					v-for="(type, index) in pokemon.types"
					:key="index"
					:label="type.type.name"
					:name="labelColor(type.type.name)"
					:color="typesColors(type.type.name)"
				/>
			</div>
		</div>

		<PokemonCardSprites
			:sprite="pokemon.sprites.front_default"
			:name="pokemon.name"
			:type="pokemon.types[0]?.type?.name"
			:color="typesColors(pokemon.types[0]?.type?.name)"
		/>
		<FavButoon :isFavorite="isFavorite" @toggle="toggleFavorite" />
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

import { usePokemonStore } from "@/stores/pokemonStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import BulletPill from "./UI/BulletPill.vue";
import PokemonCardSprites from "./PokemonCardSprites.vue";
import FavButoon from "./UI/FavButoon.vue";
const pokemonStore = usePokemonStore();
const favoritesStore = useFavoritesStore();
const { pokemonColorMap } = storeToRefs(pokemonStore);

const props = defineProps({
	pokemon: {
		type: Object,
		default: () => ({}),
	},
});

const pokemonColor = ref(props.pokemon.types[0]?.type?.name);

const formattedId = computed(() => String(props.pokemon.id).padStart(3, "0"));
const isFavorite = computed(() => favoritesStore.isFavorite(props.pokemon.id));

const typesColors = (types) => {
	const color = pokemonColorMap.value.find((p) => p.type == types);
	return color.color;
};

const labelColor = (name) => {
	const label = pokemonColorMap.value.find((p) => p.type == name);
	return label.name;
};

const toggleFavorite = () => {
	console.log(props.pokemon);
	favoritesStore.toggleFavorite({
		id: props.pokemon.id,
		name: props.pokemon.name,
		data: props.pokemon,
	});
};
</script>

<style scoped>
.pokemon-card {
	display: grid;
	grid-template-columns: 1fr 125px;
	align-items: stretch;
	position: relative;
	overflow: hidden;
	border-radius: 16px;
	background-color: rgb(from v-bind(typesColors(pokemonColor)) r g b / 0.5);

	padding: 16px;
	min-height: stretch;
	width: 100%;
}

.card-content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.card-header {
	margin-bottom: 1rem;
}

.pokemon-id {
	display: inline-flex;
	font-size: 12px;
	font-weight: 600;
	line-height: 100%;
	color: #424242;
}

.pokemon-name {
	margin: 0.75rem 0 0;
	font-weight: 600;
	font-size: 21px;
	line-height: 100%;
	color: #121212;
	text-transform: capitalize;
}

.type-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}
</style>
