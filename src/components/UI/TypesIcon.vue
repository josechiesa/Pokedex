<template>
	<svg width="0" height="0" aria-hidden="true" class="type-icon-defs">
		<defs>
			<linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="var(--type-icon-gradient-end, #ffffff)" />
				<stop offset="100%" :stop-color="`var(--type-icon-gradient-start,#FFFFFF00)`" />
			</linearGradient>
		</defs>
	</svg>

	<component
		:is="TypeIcon"
		:style="{
			fill: `url(#${gradientId})`,
			'--type-icon-gradient-start': '#FFFFFF00',
			'--type-icon-gradient-end': '#ffffff',
		}"
		class="type-icon-svg"
	/>
</template>

<script setup>
import { computed, defineAsyncComponent } from "vue";

const props = defineProps({
	type: {
		type: String,
		default: "",
	},
});

const TypeIcon = computed(() => defineAsyncComponent(() => import(`../../assets/icons/${props.type}.svg`)));
const gradientId = `type-icon-gradient-${props.type}`;
</script>

<style lang="scss" scoped>
.type-icon-svg {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 85%;
	height: 85%;
}
</style>
