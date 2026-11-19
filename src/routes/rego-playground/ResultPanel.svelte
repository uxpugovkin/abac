<!--
	RESULT PANEL — what "Run" answered, in the Execution mode.
	Two tabs: "Result" (the decision and what came with it) and "Problems".

	Figma:  sbertech-habibi → page "rego-playground" → "Result-Panel"
	        (screens 05-rego-playground-result-allow, -deny, -problems-empty)
	Local to the playground.

	Use:
		<ResultPanel result={null} />                        ← not run yet
		<ResultPanel result={{ decision: 'allow', ...results.allow }} />
		<ResultPanel result={{ decision: 'failed' }} />          ← the policy did not compile

	Props:
		result   null = nothing run yet. Otherwise { decision: "allow" | "deny", ms, sections }
		         (see `results` in data.js), or { decision: "failed" }

	"Show as JSON" off: each section with a title. On: all of them as one JSON.
	A failed run shows its problems (`runProblems` in data.js); other runs have none.
-->
<script>
	import { Button, Chip, Switch, Tag } from '#lib';
	import { opaVersion, runProblems, sectionsJson, sectionsText } from './data.js';
	import { copy, notBuilt } from './prototype.svelte.js';
	import Panel from './Panel.svelte';
	import Code from './Code.svelte';
	import Message from './Message.svelte';
	import ProblemsList from './ProblemsList.svelte';
	import FailedRun from './FailedRun.svelte';

	let { result = null } = $props();

	let tab = $state('result'); // "result" | "problems"
	let asJson = $state(false);

	let failed = $derived(result?.decision === 'failed');
	let problemCount = runProblems.flatMap((group) => group.items).length;

	let text = $derived(
		result && !failed
			? asJson
				? sectionsJson(result.sections)
				: sectionsText(result.sections)
			: ''
	);
</script>

<Panel flat>
	{#snippet head()}
		<Chip active={tab === 'result'} onclick={() => (tab = 'result')}>Result</Chip>
		<Chip active={tab === 'problems'} onclick={() => (tab = 'problems')}>
			Problems{failed ? ` ${problemCount}` : ''}
		</Chip>
	{/snippet}
	{#snippet actions()}
		{#if tab === 'problems'}
			<Button icon="search" label="Search" onclick={() => notBuilt('Search')} />
			<Button icon="tune" label="Filter" onclick={() => notBuilt('Filtering')} />
		{:else if result && !failed}
			<Button icon="search" label="Search" onclick={() => notBuilt('Search')} />
			<Button icon="duplicate" label="Copy" onclick={() => copy(text)} />
		{/if}
	{/snippet}

	{#if tab === 'problems' && failed}
		<div class="body">
			<ProblemsList groups={runProblems} />
		</div>
	{:else if tab === 'problems'}
		<Message text="No problems found" />
	{:else if !result}
		<Message text={'Results will appear after\nthe first execution'} />
	{:else if failed}
		<FailedRun groups={runProblems} ongo={() => (tab = 'problems')} />
	{:else}
		<div class="summary">
			<div class="summary__tags">
				{#if result.decision === 'allow'}
					<Tag colour="success" size="s" icon="done">Allow</Tag>
				{:else}
					<Tag colour="error" size="s" icon="close">Deny</Tag>
				{/if}
				<Tag size="s" icon="wait">{result.ms} ms</Tag>
				<Tag size="s" icon="info">opaVersion {opaVersion}</Tag>
			</div>
			<Switch bind:checked={asJson}>Show as JSON</Switch>
		</div>
		<div class="body">
			<Code {text} />
		</div>
	{/if}
</Panel>

<style>
	.summary {
		flex: none;
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 41px;
		padding: 2px 12px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
	}
	.summary__tags {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 4px;
		overflow: hidden;
	}
	.body {
		flex: 1;
		min-height: 0;
		overflow: auto;
	}
</style>
