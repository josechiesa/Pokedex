<template>
	<div class="btn-group">
		<BaseButton
			class="dropdown-toggle"
			data-bs-toggle="dropdown"
			data-bs-auto-close="outside"
			aria-expanded="false"
			size="small"
		>
			<span>{{ placeholder }}</span>
			<span v-if="model.length" class=" text-light ms-2">{{
				model.length
			}}</span>

		</BaseButton>
		<ul class="dropdown-menu p-3 type-dropdown-menu">
			<li class="clear-filter" @click.stop.prevent="model = []">Borrar filtro</li>
			<li v-for="option in options" :key="option.type">
				<label
					class="form-check dropdown-item d-flex justify-content-between align-items-center"
					:for="`type-${option.type}`"
				>
					<span class="form-check-label flex-grow-1">{{ option.name }}</span>
					<input
						class="form-check-input ms-2"
						type="checkbox"
						:id="`type-${option.type}`"
						:value="option.type"
						v-model="model"
					/>
				</label>
			</li>
		</ul>
	</div>
</template>

<script setup>
import BaseButton from "./BaseButton.vue";

defineProps({
	placeholder: {
		type: String,
		default: "",
	},
	options: {
		type: Array,
		default: () => [],
	},
});

const model = defineModel();
</script>

<style scoped>
.type-dropdown-menu {
	max-height: 260px;
	overflow-y: auto;
	min-width: 240px;
}

.dropdown-menu {
	border-radius: 8px;
	border: 1px solid #7979793b;

	/* Para navegadores basados en WebKit (Chrome, Safari, Edge) */
	scrollbar-width: none;
	/* Para Firefox */
	&::-webkit-scrollbar {
		display: none;
	}
}

.dropdown-item {
	padding: 0.35rem 0.75rem;
}

.dropdown-item:active,
.dropdown-item:hover {
	border-radius: 8px;
}

.clear-filter {
	color: #1e88e5;
	font-weight: 500;
	font-size: 14px;
	text-decoration: underline;
	text-align: center;
	cursor: pointer;
}
</style>
