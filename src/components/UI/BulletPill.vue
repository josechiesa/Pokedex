<template>
	<div class="badge rounded-pill" :style="{ backgroundColor: color }">
		<div class="type-icon">
			<component :is="TypeIcon" :style="{ fill: color }" class="type-icon-svg" :aria-label="label" />
		</div>
		<span class="type-label">{{ name }}</span>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { defineAsyncComponent } from "vue";

const props = defineProps({
	label: {
		type: String,
		default: "",
	},
	name: {
		type: String,
		default: "",
	},
	color: {
		type: String,
		default: "",
	},
});

const TypeIcon = computed(() => defineAsyncComponent(() => import(`../../assets/icons/${props.label}.svg`)));
</script>

<style lang="scss" scoped>
.badge {
	min-width: fit-content;
	height: 25px;
	display: flex;
	align-items: center;
	justify-content: start;
	gap: 8px;
}

.rounded-pill {
	font-weight: 500;
	font-size: 11px;
	line-height: 100%;
}

.type-icon {
	width: 20px;
	height: 20px;
	border-radius: 100%;
	background-color: white;
	position: relative;

	.type-icon-svg {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>
