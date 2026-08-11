export const POKEMON_BATCH_SIZE = 50;

export const POKEMON_COLOR_MAP = [
	{ name: "Acero", type: "steel", color: "#546E7A" },
	{ name: "Agua", type: "water", color: "#2196F3" },
	{ name: "Bicho", type: "bug", color: "#43A047" },
	{ name: "Dragón", type: "dragon", color: "#00ACC1" },
	{ name: "Eléctrico", type: "electric", color: "#FDD835" },
	{ name: "Fantasma", type: "ghost", color: "#8E24AA" },
	{ name: "Fuego", type: "fire", color: "#FF9800" },
	{ name: "Hada", type: "fairy", color: "#E91E63" },
	{ name: "Hielo", type: "ice", color: "#3D8BFF" },
	{ name: "Lucha", type: "fighting", color: "#E53935" },
	{ name: "Normal", type: "normal", color: "#546E7A" },
	{ name: "Planta", type: "grass", color: "#8BC34A" },
	{ name: "Psíquico", type: "psychic", color: "#673AB7" },
	{ name: "Roca", type: "rock", color: "#795548" },
	{ name: "Siniestro", type: "dark", color: "#546E7A" },
	{ name: "Tierra", type: "ground", color: "#FFB300" },
	{ name: "Veneno", type: "poison", color: "#9C27B0" },
	{ name: "Volador", type: "flying", color: "#00BCD4" },
];

// Keeps only the sprite fields used by the UI to reduce localStorage size.
export const normalizeSpriteCache = (sprites = {}) => ({
	front_default: sprites?.front_default || null,
	other: {
		showdown: {
			front_default: sprites?.other?.showdown?.front_default || null,
		},
	},
});

// Keeps only the pokemon fields needed by cards, details, and favorites.
export const normalizePokemonForCache = (pokemon = {}) => ({
	id: pokemon?.id ?? null,
	name: pokemon?.name ?? "",
	types: Array.isArray(pokemon?.types) ? pokemon.types : [],
	abilities: Array.isArray(pokemon?.abilities) ? pokemon.abilities : [],
	height: pokemon?.height ?? null,
	weight: pokemon?.weight ?? null,
	sprites: normalizeSpriteCache(pokemon?.sprites),
});

// Normalizes any persisted pokemon list shape into a safe cache-friendly array.
export const normalizePokemonCacheList = (list = []) =>
	(Array.isArray(list) ? list : []).map((pokemon) => normalizePokemonForCache(pokemon));

// Normalizes user search input to a comparable lowercase token.
export const normalizeQuery = (value = "") => String(value).trim().toLowerCase().replace(/^#/, "");

// Sorts pokemon by numeric id while keeping unknown ids at the end.
export const sortPokemonsById = (list = []) =>
	[...list].sort((left, right) => {
		const leftId = Number(left?.id ?? Number.POSITIVE_INFINITY);
		const rightId = Number(right?.id ?? Number.POSITIVE_INFINITY);
		return leftId - rightId;
	});

// Merges current and incoming pokemon lists by name, replacing duplicates.
export const mergePokemons = (currentList, incomingList) => {
	const byName = new Map();

	currentList.forEach((pokemon) => {
		if (pokemon?.name) byName.set(pokemon.name, pokemon);
	});

	incomingList.forEach((pokemon) => {
		if (pokemon?.name) byName.set(pokemon.name, pokemon);
	});

	return sortPokemonsById(Array.from(byName.values()));
};

// Normalizes incoming pokemon data and merges it into the current cache list.
export const upsertPokemons = (currentList = [], incomingList = []) => {
	const normalizedIncoming = (Array.isArray(incomingList) ? incomingList : []).map((pokemon) =>
		normalizePokemonForCache(pokemon),
	);

	return mergePokemons(currentList, normalizedIncoming);
};

// Finds a pokemon in a list by normalized name or exact id string.
export const findPokemonInList = (list = [], query = "") => {
	const normalizedQuery = normalizeQuery(query);
	if (!normalizedQuery) return null;

	return (
		list.find((pokemon) => {
			const pokemonName = String(pokemon?.name || "").toLowerCase();
			const pokemonId = String(pokemon?.id || "");
			return pokemonName === normalizedQuery || pokemonId === normalizedQuery;
		}) || null
	);
};
