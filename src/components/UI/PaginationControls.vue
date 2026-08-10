<template>
	<nav class="d-flex justify-content-center" :aria-label="props.ariaLabel">
		<ul class="pagination mb-0">
			<li class="page-item" :class="{ disabled: props.currentPage <= 1 }">
				<button
					type="button"
					class="page-link"
					@click="emit('go-page', 1)"
					:disabled="props.currentPage <= 1"
				>
					Primera
				</button>
			</li>

			<li class="page-item" :class="{ disabled: !props.previousPageUrl }">
				<button
					type="button"
					class="page-link"
					@click="emit('previous')"
					:value="props.previousPageUrl || ''"
					:disabled="!props.previousPageUrl"
				>
					Anterior
				</button>
			</li>

			<li
				v-for="page in visiblePageNumbers"
				:key="page"
				class="page-item"
				:class="{ active: page === props.currentPage }"
			>
				<button
					type="button"
					class="page-link"
					:value="page"
					@click="emit('go-page', page)"
				>
					{{ page }}
				</button>
			</li>

			<li class="page-item" :class="{ disabled: !props.nextPageUrl }">
				<button
					type="button"
					class="page-link"
					@click="emit('next')"
					:value="props.nextPageUrl || ''"
					:disabled="!props.nextPageUrl"
				>
					Siguiente
				</button>
			</li>

			<li class="page-item" :class="{ disabled: props.currentPage >= props.totalPages }">
				<button
					type="button"
					class="page-link"
					@click="emit('go-page', props.totalPages)"
					:disabled="props.currentPage >= props.totalPages"
				>
					Ultima
				</button>
			</li>
		</ul>
	</nav>
</template>

<script setup>
import { computed } from "vue";

const emit = defineEmits(["previous", "next", "go-page"]);

const props = defineProps({
	currentPage: {
		type: Number,
		required: true,
	},
	totalPages: {
		type: Number,
		required: true,
	},
	previousPageUrl: {
		type: String,
		default: "",
	},
	nextPageUrl: {
		type: String,
		default: "",
	},
	ariaLabel: {
		type: String,
		default: "Paginacion",
	},
});

const visiblePageNumbers = computed(() => {
	const chunkSize = 10;
	const chunkStart = Math.floor((props.currentPage - 1) / chunkSize) * chunkSize + 1;
	const chunkEnd = Math.min(chunkStart + chunkSize - 1, props.totalPages);

	return Array.from({ length: chunkEnd - chunkStart + 1 }, (_, index) => chunkStart + index);
});
</script>
