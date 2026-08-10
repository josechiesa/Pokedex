import axios from "axios";

export const api = axios.create({
	baseURL: "https://pokeapi.co/api/v2",
	headers: {
		Accept: "application/json",
	},
	timeout: 10000,
});

export function getPokemonList(limit = 21, offset = 0) {
	return api.get("/pokemon", {
		params: {
			limit,
			offset,
		},
	});
}

export function getPokemonListByUrl(url) {
	return api.get(url);
}

export function getPokemonByName(name) {
	return api.get(`/pokemon/${name}`);
}

export function getPokemonSpecies(name) {
	return api.get(`/pokemon-species/${name}`);
}

export function getPokemonType(typeName) {
	return api.get(`/type/${typeName}`);
}

export default api;
