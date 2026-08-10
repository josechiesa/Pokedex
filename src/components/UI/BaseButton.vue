<template>
	<button type="button" :class="buttonClasses" @click="emit('click')">
		<slot>{{ label }}</slot>
	</button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	label: {
		type: String,
		default: "Label",
	},
	size: {
		type: String,
		default: "large",
		validator: (v) => ["small", "medium", "large"].includes(v),
	},
});

const emit = defineEmits(["click"]);

const buttonClasses = computed(() => {
	return ["btn", "base-button", `base-button--${props.size}`];
});
</script>

<style scoped>
.base-button {
	background-color: #1e88e5;
	color: #ffffff;
	font-size: 18px;
	font-weight: 600;
	border: none;
	border-radius: 100px;
	padding: 0.5rem 1rem;
	width: 328px;
	height: 58px;
}

.base-button:hover,
.btn.show,
.btn.show:focus,
.btn:first-child:active {
	background-color: #196db6 !important;
	color: #ffffff;
}

.base-button--small {
	font-size: 14px;
	padding: 0.25rem 0.5rem;
	width: 180px;
	height: 40px;
	border-radius: 8px;
}

.base-button--medium {
	font-size: 16px;
	padding: 0.4rem 0.75rem;
	width: 260px;
	height: 48px;
	border-radius: 40px;
}
</style>
