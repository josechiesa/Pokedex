<template>
	<div class="error-state-wrapper">
		<div class="error-state text-center" role="alert">
			<img src="/images/magikarp-error.png" alt="No pudimos cargar los pokémon" class="error-image mb-3" />
			<p class="fw-semibold mb-3">No pudimos cargar la información en este momento. Verifica tu conexión o intenta nuevamente más tarde.</p>
			<BaseButton label="Reintentar" @click="retry" />
		</div>
	</div>
</template>

<script setup>
import BaseButton from "@/components/UI/BaseButton.vue";
</script>

<style scoped>
.error-state-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: calc(100vh - 112px);
	width: 100%;
}

.error-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	text-align: center;
	width: 100%;
	max-width: 480px;
}

.error-image {
	width: 185px;
	height: 215px;
	object-fit: contain;
	display: block;
	margin: 0 auto;
	filter: grayscale(100%);
	opacity: 0.4;
}

</style>
