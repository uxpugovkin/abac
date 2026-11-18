<!--
	TESTS PANEL — what a test run answered, in the Testing mode.
	Two tabs: "Result" (the list of tests, or why the run failed) and "Problems".

	Figma:  sbertech-habibi → page "rego-playground"
	        screens 08-testing-1 … 3 (empty, results), 08-testing-7 … 9 and 04-… (failed run, problems)
	Local to the playground.

	Use:
		<TestsPanel run={null} onopen={(test) => …} />

	Props:
		run      null = nothing run yet | "results" = the tests ran | "failed" = the policy did not compile
		onopen   called with a test when its row is clicked (the page shows its details)

	"Failed only" hides the passed and skipped tests.
	"Go to problems" opens the Problems tab.
-->
<script>
	import { Button, Chip, Switch, Tag } from '#lib';
	import { tests, problems, statuses } from './data.js';
	import { notify } from './prototype.svelte.js';
	import Panel from './Panel.svelte';
	import Message from './Message.svelte';
	import ProblemsList from './ProblemsList.svelte';
	import FailedRun from './FailedRun.svelte';

	let { run = null, onopen } = $props();

	let tab = $state('result'); // "result" | "problems"
	let failedOnly = $state(false);

	let shownTests = $derived(failedOnly ? tests.filter((test) => test.status === 'failed') : tests);
	let totalMs = $derived(tests.reduce((sum, test) => sum + test.ms, 0));

	// Every problem of every group, for the count on the tab.
	let allProblems = problems.flatMap((group) => group.items);

	function testsWith(status) {
		return tests.filter((test) => test.status === status).length;
	}
</script>

<Panel flat>
	{#snippet head()}
		<Chip active={tab === 'result'} onclick={() => (tab = 'result')}>
			Result{run === 'results' ? ` ${tests.length}` : ''}
		</Chip>
		<Chip active={tab === 'problems'} onclick={() => (tab = 'problems')}>
			Problems{run === 'failed' ? ` ${allProblems.length}` : ''}
		</Chip>
	{/snippet}
	{#snippet actions()}
		{#if tab === 'problems' && run === 'failed'}
			<Button
				icon="search"
				label="Search"
				onclick={() => notify('Search is not part of this prototype')}
			/>
			<Button
				icon="tune"
				label="Filter"
				onclick={() => notify('Filters are not part of this prototype')}
			/>
		{/if}
	{/snippet}

	{#if !run}
		<Message text={'Results will appear after\nthe first run'} />
	{:else if tab === 'problems' && run === 'results'}
		<Message text="No problems found" />
	{:else if tab === 'problems'}
		<div class="body">
			<ProblemsList groups={problems} />
		</div>
	{:else if run === 'failed'}
		<FailedRun groups={problems} ongo={() => (tab = 'problems')} />
	{:else}
		<div class="summary">
			<div class="summary__counts">
				<Tag colour="success" size="s" icon="check">{testsWith('passed')}</Tag>
				<Tag colour="error" size="s" icon="close">{testsWith('failed')}</Tag>
				<Tag size="s" icon="minus">{testsWith('skipped')}</Tag>
				<span class="summary__total">{tests.length} tests</span>
			</div>
			<Switch bind:checked={failedOnly}>Failed only</Switch>
			<Tag size="s" icon="wait">{totalMs} ms</Tag>
		</div>

		<ul class="body tests">
			{#each shownTests as test (test.name)}
				{@const status = statuses[test.status]}
				<li>
					<button class="test" type="button" onclick={() => onopen?.(test)}>
						<span class="test__status">
							<Tag colour={status.colour} size="s" icon={status.icon}>{status.label}</Tag>
						</span>
						<span class="test__name">{test.name}</span>
						<span class="test__file" title="{test.file}:{test.line}">{test.file}:{test.line}</span>
						<span class="test__ms"><Tag size="s" icon="wait">{test.ms} ms</Tag></span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</Panel>

<style>
	.body {
		flex: 1;
		min-height: 0;
		overflow: auto;
	}

	/* ---------- The summary above the list ---------- */
	.summary {
		flex: none;
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 41px;
		padding: 2px 12px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
	}
	.summary__counts {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.summary__total {
		margin-inline-start: 8px;
	}

	/* ---------- One test (Figma "test-result-row") ---------- */
	.tests {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.test {
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		padding: 6px 12px;
		border: 0;
		background: transparent;
		color: var(--uncolorful-grey-primary);
		font: var(--text-body-c);
		text-align: start;
		cursor: pointer;
	}
	.test:hover {
		background: var(--uncolorful-grey-border);
	}
	/* Every status tag is as wide, so the names line up. */
	.test__status {
		flex: none;
		display: flex;
		width: 84px;
	}
	.test__status > :global(*) {
		flex: 1;
		justify-content: center;
	}
	.test__name,
	.test__file {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.test__name {
		flex: 0 1 auto;
		max-width: 360px;
	}
	.test__file {
		flex: 1;
		min-width: 80px;
		margin-inline-start: -8px; /* name and path sit 8px apart (the row gap is 16) */
		color: var(--uncolorful-grey-tertiary);
	}
	.test__ms {
		flex: none;
		display: flex;
		width: 56px;
	}
	.test__ms > :global(*) {
		flex: 1;
		justify-content: center;
	}
</style>
