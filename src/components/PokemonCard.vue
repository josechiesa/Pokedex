<template>
	<div class="pokemon-card">
		<button type="button" class="favorite-btn" aria-label="Marcar favorito">
			<span class="favorite-icon">❤</span>
		</button>

		<div class="card-content">
			<div class="card-header">
				<span class="pokemon-id">#{{ formattedId }}</span>
				<h2 class="pokemon-name">{{ name }}</h2>
			</div>

			<div class="type-list">
				<BulletPill v-for="(type, index) in types" :key="index" :label="type.type.name" :name="labelColor(type.type.name)" :color="typesColors(type.type.name)" />
			</div>
		</div>

		<PokemonCardSprites :sprite="sprite" :name="name" :type="types[0]?.type?.name" :color="typesColors(types[0]?.type?.name)" />
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

import { usePokemonStore } from "@/stores/pokemonStore";
import BulletPill from "./UI/BulletPill.vue";
import PokemonCardSprites from "./PokemonCardSprites.vue";
const pokemonStore = usePokemonStore();
const { pokemonColorMap } = storeToRefs(pokemonStore);

const props = defineProps({
	id: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	types: {
		type: Array,
		default: () => [],
	},
	sprite: {
		type: String,
		default: "",
	},
});

const formattedId = computed(() => String(props.id).padStart(3, "0"));

const pokemonColor = ref(props.types[0]?.type?.name);
const typesColors = (types) => {
	const color = pokemonColorMap.value.find((p) => p.type == types);
	return color.color;
};

const labelColor = (name) => {
	const label = pokemonColorMap.value.find((p) => p.type == name);
	return label.name;
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
	min-height: 105px;
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
	gap: 0.65rem;
	padding: 0;
	margin: 0;
	list-style: none;
}

.type-pill {
	padding: 0.55rem 0.9rem;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.8);
	font-size: 0.85rem;
	font-weight: 700;
	color: #1f3a5b;
}

.favorite-btn {
	position: absolute;
	top: 1rem;
	right: 1rem;
	z-index: 2;
	width: 40px;
	height: 40px;
	border: none;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.92);
	color: #d33f5d;
	font-size: 1.05rem;
	cursor: pointer;
	box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
	display: grid;
	place-items: center;
}

.favorite-btn:hover {
	transform: translateY(-1px);
}
</style>
