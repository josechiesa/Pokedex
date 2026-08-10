<template>
	<nav class="container-fluid navbar navbar-expand-lg nav-bar-custom p-2">
		<div class="d-flex align-content-center justify-content-center w-100">
			<button
				type="button"
				class="btn btn-outline-secondary drawer-toggle me-2"
				@click="$emit('toggle-drawer')"
				:aria-expanded="drawerOpen"
				aria-label="Alternar menú"
			>
				<i :class="['bi', drawerOpen ? 'bi-x' : 'bi-list']" aria-hidden="true"></i>
			</button>
			<router-link to="/" class="me-3 logo-link" aria-label="Ir al inicio">
				<img
					src="/images/pokeball.webp"
					alt="Pokeball"
					width="32"
					height="32"
					class="logo"
				/>
			</router-link>
			<form class="d-flex w-100 max-w-600" role="search" @submit.prevent="handleSearch">
				<input
					v-model="searchQuery"
					class="form-control me-2"
					type="search"
					placeholder="Buscar pokémon..."
					aria-label="Search"
				/>
			</form>
		</div>
	</nav>
</template>

<script setup>
import { ref } from "vue";
import { usePokemonStore } from "@/stores/pokemonStore";
import { usePokemonOffcanvas } from "@/composables/usePokemonOffcanvas";

defineProps({
	drawerOpen: {
		type: Boolean,
		default: false,
	},
});

const searchQuery = ref("");
const pokemonStore = usePokemonStore();
const { searchPokemon } = pokemonStore;
const { showPokemonInOffcanvas } = usePokemonOffcanvas();

const handleSearch = async () => {
	const pokemon = await searchPokemon(searchQuery.value);
	if (!pokemon) return;

	showPokemonInOffcanvas(pokemon);
};
</script>

<style scoped>
.drawer-toggle {
	display: none;
	padding: 4px 8px;
	font-size: 18px;
	line-height: 1;
}

@media (max-width: 830px) {
	.drawer-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
}
.nav-bar-custom {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background-color: rgba(255, 255, 255);
	border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.04);
	min-height: 56px;
}

.max-w-600 {
	max-width: 600px;
}

.form-control {
	border-radius: 0.375rem;
}

.logo {
	flex-shrink: 0;
}

.logo-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
</style>
