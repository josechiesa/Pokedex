<template>
	<div
		class="offcanvas offcanvas-start"
		tabindex="-1"
		id="offcanvasExample"
		aria-labelledby="offcanvasExampleLabel"
	>
		<div class="pokemon-canvas-container">
			<div class="pokemon-circle" :style="{ backgroundColor: pokemonCircleColor }">
				<TypesIcon
					v-if="activePokemon"
					class="pokemon-circle--icon"
					:key="activePokemon.types?.[0]?.type?.name"
					:type="activePokemon.types?.[0]?.type?.name"
				/>
			</div>
			<div class="offcanvas-header">
				<div v-if="activePokemon" class="offcanvas-header-actions">
					<FavButoon
						:isFavorite="isActivePokemonFavorite"
						:isAbsolute="false"
						@toggle="toggleActiveFavorite"
					/>
				</div>
				<button
					type="button"
					class="btn-close btn-close-white opacity-100"
					data-bs-dismiss="offcanvas"
					aria-label="Close"
				></button>
			</div>
			<div class="offcanvas-body">
				<div v-if="isOffcanvasLoading" class="offcanvas-loader">
					<PokeLoader :size="72" :compact="true" />
				</div>
				<div v-else-if="activePokemon" class="pokemon-offcanvas">
					<div class="pokemon-offcanvas-top">
						<img
							:src="activePokemon.sprites?.other.showdown.front_default"
							class="mb-3"
							id="activePokemon"
						/>
					</div>
					<div class="offcanvas-content">
						<h2 class="mb-1 text-capitalize">{{ activePokemon.name }}</h2>
						<p class="mb-4">Nº{{ String(activePokemon.id).padStart(3, "0") }}</p>
						<div class="type-list">
							<BulletPill
								v-for="(t, i) in activePokemon.types"
								:key="t.type.name || i"
								:label="t.type.name"
								:name="getTypeLabel(t.type.name)"
								:color="getTypeColor(t.type.name)"
							/>
						</div>
						<hr />

						<div>
							<p v-if="species && speciesText" class="small text-muted">
								{{ speciesText }}
							</p>

							<div class="info-bullets-grid mt-3">
								<InfoBullet
									v-for="info in pokemonInfo"
									:key="info.label"
									:label="info.label"
									:value="info.value"
									:icon="info.icon"
								/>
							</div>

							<SegmentedBar
								v-if="genderRateBars.length"
								class="my-3"
								title="Género"
								:segments="genderSegments"
								:items="genderItems"
							/>

							<div v-if="weaknesses.length" class="mt-3">
								<p class="weakness-title mb-2">Debilidades</p>
								<div class="type-list">
									<BulletPill
										v-for="typeName in weaknesses"
										:key="typeName"
										:label="typeName"
										:name="getTypeLabel(typeName)"
										:color="getTypeColor(typeName)"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { usePokemonStore } from "@/stores/pokemonStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { storeToRefs } from "pinia";
import TypesIcon from "@/components/UI/TypesIcon.vue";
import BulletPill from "@/components/UI/BulletPill.vue";
import InfoBullet from "@/components/UI/InfoBullet.vue";
import SegmentedBar from "@/components/UI/SegmentedBar.vue";
import FavButoon from "@/components/UI/FavButoon.vue";
import PokeLoader from "@/components/UI/PokeLoader.vue";

const activePokemon = ref(null);
const species = ref(null);
const speciesLoading = ref(false);
const weaknesses = ref([]);
const weaknessesLoading = ref(false);
const pokemonStore = usePokemonStore();
const favoritesStore = useFavoritesStore();
const { getTypeLabel, getTypeColor, getPokemonWeaknesses } = pokemonStore;
const { pokemonColorMap } = storeToRefs(pokemonStore);

const isOffcanvasLoading = computed(
	() => !!activePokemon.value && (speciesLoading.value || weaknessesLoading.value),
);

const isActivePokemonFavorite = computed(() => {
	if (!activePokemon.value?.id) return false;
	return favoritesStore.isFavorite(activePokemon.value.id);
});

const pokemonCircleColor = computed(() => {
	const typeName = activePokemon.value?.types?.[0]?.type?.name;
	return pokemonColorMap.value.find((item) => item.type === typeName)?.color || "#ccc";
});

const visibleAbility = computed(() => {
	const abilities = activePokemon.value?.abilities || [];
	const found = abilities.find((a) => a.is_hidden === false) || null;
	const raw = found?.ability?.name || "";
	return raw ? raw.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";
});

const pokemonInfo = computed(() => {
	return [
		{
			label: "Altura",
			value: activePokemon.value ? `${activePokemon.value.height / 10} m` : "",
			icon: "altura.png",
		},
		{
			label: "Peso",
			value: activePokemon.value ? `${activePokemon.value.weight / 10} kg` : "",
			icon: "peso.png",
		},
		{
			label: "Habilidad",
			value: visibleAbility.value,
			icon: "habilidad.png",
		},
		{
			label: "Categoría",
			value: speciesGenus.value,
			icon: "categoria.png",
		},
	];
});

