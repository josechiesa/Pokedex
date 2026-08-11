<template>
	<div class="pokemon-card">
		<div class="card-content" @click="showInOffcanvas">
			<div class="card-header">
				<span class="pokemon-id">#{{ formattedId }}</span>
				<h2 class="pokemon-name">{{ pokemon.name }}</h2>
			</div>

			<div class="type-list">
				<BulletPill
					v-for="(type, index) in pokemon.types"
					:key="index"
					:label="type.type.name"
					:name="getTypeLabel(type.type.name)"
					:color="getTypeColor(type.type.name)"
				/>
			</div>
		</div>

		<PokemonCardSprites
			:sprite="pokemon.sprites.front_default"
			:name="pokemon.name"
			:type="pokemon.types[0]?.type?.name"
			:color="getTypeColor(pokemon.types[0]?.type?.name)"
			@click="showInOffcanvas"
		/>
		<FavButoon :isFavorite="isFavorite" @toggle="toggleFavorite" />
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { usePokemonStore } from "@/stores/pokemonStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import BulletPill from "./UI/BulletPill.vue";
import PokemonCardSprites from "./PokemonCardSprites.vue";
import FavButoon from "./UI/FavButoon.vue";
import { usePokemonOffcanvas } from "@/composables/usePokemonOffcanvas";
const favoritesStore = useFavoritesStore();

const pokemonStore = usePokemonStore();
const { getTypeLabel, getTypeColor } = pokemonStore;
const props = defineProps({
	pokemon: {
		type: Object,
		default: () => ({}),
	},
});

const pokemonColor = ref(props.pokemon.types[0]?.type?.name);
const { showPokemonInOffcanvas } = usePokemonOffcanvas();

const formattedId = computed(() => String(props.pokemon.id).padStart(3, "0"));
const isFavorite = computed(() => favoritesStore.isFavorite(props.pokemon.id));

const toggleFavorite = () => {
	console.log(props.pokemon);
	favoritesStore.toggleFavorite({
		id: props.pokemon.id,
		name: props.pokemon.name,
		data: props.pokemon,
	});
};

const showInOffcanvas = () => {
	showPokemonInOffcanvas(props.pokemon);
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
	background-color: rgb(from v-bind(getTypeColor(pokemonColor)) r g b / 0.5);

	padding: 16px;
	min-height: stretch;
	width: 100%;
	cursor: pointer;

	transition: scale 0.2s ease-in-out;
}

.pokemon-card:hover {
	scale: 1.02;
	transition: scale 0.2s ease-in-out;
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
