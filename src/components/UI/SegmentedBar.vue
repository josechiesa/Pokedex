<template>
	<div class="segmented-bar-card">
		<div v-if="title" class="segmented-bar-title">
			<span>{{ title }}</span>
		</div>

		<div class="segmented-bar-track">
			<div
				v-for="(segment, index) in segments"
				:key="index"
				class="segmented-bar-segment"
				:style="{
					width: `${segment.value}%`,
					background: segment.color || '#d9d9d9',
				}"
			/>
		</div>

		<div class="segmented-bar-values">
			<span v-for="(item, index) in items" :key="index" class="segmented-bar-item">
				<img
					v-if="item.icon"
					:src="item.icon"
					:alt="item.alt || item.label || 'icon'"
					class="segmented-bar-icon"
				/>
				{{ item.label }}
			</span>
		</div>
	</div>
</template>

<script setup>
defineProps({
	title: {
		type: String,
		default: "",
	},
	segments: {
		type: Array,
		default: () => [],
	},
	items: {
		type: Array,
		default: () => [],
	},
});
</script>

<style lang="scss" scoped>
.segmented-bar-card {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	border-radius: 15px;
	background: #fff;
}

.segmented-bar-title {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
	font-weight: 500;
	color: #444;
}

.segmented-bar-track {
	display: flex;
	width: 100%;
	height: 10px;
	border-radius: 999px;
	overflow: hidden;
	background: #f2f2f2;
}

.segmented-bar-segment {
	height: 100%;
}

.segmented-bar-values {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.segmented-bar-item {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-weight: 500;
	font-size: 12px;
	color: #444;
}

.segmented-bar-icon {
	width: 12px;
	height: 12px;
	object-fit: contain;
}
</style>
