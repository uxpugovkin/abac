<!--
	DESIGN SYSTEM DOCS  —  /ds
	One long page that shows every token and component, live.
	(The top bar and the side menu around it come from +layout.svelte.)

	The examples live in ./sections — one file per group.
	To document a new component: add a <Demo> to the right section file,
	and add its name to the `menu` list in +layout.svelte.
-->
<script>
	import Foundations from './sections/Foundations.svelte';
	import Buttons from './sections/Buttons.svelte';
	import Forms from './sections/Forms.svelte';
	import Navigation from './sections/Navigation.svelte';
	import Status from './sections/Status.svelte';
	import Data from './sections/Data.svelte';
	import { examples } from './examples.svelte.js';
</script>

<svelte:head>
	<title>Design system · Habibi UI</title>
</svelte:head>

<!-- When the examples language changes, the sections are made again from scratch,
     so every example starts over with its texts in the new language. -->
{#key examples.lang}
	<div class="sections">
		<h2 class="hb-text-h2">Foundations</h2>
		<Foundations />
		<h2 class="hb-text-h2">Basics</h2>
		<Buttons />
		<h2 class="hb-text-h2">Forms</h2>
		<Forms />
		<h2 class="hb-text-h2">Navigation and choice</h2>
		<Navigation />
		<h2 class="hb-text-h2">Status and feedback</h2>
		<Status />
		<h2 class="hb-text-h2">Data and layout</h2>
		<Data />
	</div>
{/key}

<style>
	.sections {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	h2 {
		margin: 24px 0 0;
	}
	h2:first-child {
		margin-top: 0;
	}
</style>
