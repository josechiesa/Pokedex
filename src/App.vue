<template>
	<NavBar />
	<main class="app-layout d-flex">
		<NavDrawer />
		<section class="app-content flex-fill p-3">
			<ApiErrorState v-if="hasError" />
			<RouterView v-else />
		</section>
	</main>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { RouterView } from "vue-router";
import NavBar from "@/components/navigation/NavBar.vue";
import NavDrawer from "@/components/navigation/NavDrawer.vue";

import ApiErrorState from "@/components/ApiErrorState.vue";
import { usePokemonStore } from "@/stores/pokemonStore";

const pokemonStore = usePokemonStore();
const { hasError } = storeToRefs(pokemonStore);
</script>

<style scoped>
.app-layout {
	display: flex;
	min-height: calc(100vh - 56px);
	padding-top: 56px;
}

.app-content {
	margin-left: 280px;
	background-color: #f8f9fa;
}
</style>
