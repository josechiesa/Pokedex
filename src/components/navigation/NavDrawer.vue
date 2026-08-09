<template>
	<aside class="nav-drawer">
		<ul class="nav flex-column">
			<li v-for="(link, key) in links" :key="key" class="nav-item mb-2">
				<RouterLink :to="link.to" class="nav-link" active-class="active">
					{{ link.label }}
				</RouterLink>
			</li>
		</ul>
	</aside>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const links = ref({
	pokedex: { label: "Pokedex", to: "/" },
	regiones: { label: "Regiones", to: "/regiones" },
	favorites: { label: "Favoritos", to: "/favorites" },
	perfil: { label: "Perfil", to: "/perfil" },
});
</script>

<style lang="scss" scoped>
.nav-drawer {
	width: 280px;
	min-height: calc(100vh - 56px);
	padding: 1rem;
	background-color: rgba(255, 255, 255, 0.94);
	border-right: 1px solid rgba(0, 0, 0, 0.08);
	box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.04);
}

.nav-link {
	color: #333;
	border-radius: 0.375rem;
	transition: background-color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
	background-color: rgba(0, 0, 0, 0.04);
	color: #000;
}
</style>
