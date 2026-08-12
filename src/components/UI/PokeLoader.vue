<template>
	<div :class="['poke-loader', { 'poke-loader--compact': compact }]">
		<img class="poke-loader__image" :src="loaderSvgUrl" alt="" :width="size" :height="size" />
	</div>
</template>

<script setup>
import loaderSvgUrl from "@/assets/icons/Loader.svg?url";

defineProps({
	size: {
		type: Number,
		default: 88,
	},
	compact: {
		type: Boolean,
		default: false,
	},
});
</script>

<style scoped>
.poke-loader {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	line-height: 0;
}

.poke-loader--compact {
	padding: 0.5rem 0;
}

.poke-loader__image {
	display: block;
	flex: 0 0 auto;
	animation: poke-loader-spin 1.1s linear infinite;
	will-change: transform;
}

@keyframes poke-loader-spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
