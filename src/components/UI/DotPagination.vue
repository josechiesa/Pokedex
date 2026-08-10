<template>
	<div class="dot-pagination" role="tablist" :aria-label="ariaLabel">
		<button
			v-for="index in total"
			:key="index"
			type="button"
			class="dot-pagination__item"
			:class="{ 'dot-pagination__item--active': modelValue === index - 1 }"
			@click="select(index - 1)"
			:aria-label="`Ir al paso ${index}`"
		/>
	</div>
</template>

<script setup>
const props = defineProps({
	modelValue: {
		type: Number,
		default: 0,
	},
	total: {
		type: Number,
		required: true,
	},
	ariaLabel: {
		type: String,
		default: "Paginacion por puntos",
	},
});

const emit = defineEmits(["update:modelValue", "change"]);

const select = (nextIndex) => {
	if (nextIndex < 0 || nextIndex >= props.total) return;
	emit("update:modelValue", nextIndex);
	emit("change", nextIndex);
};
</script>

<style scoped>
.dot-pagination {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
}

.dot-pagination__item {
	width: 8px;
	height: 8px;
	border: none;
	border-radius: 100%;
	background-color: #d8dfef;
	padding: 0;
	transition:
		width 0.2s ease,
		background-color 0.2s ease;
}

.dot-pagination__item--active {
	width: 24px;
	background-color: #2048a9;
}
</style>
