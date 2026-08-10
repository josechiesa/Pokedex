<template>
	<div class="poke-loader" role="status" aria-live="polite" aria-label="Cargando">
		<loaderSvg class="poke-loader__image" />
	</div>
</template>

<script setup>
import loaderSvg from "@/assets/icons/Loader.svg";
</script>

<style scoped>
.poke-loader {
	width: 100%;
	min-height: calc(100vh - 90px);
	display: grid;
	place-items: center;
}

.poke-loader__image {
	display: block;
	object-fit: contain;
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
