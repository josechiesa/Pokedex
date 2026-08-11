# Pokedex

This template should help get you started developing with Vue 3 in Vite.

## Resumen de tecnologías

Para construir esta aplicación pensé en una arquitectura que priorizara rendimiento, reutilización y una experiencia fluida para el usuario. Utilicé Vue 3 con Vite para desarrollar una interfaz moderna y ágil, y Vue Router para manejar la navegación entre las distintas vistas. Para optimizar la carga de datos, implementé un scroll infinito que permite ir trayendo información de forma progresiva sin que la experiencia se sienta lenta o pesada.

También decidí centralizar la información más relevante en Pinia, para mantener el estado de la aplicación organizado y evitar duplicaciones. Además, almacené parte de la data en localStorage para dejarla en caché y mejorar la velocidad de acceso, especialmente en la gestión del pokedex. En cuanto a las peticiones HTTP, utilicé Axios para estructurar mejor las llamadas a la API y manejar la comunicación con el backend de forma más limpia. Por otro lado, construí componentes reutilizables y composables para encapsular lógica repetida, facilitar el mantenimiento del proyecto y acelerar el desarrollo de nuevas funcionalidades.

Para asegurar calidad, ESLint para mantener un código más consistente y limpio.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
