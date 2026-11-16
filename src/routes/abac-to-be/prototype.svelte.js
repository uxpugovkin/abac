/*
	PROTOTYPE STATE — what the little "Prototype states" panel switches.
	Every screen of the ABAC prototype reads it, so one click changes them all.

	Use:
		import { proto, notify } from './prototype.svelte.js';
		{#if proto.data === 'loading'} … {/if}
		notify('Copied');                      ← a short message at the bottom of the screen

	proto.data      what the server "answered":  "ready" | "loading" | "empty" | "error"
	proto.compare   what a comparison finds (it is mocked, see data.js):
	                "diff" (differences) | "same" (no differences) | "nothing" (nothing to compare)
	proto.theme     "light" | "dark" | "olive" | "olive-night".  Figma draws ABAC in olive
	proto.rtl       true = right-to-left
	proto.toast     the message on screen now: { text, type } or null
*/

export const proto = $state({
	data: 'ready',
	compare: 'diff',
	theme: 'olive',
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
