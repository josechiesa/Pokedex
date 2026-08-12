<template>
	<div class="error-state-wrapper">
		<div class="error-state text-center" role="alert">
			<img
				:src="src"
				:alt="src"
				:class="{ 'full-color': !fullColor }"
				class="state-image mb-3"
			/>
			<h4 class="fw-semibold mb-2">
				{{ title }}
			</h4>
			<p class="mb-3">
				{{ label }}
			</p>
			<slot name="extra"></slot>
			<BaseButton v-if="showButton" :label="buttonLabel" @click="handleButtonClick" />
		</div>
	</div>
</template>

<script setup>
import BaseButton from "@/components/UI/BaseButton.vue";

const emit = defineEmits(["click", "action"]);

const handleButtonClick = () => {
	emit("click");
	emit("action");
};

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
	buttonLabel: {
		type: String,
		default: "Reintentar",
	},
	src: {
		type: String,
		default: "./images/magikarp-error.png",
	},
	fullColor: {
		type: Boolean,
		default: false,
	},
	align: {
		type: String,
		default: "center",
		validator: (value) => ["start", "center", "end"].includes(value),
	},
	sizeImage: {
		type: String,
		default: "215px",
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
	justify-content: v-bind(align);
	gap: 0.75rem;
	text-align: center;
	width: 100%;
	max-width: 480px;
	padding-bottom: 40px;
}

.state-image {
	width: max-content;
	height: v-bind(sizeImage);
	object-fit: contain;
	display: block;
	margin: 0 auto;
}

.full-color {
	opacity: 0.4;
	filter: grayscale(100%);
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
