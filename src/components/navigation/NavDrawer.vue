<template>
	<aside class="nav-drawer">
		<ul class="nav flex-column">
			<li v-for="(link, key) in links" :key="key" class="nav-item mb-2">
				<RouterLink :to="link.to" class="nav-link" active-class="active">
					<component
						:is="link.icon"
						:style="{ fill: isActiveLink(link.to) ? '#1565C0' : '#424242' }"
						:alt="link.label"
						class="nav-icon me-2"
					/>
					{{ link.label }}
				</RouterLink>
			</li>
		</ul>
	</aside>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import HomeIcon from "@/assets/icons/home.svg";
import WorldIcon from "@/assets/icons/world.svg";
import HeartFillIcon from "@/assets/icons/heart-fill.svg";
import PerfilIcon from "@/assets/icons/perfil.svg";

const route = useRoute();

const links = ref({
	pokedex: { label: "Pokedex", to: "/", icon: HomeIcon },
	regiones: { label: "Regiones", to: "/regiones", icon: WorldIcon },
	favorites: { label: "Favoritos", to: "/favorites", icon: HeartFillIcon },
	perfil: { label: "Perfil", to: "/perfil", icon: PerfilIcon },
});

const isActiveLink = (link) => route.path === link;
</script>

<style lang="scss" scoped>
.nav-drawer {
	position: fixed;
	top: 56px;
	left: 0;
	bottom: 0;
	width: 200px;
	overflow-y: auto;
	padding: 16px;
	background-color: #fff;
	border-right: 1px solid rgba(0, 0, 0, 0.08);
	box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.04);
	z-index: 3;
}

.nav-link {
	color: #333;
	border-radius: 0.375rem;
	transition: background-color 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.nav-link:hover,
.nav-link.active {
	background-color: rgba(0, 0, 0, 0.04);
	color: #000;
}

.nav-link.active {
	color: #1565c0;
}
</style>
