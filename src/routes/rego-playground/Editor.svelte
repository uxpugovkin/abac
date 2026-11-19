<!--
	EDITOR — the policy being worked on, as code. Read only in this prototype.

	Figma:  sbertech-habibi → page "rego-playground" → "Editor"
	Local to the playground.

	Use:
		<Editor />

	It always shows policy.rego: the file tabs and the file tree lead nowhere.
	Copy copies the whole file. Search is drawn but not built (it says so).
-->
<script>
	import { Button } from '#lib';
	import { policy } from './data.js';
	import { copy, notBuilt } from './prototype.svelte.js';
	import Panel from './Panel.svelte';
	import Code from './Code.svelte';
</script>

<Panel>
	{#snippet head()}policy.rego{/snippet}
	{#snippet actions()}
		<Button icon="search" label="Search" onclick={() => notBuilt('Search')} />
		<Button icon="duplicate" label="Copy" onclick={() => copy(policy)} />
	{/snippet}

	<Code text={policy} language="rego" />
</Panel>
