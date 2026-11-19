<!--
	APP FRAME — a helper used only by the table guidelines page.
	A small fake application window: the library Sidebar on one side, a page on the other.
	It gives the "Button placement" examples something to sit in.

	Use:
		<AppFrame>
			…the page: title, tabs, toolbar, table…
		</AppFrame>

	The menu can be collapsed (a click on the person), like in a real product.
-->
<script>
	import { Select, Sidebar } from '#lib';
	import { photos } from '../employees.js';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	let { children } = $props();

	const t = pick(content.tables.app); // the example texts, in the current language

	// The domain ids are the same in every language.
	const domains = ['res-domain-144', 'res-domain-145'];

	let collapsed = $state(false);
	let domain = $state(domains[0]);
</script>

<div class="app">
	<Sidebar
		title="ABAC"
		subtitle="Platform V"
		items={t.menu}
		active="users"
		name={t.tatiana}
		role={t.superAdmin}
		photo={photos[6]}
		bind:collapsed
	>
		{#snippet select()}
			<Select big label={t.currentDomain} options={domains} bind:value={domain} />
		{/snippet}
	</Sidebar>

	<div class="line"></div>
	<div class="page">{@render children()}</div>
</div>

<style>
	/* The whole app window — side menu AND page — is one white box.
	   (The bordered card around it comes from the guidelines page; its 16px of
	   padding is cancelled here so the app fills the card edge to edge.) */
	.app {
		display: flex;
		margin: -16px;
		background: var(--uncolorful-grey-surface);
	}
	/* The menu and the page are both white: a 1px line sets them apart. */
	.line {
		flex: none;
		width: 1px;
		background: var(--uncolorful-grey-border);
	}
	.page {
		flex: 1;
		min-width: 0;
		padding: 24px 24px 0;
	}
</style>
