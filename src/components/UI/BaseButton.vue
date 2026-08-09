<template>
	<button type="button" class="btn base-button" @click="retry">{{ label }}</button>
</template>

<script setup>
defineProps({
	label: {
		type: String,
		default: "Label",
	},
});

const retry = () => {
	window.location.reload();
};
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

.base-button:hover {
	background-color: #196db6 !important; /* Changes background color */
	color: #ffffff !important; /* Changes text color */
}
</style>
