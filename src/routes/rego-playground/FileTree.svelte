<!--
	FILE TREE — the folders and files of the project, with a search on top.

	Figma:  sbertech-habibi → page "rego-playground" → "File-Tree"
	Local to the playground. Built from TextInput and Tree.

	Use:
		<FileTree width={228} />

	Props:
		width   how wide the white card is, in px (the splitter next to it changes it)

	In this prototype the tree leads nowhere: folders open and close, a file can be
	picked, but the editor always shows policy.rego. The search filters the top folders
	by name.
-->
<script>
	import { TextInput, Tree } from '#lib';
	import { files } from './data.js';

	let { width = 228 } = $props();

	let query = $state('');
	let selected = $state('');

	let shown = $derived(
		files.filter((node) => node.label.toLowerCase().includes(query.trim().toLowerCase()))
	);
</script>

<div class="files" style:width="{width}px">
	<TextInput icon="search" placeholder="Search" aria-label="Search files" bind:value={query} />

	<div class="files__tree">
		<Tree nodes={shown} bind:selected />
	</div>
</div>

<style>
	.files {
		flex: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-block: 8px;
		margin-inline-start: 8px;
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
