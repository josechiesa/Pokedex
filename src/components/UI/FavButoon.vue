<template>
	<div
		class="favorite-btn"
		:class="{ 'favorite-btn--inline': !isAbsolute }"
		aria-label="Marcar favorito"
		@click="emit('toggle')"
	>
		<FavoriteIcon v-if="!isFavorite" />
		<FavoriteActiveIcon v-else />
	</div>
</template>

<script setup>
import FavoriteIcon from "@/assets/icons/favorite.svg";
import FavoriteActiveIcon from "@/assets/icons/favorite-active.svg";

const emit = defineEmits(["toggle"]);

defineProps({
	isFavorite: {
		type: Boolean,
		default: false,
	},
	isAbsolute: {
		type: Boolean,
		default: true,
	},
});
</script>

<style lang="scss" scoped>
.favorite-btn {
	z-index: 2;
	width: 32px;
	height: 32px;
	cursor: pointer;

	position: absolute;
	top: 8px;
	right: 8px;
	transition: scale 0.2s ease-in-out;
}

.favorite-btn:hover {
	scale: 1.05;
	transition: scale 0.2s ease-in-out;
}

.favorite-btn--inline {
	position: static;
	top: auto;
	right: auto;
}
</style>
