<template>
	<div class="favorite-btn" aria-label="Marcar favorito" @click="emit('toggle')">
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
}
</style>
