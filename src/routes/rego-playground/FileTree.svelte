<!--
	FILE TREE — the folders and files of the project.

	Figma:  sbertech-habibi → page "rego-playground" → "File-Tree"
	Local to the playground. Built from Tree.

	Use:
		<FileTree width={228} />

	Props:
		width   how wide the white card is, in px (the splitter next to it changes it)

	In this prototype the tree leads nowhere: folders open and close, a file can be
	picked, but the editor always shows policy.rego.
-->
<script>
	import { Tree } from '#lib';
	import { files } from './data.js';

	let { width = 228 } = $props();

	let selected = $state('');
</script>

<div class="files" style:width="{width}px">
	<div class="files__tree">
		<Tree nodes={files} bind:selected />
	</div>
</div>

<style>
	.files {
		flex: none;
		display: flex;
		flex-direction: column;
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
