<!--
	TEST DETAILS — one test of a run, in a panel that slides over the page from the far side.
	Status, package and file; a failed test also shows what it expected.

	Figma:  sbertech-habibi → page "rego-playground"
	        → 08-testing-4-details-failed, -5-details-passed, -6-details-skipped
	Local to the playground (habibi-library has no drawer yet).

	Use:
		<TestDetails test={tests[0]} onclose={() => (openTest = null)} />

	Props:
		test      the test (see `tests` in data.js)
		onclose   called when × is clicked, the dark area is clicked, or Esc is pressed
-->
<script>
	import { Button, Tag } from '#lib';
	import { expectedEffect, sectionsText, statuses, testPackage } from './data.js';
	import { copy } from './prototype.svelte.js';
	import Panel from './Panel.svelte';
	import Code from './Code.svelte';

	let { test, onclose } = $props();

	let searching = $state(false);

	let status = $derived(statuses[test.status]);
	let expected = sectionsText([expectedEffect]);
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && onclose?.()} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="shade" onclick={onclose}></div>

<div class="drawer" role="dialog" aria-modal="true" aria-label={test.name}>
	<header class="head">
		<h2 class="hb-text-h2">{test.name}</h2>
		<Button mode="ghost" size="m" icon="close" label="Close" onclick={onclose} />
	</header>

	<div class="field">
		<span class="hb-text-body-d field__label">Status</span>
		<span class="field__tags">
			<Tag colour={status.colour} icon={status.icon}>{status.label}</Tag>
			<Tag icon="wait">{test.ms} ms</Tag>
		</span>
	</div>
	<hr />
	<div class="field">
		<span class="hb-text-body-d field__label">Package</span>
		<span class="hb-text-body-c">{testPackage}</span>
	</div>
	<hr />
	<div class="field">
		<span class="hb-text-body-d field__label">File</span>
		<span class="hb-text-body-c">{test.file}:{test.line}</span>
	</div>

	{#if test.status === 'failed'}
		<div class="expected">
			<Panel>
				{#snippet head()}
					<Button
						appearance={searching ? 'accent' : 'default'}
						icon="search"
						label="Search"
						onclick={() => (searching = !searching)}
					/>
				{/snippet}
				{#snippet actions()}
					<Button appearance="white" icon="duplicate" label="Copy" onclick={() => copy(expected)} />
				{/snippet}

				<Code text={expected} {searching} />
			</Panel>
		</div>
	{/if}
</div>

<style>
	/* The dark area over the page behind the panel. */
	.shade {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: var(--opacity-16);
		backdrop-filter: blur(4px);
	}
	.drawer {
		position: fixed;
		top: 0;
		bottom: 0;
		inset-inline-end: 0;
		z-index: 41;
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 600px;
		max-width: 100vw;
		padding: 24px;
		background: var(--uncolorful-grey-background);
		border-inline-start: 1px solid var(--uncolorful-grey-border);
	}
	.head {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-bottom: 8px; /* 16px between the title and the body, as in Figma */
	}
	.head h2 {
		flex: 1;
		min-width: 0;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.field__label {
		color: var(--uncolorful-grey-secondary);
	}
	.field__tags {
		display: flex;
		gap: 4px;
	}
	hr {
		width: 100%;
		margin: 4px 0 3px;
		border: 0;
		border-top: 1px solid var(--uncolorful-grey-border);
	}
	/* What the failed test expected: a white card that takes the rest of the height. */
	.expected {
		flex: 1;
		min-height: 0;
		display: flex;
		margin-top: 16px;
		border-radius: var(--radius-m);
		overflow: hidden;
	}
</style>
