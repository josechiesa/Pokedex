<template>
	<NavBar :drawer-open="drawerOpen" @toggle-drawer="toggleDrawer" />
	<main class="app-layout d-flex">
		<NavDrawer v-if="drawerVisible" />
		<section class="app-content flex-fill p-3">
			<EmptyState
				v-if="hasError"
				:showButton="true"
				title="Algo salio mal..."
				label="No pudimos cargar la información en este momento. Verifica tu conexión o intenta
				nuevamente más tarde."
				@click="retry"
			/>
			<RouterView v-else />
		</section>
	</main>
	<OffCanvas />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { RouterView } from "vue-router";
import NavBar from "@/components/navigation/NavBar.vue";
import NavDrawer from "@/components/navigation/NavDrawer.vue";

import EmptyState from "@/components/states/EmptyState.vue";
import { usePokemonStore } from "@/stores/pokemonStore";
import OffCanvas from "@/components/OffCanvas.vue";

const pokemonStore = usePokemonStore();
const { hasError } = storeToRefs(pokemonStore);

const windowWidth = ref(window.innerWidth);
const drawerOpen = ref(false);
const isMobile = computed(() => windowWidth.value <= 830);
const drawerVisible = computed(() => !isMobile.value || drawerOpen.value);

const handleResize = () => {
	windowWidth.value = window.innerWidth;
};

onMounted(() => {
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
});

const retry = () => {
	window.location.reload();
};

const toggleDrawer = () => {
	drawerOpen.value = !drawerOpen.value;
};
</script>

<style scoped>
.app-layout {
	display: flex;
	min-height: calc(100vh - 56px);
	padding-top: 56px;
}

.app-content {
	margin-left: 200px;
	background-color: #f8f9fa;
}

@media (max-width: 830px) {
	.app-content {
		margin-left: 0;
	}
}
</style>
