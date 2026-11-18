/*
	PROTOTYPE STATE — what the little "Prototype states" panel switches.
	Every screen of the playground reads it, so one click changes them all.

	Use:
		import { proto, notify } from './prototype.svelte.js';
		{#if proto.decision === 'allow'} … {/if}
		notify('Copied');                      ← a short message at the bottom of the screen

	proto.decision  what "Run" answers in Execution:
	                "allow" | "deny" | "failed" (the policy did not compile: see its problems)
	proto.tests     what a test run answers in Testing:
	                "results" (the list of tests) | "failed" (the policy did not compile)
	proto.theme     "light" | "dark" | "olive" | "olive-night".  Figma draws most screens in light
	proto.rtl       true = right-to-left
	proto.toast     the message on screen now: { text, type } or null

	Nothing is really run: the answers are made up (see data.js).
*/

export const proto = $state({
	decision: 'allow',
	tests: 'results',
	theme: 'light',
	rtl: false,
	toast: null
});

let timer;

/** Shows a short message for 3 seconds. `type` is a Notification type. */
export function notify(text, type = 'info') {
	clearTimeout(timer);
	proto.toast = { text, type };
	timer = setTimeout(() => (proto.toast = null), 3000);
}

/** Copies a text and says so. */
export function copy(text) {
	navigator.clipboard?.writeText(text);
	notify('Copied', 'success');
}
