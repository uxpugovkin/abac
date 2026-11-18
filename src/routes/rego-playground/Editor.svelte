<!--
	EDITOR — the policy being worked on, as code. Read only in this prototype.

	Figma:  sbertech-habibi → page "rego-playground" → "Editor"
	Local to the playground.

	Use:
		<Editor />

	It always shows policy.rego: the file tabs and the file tree lead nowhere.
	Search marks the lines that contain the text; Copy copies the whole file.
-->
<script>
	import { Button } from '#lib';
	import { policy } from './data.js';
	import { copy } from './prototype.svelte.js';
	import Panel from './Panel.svelte';
	import Code from './Code.svelte';

	let searching = $state(false);
</script>

<Panel>
	{#snippet head()}policy.rego{/snippet}
	{#snippet actions()}
		<Button
			appearance={searching ? 'accent' : 'default'}
			icon="search"
			label="Search"
			onclick={() => (searching = !searching)}
		/>
		<Button appearance="white" icon="duplicate" label="Copy" onclick={() => copy(policy)} />
	{/snippet}

	<Code text={policy} language="rego" {searching} />
</Panel>
