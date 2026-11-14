/* ==========================================================================
   PROJECT SETTINGS
   This one file configures both Vite (the build tool) and SvelteKit.
   ========================================================================== */

import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			// Build the site as plain files (HTML, CSS, JS) that any static host can serve.
			adapter: adapter(),

			// On GitHub Pages the site lives at  https://<user>.github.io/<repo name>/ ,
			// e.g. /habibi-ui/, so every link needs that in front.
			// The deploy workflow sets BASE_PATH from the repo name, so a rename needs no change here.
			// On your own computer it is empty and the site lives at "/".
			paths: { base: process.env.BASE_PATH ?? '' },

			compilerOptions: {
				// Use Svelte 5 "runes" ($state, $props, …) in all our files.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			}
		})
	]
});
