<template>
	<NavBar :drawer-open="drawerOpen" @toggle-drawer="toggleDrawer" />
	<main class="app-layout d-flex">
		<NavDrawer v-if="drawerVisible" @close="closeDrawer" />
		<div v-if="isMobile && drawerOpen" class="drawer-backdrop" @click="closeDrawer"></div>
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
	<BaseModal id="welcomeModal">
		<template v-for="(modal, index) in modalData" :key="index">
			<EmptyState
				v-show="index === activeModalIndex"
				v-bind="modal"
				align="end"
				size-image="300px"
			>
				<template #extra>
					<DotPagination
						v-model="activeModalIndex"
						:total="totalModalSteps"
						class="mb-3"
					/>
				</template>
				<template #button>
					<BaseButton
						v-if="modal.showButton"
						:label="modal.buttonLabel"
						@click="handleModalAction"
						:data-bs-dismiss="modal.closeModal ? 'modal' : ''"
					/>
				</template>
			</EmptyState>
		</template>
	</BaseModal>
	<OffCanvas />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import Modal from "bootstrap/js/dist/modal";
import { storeToRefs } from "pinia";
import { RouterView } from "vue-router";
import NavBar from "@/components/navigation/NavBar.vue";
import NavDrawer from "@/components/navigation/NavDrawer.vue";
import BaseModal from "@/components/UI/BaseModal.vue";
import DotPagination from "@/components/UI/DotPagination.vue";
import { useLocalStorage } from "@/composables/useLocalStorage";

import EmptyState from "@/components/states/EmptyState.vue";
import { usePokemonStore } from "@/stores/pokemonStore";
import OffCanvas from "@/components/OffCanvas.vue";
import BaseButton from "./components/UI/BaseButton.vue";

const pokemonStore = usePokemonStore();
const { hasError } = storeToRefs(pokemonStore);
const { read: readWelcomeSeen, save: saveWelcomeSeen } = useLocalStorage(
	"welcome-modal-seen",
	false,
);

const windowWidth = ref(window.innerWidth);
const drawerOpen = ref(false);
const activeModalIndex = ref(0);
const totalModalSteps = computed(() => modalData.value.length);
const isMobile = computed(() => windowWidth.value <= 830);
const drawerVisible = computed(() => !isMobile.value || drawerOpen.value);
let welcomeModalInstance = null;

const modalData = ref([
	{
		title: "Todos los Pokémon en un solo lugar",
		label: "Accede a una amplia lista de Pokémon de todas las generaciones creadas por Nintendo",
		src: "./images/ob-1.png",
		buttonLabel: "Continuar",
		fullColor: true,
		showButton: true,
		closeModal: false,
	},
	{
		title: "Mantén tu Pokédex actualizada",
		label: "Regístrate y guarda tu perfil, Pokémon favoritos, configuraciones y mucho más en la aplicación",
		src: "./images/ob-2.png",
		buttonLabel: "Empecemos",
		fullColor: true,
		showButton: true,
		closeModal: true,
	},
]);

const handleResize = () => {
	windowWidth.value = window.innerWidth;
};

onMounted(() => {
	window.addEventListener("resize", handleResize);

	const welcomeSeen = readWelcomeSeen() === true;
	if (welcomeSeen) return;

	const welcomeModalElement = document.getElementById("welcomeModal");
	if (!welcomeModalElement) return;

	activeModalIndex.value = 0;
	welcomeModalInstance = Modal.getOrCreateInstance(welcomeModalElement);
	welcomeModalInstance.show();
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

const closeDrawer = () => {
	drawerOpen.value = false;
};

const handleModalAction = () => {
	if (activeModalIndex.value < totalModalSteps.value - 1) {
		activeModalIndex.value += 1;
		return;
	}

	saveWelcomeSeen(true);
	welcomeModalInstance?.hide();
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

	.drawer-backdrop {
		position: fixed;
		top: 56px;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.25);
		z-index: 2;
	}
}
</style>
