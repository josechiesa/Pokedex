import axios from "axios";

export const api = axios.create({
	baseURL: "https://pokeapi.co/api/v2",
	headers: {
		Accept: "application/json",
	},
	timeout: 10000,
});

export function getPokemonList() {
	return api.get("/pokemon", {
	});
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
