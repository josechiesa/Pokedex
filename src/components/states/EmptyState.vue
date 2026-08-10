<template>
	<div class="error-state-wrapper">
		<div class="error-state text-center" role="alert">
			<img :src="src" alt="No pudimos cargar los pokémon" class="state-image mb-3" />
			<h4 class="fw-semibold mb-2">
				{{ title }}
			</h4>
			<p class="mb-3">
				{{ label }}
			</p>
			<BaseButton v-if="showButton" label="Reintentar" @click="emit('click')" />
		</div>
	</div>
</template>

<script setup>
import BaseButton from "@/components/UI/BaseButton.vue";

const emit = defineEmits(["click"]);

defineProps({
	showButton: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: "",
	},
	label: {
		type: String,
		default: "",
	},
	src: {
		type: String,
		default: "/images/magikarp-error.png",
	},
});
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

.state-image {
	width: 185px;
	height: 215px;
	object-fit: contain;
	display: block;
	margin: 0 auto;
	filter: grayscale(100%);
	opacity: 0.4;
}

h4 {
	font-size: 20px;
	color: #333333;
}

p {
	font-size: 16px;
	color: #4d4d4d;
}
</style>
