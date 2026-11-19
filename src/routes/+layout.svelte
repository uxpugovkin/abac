<!--
	The frame around EVERY page of the site.
	It loads the design tokens once, so all pages get colours, fonts and sizes,
	and it counts visits of the docs and the prototypes (see goatcounter.js).
-->
<script>
	import '#lib/tokens/index.css';
	import { afterNavigate } from '$app/navigation';
	import { countVisit } from './goatcounter.js';

	let { children } = $props();

	afterNavigate((navigation) => countVisit(navigation));
</script>

<svelte:head>
	<title>Habibi UI</title>
</svelte:head>

{@render children()}
