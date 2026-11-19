/*
	GOATCOUNTER — counts visits of the docs (/ds, /ds/tables) and of every prototype.
	The home page is not counted.

	Dashboard: https://habibi-ui.goatcounter.com
	Pages show up there with their full address, e.g. /habibi-ui/rego-playground.

	Use — once, in +layout.svelte:
		afterNavigate((navigation) => countVisit(navigation));

	Why by hand: the site changes pages without reloading (SvelteKit), so GoatCounter's
	script cannot see those changes itself. We load the script once and tell it each page.

	Nothing is counted while working on your own computer: `npm run dev` skips it here,
	and GoatCounter itself ignores localhost (e.g. `npm run preview`).
*/

import { dev } from '$app/environment';
import { resolve } from '$app/paths';

const HOME = resolve('/'); // "/" here, "/habibi-ui/" on GitHub Pages

const COUNT_URL = 'https://habibi-ui.goatcounter.com/count';

let loading; // the GoatCounter script, once it has been asked for

/** Counts one page visit. Gets SvelteKit's `navigation` from afterNavigate. */
export async function countVisit(navigation) {
	const to = navigation.to?.url;
	if (dev || !to) return;

	// The home page is not counted.
	if (to.pathname === HOME || `${to.pathname}/` === HOME) return;

	// A jump inside the same page (e.g. to #sidebar on /ds) is not a new visit.
	if (navigation.from?.url.pathname === to.pathname) return;

	await loadScript();
	window.goatcounter.count({ path: to.pathname });
}

function loadScript() {
	if (!loading) {
		loading = new Promise((resolve) => {
			const script = document.createElement('script');
			script.src = 'https://gc.zgo.at/count.js';
			script.async = true;
			script.dataset.goatcounter = COUNT_URL;
			// Do not count by itself when it loads: countVisit says what to count.
			script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
			script.onload = resolve; // if a blocker stops the script, nothing is counted — fine
			document.head.append(script);
		});
	}
	return loading;
}
