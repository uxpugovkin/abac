<!--
	FILE TREE — the folders and files of the project, with a search field on top.

	Figma:  sbertech-habibi → page "rego-playground" → "File-Tree"
	Local to the playground. Built from TextInput and Tree.

	Use:
		<FileTree width={228} />

	Props:
		width   how wide the white card is, in px (the splitter next to it changes it)

	In this prototype the tree leads nowhere: folders open and close, a file can be
	picked, but the editor always shows policy.rego. The search field is drawn but
	not built: Enter says so, like the search buttons.
-->
<script>
	import { TextInput, Tree } from '#lib';
	import { files } from './data.js';
	import { notBuilt } from './prototype.svelte.js';

	let { width = 228 } = $props();

	let selected = $state('');
	let query = $state('');
</script>

<div class="files" style:width="{width}px">
	<TextInput
		icon="search"
		placeholder="Search"
		aria-label="Search files"
		bind:value={query}
		onkeydown={(event) => event.key === 'Enter' && notBuilt('Search')}
	/>
	<div class="files__tree">
		<Tree nodes={files} bind:selected />
	</div>
</div>

<style>
	.files {
		flex: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-block: 8px;
		margin-inline: 8px 4px; /* 4px of room before the splitter, as in Figma */
		padding: 12px;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	.files__tree {
		flex: 1;
		min-height: 0;
		overflow: auto;
	}
</style>