const speciesText = computed(() => {
	if (!species.value) return "";
	const entries = species.value.flavor_text_entries || [];
	const es = entries.find((e) => e.language?.name === "es");
	return es?.flavor_text.replace(/\n|\f/g, " ");
});

const speciesGenus = computed(() => {
	if (!species.value) return "";
	const gens = species.value.genera || [];
	const es = gens.find((g) => g.language?.name === "es");
	const en = gens.find((g) => g.language?.name === "en");
	const genus = (es?.genus || en?.genus || "").replace(/\n|\f/g, " ");
	return genus.replace(/^Pokémon\s+/i, "").trim();
});

const genderRate = computed(() => {
	if (!species.value) return "";
	const rate = species.value.gender_rate;

	if (rate === undefined || rate === null) return "";
	if (rate < 0) return "Sin género";

	const femalePercent = Math.round((rate / 8) * 100);
	const malePercent = 100 - femalePercent;

	return [malePercent, femalePercent];
});

const genderRateBars = computed(() => {
	if (!species.value) return [];
	const rate = species.value.gender_rate;

	if (rate === undefined || rate === null || rate < 0) return [];

	const femalePercent = Math.round((rate / 8) * 100);
	const malePercent = 100 - femalePercent;

	return [malePercent, femalePercent];
});

const genderSegments = computed(() => {
	if (!genderRateBars.value.length) return [];

	return [
		{ value: genderRateBars.value[0], color: "rgba(37, 81, 195, 1)" },
		{ value: genderRateBars.value[1], color: "rgba(255, 117, 150, 1)" },
	];
});

const genderItems = computed(() => {
	if (!genderRate.value || !Array.isArray(genderRate.value)) return [];

	return [
		{ label: `${genderRate.value[0]}%`, icon: "./icons/male.png", alt: "Male" },
		{ label: `${genderRate.value[1]}%`, icon: "./icons/female.png", alt: "Female" },
	];
});

const toggleActiveFavorite = () => {
	if (!activePokemon.value?.id) return;

	favoritesStore.toggleFavorite({
		id: activePokemon.value.id,
		name: activePokemon.value.name,
		data: activePokemon.value,
	});
};

const handler = async (e) => {
	if (e?.detail?.pokemon) {
		activePokemon.value = e.detail.pokemon;
		species.value = null;
		weaknesses.value = [];
		speciesLoading.value = true;
		weaknessesLoading.value = true;

		try {
			const [speciesData, weaknessesData] = await Promise.all([
				pokemonStore.getPokemonSpecies(e.detail.pokemon.name),
				getPokemonWeaknesses(e.detail.pokemon),
			]);

			species.value = speciesData;
			weaknesses.value = weaknessesData;
		} catch (err) {
			console.error("Offcanvas detail error", err);
			weaknesses.value = [];
		} finally {
			speciesLoading.value = false;
			weaknessesLoading.value = false;
		}
	}
};

onMounted(() => {
	document.addEventListener("show-offcanvas-pokemon", handler);
});

onUnmounted(() => {
	document.removeEventListener("show-offcanvas-pokemon", handler);
});
</script>

<style lang="scss" scoped>
.offcanvas {
	overflow: hidden;
	height: 100dvh;
}

.pokemon-canvas-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.offcanvas-body {
	flex: 1 1 auto;
	min-height: 0;
	overflow: hidden;
}

.offcanvas-loader {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.offcanvas-header {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 0.5rem;
}

.offcanvas-header-actions {
	display: inline-flex;
	align-items: center;
}

.pokemon-circle {
	position: absolute;
	top: -240px;
	left: 50%;
	transform: translateX(-50%);
	width: 500px;
	height: 500px;
	border-radius: 50%;
	z-index: -1;

	:deep(svg) {
		width: 200px;
		height: 200px;
		position: absolute;
		top: 70%;
		left: 50%;
	}
}

.pokemon-offcanvas {
	display: grid;
	grid-template-rows: minmax(200px, 250px) 1fr;
	row-gap: 1rem;
	height: 100%;
	min-height: 0;
}

.pokemon-offcanvas-top {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 1rem 0;
}

.offcanvas-content {
	overflow-y: auto;
	padding: 0;
	scrollbar-width: none;
}

.offcanvas-content::-webkit-scrollbar {
	display: none;
}

.pokemon-offcanvas img#activePokemon {
	width: 150px;
	display: block;
	margin: 0 auto 1rem;
	position: absolute;
	transform: translate(-50%, -50%);
	top: 240px;
	left: 50%;
}

.type-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

hr {
	border: 1px solid rgba(224, 224, 224, 1);
}

.info-bullets-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.75rem;
}

.weakness-title {
	font-size: 0.85rem;
	font-weight: 600;
	color: #444;
}
</style>
