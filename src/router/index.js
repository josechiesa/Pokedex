import { createRouter, createWebHistory } from 'vue-router'
import PokemonView from '../views/PokemonView.vue'
import RegionesView from '../views/RegionesView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import PerfilView from '../views/PerfilView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'pokemonView',
			component: PokemonView,
		},
		{
			path: '/regiones',
			name: 'regiones',
			component: RegionesView,
		},
		{
			path: '/favorites',
			name: 'favorites',
			component: FavoritesView,
		},
		{
			path: '/perfil',
			name: 'perfil',
			component: PerfilView,
		},
	],
})

export default router
