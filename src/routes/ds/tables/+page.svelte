<!--
	TABLE GUIDELINES  —  /ds/tables
	Shows the rules for working with tables.

	The text is NOT written here. It lives in one place:
		src/lib/components/table/GUIDELINES.md
	This page only reads that file and shows it nicely. To change a rule, edit the .md file.
-->
<script>
	import { resolve } from '$app/paths';
	import { marked } from 'marked';
	import { Button } from '#lib';

	// "?raw" means: give me the file's text as it is.
	import guidelines from '#lib/components/table/GUIDELINES.md?raw';

	// Turn the Markdown text into HTML once.
	const html = marked.parse(guidelines);
</script>

<svelte:head>
	<title>Table guidelines · Habibi UI</title>
</svelte:head>

<header class="bar">
	<Button mode="ghost" icon="arrow-left" href={resolve('/ds')} label="Back to the design system" />
	<strong class="hb-text-body-b-bold">Habibi UI · Guidelines</strong>
</header>

<!-- {@html} is safe here: the text comes from our own file, not from a visitor. -->
<article class="guide">{@html html}</article>

<style>
	.bar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 16px;
		height: 56px;
		padding: 0 24px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
		background: var(--uncolorful-grey-surface);
	}

	.guide {
		max-width: 760px;
		margin: 0 auto;
		padding: 24px 24px 96px;
		font: var(--text-body-b);
	}

	/* The HTML inside .guide is made from Markdown, so Svelte cannot see it
	   ahead of time. ":global" tells Svelte to style it anyway. */
	.guide :global(h1) {
		margin: 24px 0 8px;
		font: var(--text-display-b);
	}
	.guide :global(h2) {
		margin: 56px 0 0;
		padding-top: 24px;
		border-top: 1px solid var(--uncolorful-grey-border);
		font: var(--text-h1);
	}
	.guide :global(h3) {
		margin: 32px 0 8px;
		font: var(--text-h3);
		scroll-margin-top: 72px;
	}
	.guide :global(p),
	.guide :global(ul),
	.guide :global(ol) {
		margin: 8px 0;
	}
	.guide :global(li) {
		margin: 4px 0;
	}
	.guide :global(a) {
		color: var(--boring-blue-50);
	}
	.guide :global(code) {
		padding: 1px 4px;
		border-radius: var(--radius-s);
		background: var(--uncolorful-grey-border);
		font: var(--text-code-s);
	}
	.guide :global(table) {
		width: 100%;
		margin: 16px 0;
		border-collapse: collapse;
		font: var(--text-body-c);
	}
	.guide :global(th),
	.guide :global(td) {
		padding: 8px 12px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
		text-align: start;
		vertical-align: top;
	}
	.guide :global(th) {
		color: var(--uncolorful-grey-secondary);
		font: var(--text-body-d-bold);
	}
</style>
