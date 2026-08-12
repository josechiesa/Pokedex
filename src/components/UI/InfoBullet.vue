<template>
	<div class="info-bullet">
		<div class="info-bullet-header">
			<img :src="`./icons/${icon}`" />
			<span>{{ label }}</span>
		</div>

		<div class="info-bullet-circle">
			<span class="info-bullet-circle-label">{{ value }}</span>
		</div>
	</div>
</template>

<script setup>
defineProps({
	icon: {
		type: String,
		default: "",
	},
	label: {
		type: String,
		default: "",
	},
	value: {
		type: [String, Number],
		default: "",
	},
});
</script>

<style lang="scss" scoped>
.info-bullet {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 5px;
	width: 100%;
}

.info-bullet-header {
	display: flex;
	align-items: center;
	justify-content: start;
	gap: 5px;
	font-size: 12px;
	font-weight: 500;
	text-transform: uppercase;
	color: #333;

	img {
		width: 12px;
		height: 12px;
	}
}

.info-bullet-circle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 45px;
	border-radius: 15px;
	border: 1px solid rgba(224, 224, 224, 1);
}

.info-bullet-circle-label {
	font-size: 18px;
	font-weight: 500;
}
</style>
