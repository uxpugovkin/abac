<!--
	The frame around EVERY page of the site.
	It loads the design tokens once, so all pages get colours, fonts and sizes.
-->
<script>
	import '#lib/tokens/index.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Habibi UI</title>
</svelte:head>

{@render children()}
