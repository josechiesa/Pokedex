import Offcanvas from "bootstrap/js/dist/offcanvas";

export function usePokemonOffcanvas() {
	const showPokemonInOffcanvas = (pokemon) => {
		if (!pokemon) return;

		const event = new CustomEvent("show-offcanvas-pokemon", {
			detail: { pokemon },
			bubbles: true,
		});
		document.dispatchEvent(event);

		const offcanvasElement = document.getElementById("offcanvasExample");
		if (!offcanvasElement) return;

		const offcanvas =
			Offcanvas.getInstance(offcanvasElement) || new Offcanvas(offcanvasElement);
		offcanvas.show();
	};

	return { showPokemonInOffcanvas };
}
