<template>
	<div class="sprite-panel">
		<TypesIcon :type="type" />
		<img :src="sprite" :alt="`Sprite de ${name}`" class="pokemon-sprite" />
	</div>
</template>

<script setup>
import TypesIcon from "./UI/TypesIcon.vue";

defineProps({
	sprite: {
		type: String,
		default: "",
	},
	name: {
		type: String,
		default: "",
	},
	color: {
		type: String,
		default: "red",
	},
	type: {
		type: String,
		default: "",
	},
});
</script>

<style lang="scss" scoped>
.sprite-panel {
	position: absolute;
	top: 0;
	right: 0%;
	bottom: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 125px;
	background: v-bind(color);
	border-radius: 16px;
}

.pokemon-sprite {
	max-width: 100px;
	max-height: 100px;
	z-index: 1;
}
</style>
