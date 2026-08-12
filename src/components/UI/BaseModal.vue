<template>
	<div class="modal fade" :id="id" tabindex="-1" :aria-labelledby="labelId" data-bs-backdrop="static" aria-hidden="true">
		<div
			class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
			:class="dialogSizeClass"
		>
			<div class="modal-content">
				<div class="modal-body">
					<slot />
				</div>

				<div v-if="$slots.footer" class="modal-footer">
					<slot name="footer" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		default: "",
	},
	size: {
		type: String,
		default: "md",
		validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
	},
	showHeader: {
		type: Boolean,
		default: true,
	},
	showCloseButton: {
		type: Boolean,
		default: true,
	},
});

const labelId = computed(() => `${props.id}-label`);

const dialogSizeClass = computed(() => {
	if (props.size === "sm") return "modal-sm";
	if (props.size === "lg") return "modal-lg";
	if (props.size === "xl") return "modal-xl";
	return "";
});
</script>

<style lang="css" scoped></style>
