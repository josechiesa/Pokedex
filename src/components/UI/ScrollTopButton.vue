<template>
	<button
		v-if="isVisible"
		type="button"
		class="scroll-top-button"
		@click="scrollToTop"
		aria-label="Volver arriba"
	>
		<i class="bi bi-arrow-up" aria-hidden="true"></i>
	</button>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const currentScrollY = ref(0);

// Controls when the button should be visible.
const isVisible = computed(() => currentScrollY.value > 300);

// Tracks the current vertical scroll position.
const handleWindowScroll = () => {
	currentScrollY.value = window.scrollY || 0;
};

// Smoothly scrolls the page back to the top.
const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

onMounted(() => {
	window.addEventListener("scroll", handleWindowScroll, { passive: true });
	handleWindowScroll();
});

onBeforeUnmount(() => {
	window.removeEventListener("scroll", handleWindowScroll);
});
</script>

<style scoped>
.scroll-top-button {
	position: fixed;
	right: 1.25rem;
	bottom: 1.25rem;
	border: 0;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	padding: 0.5rem;
	font-weight: 600;
	color: #fff;
	background-color: #1565c0;
	z-index: 1001;
}

.scroll-top-button i {
	font-size: 1.5rem;
	line-height: 1;
}

.scroll-top-button:hover {
	background-color: #0f4ca1;
}
</style>
