<!--
	STATE PANEL — the tiny floating panel for whoever reviews the prototype.
	It is NOT part of the product. It switches what the screens pretend:

		Run answers   Allow · Deny              what "Run" decides (Execution)
		Tests         Results · Failed run      what a test run gives (Testing)
		Theme         Light · Dark · Olive · Olive Night
		Right-to-left

	It only changes `proto` (see prototype.svelte.js); the screens react to it,
	also after a run — no need to run again.

	Use — once, at the end of the prototype page:
		<StatePanel />

	To add a switch: add a field to `proto`, then one row here.
-->
<script>
	import { Button, Segmented, Select, Switch } from '#lib';
	import { proto } from './prototype.svelte.js';

	let open = $state(true);

	const decisions = [
		{ value: 'allow', label: 'Allow' },
		{ value: 'deny', label: 'Deny' }
	];
	const testRuns = [
		{ value: 'results', label: 'Results' },
		{ value: 'failed', label: 'Failed run' }
	];
	const themes = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'olive', label: 'Olive' },
		{ value: 'olive-night', label: 'Olive Night' }
	];
</script>

<aside class="panel" aria-label="Prototype states">
	{#if open}
		<div class="panel__card">
			<div class="panel__head">
				<span class="hb-text-body-e-bold">Prototype states</span>
				<Button mode="ghost" icon="minus" label="Hide the panel" onclick={() => (open = false)} />
			</div>

			<div class="panel__row">
				<span class="hb-text-body-d">Run answers</span>
				<Segmented options={decisions} bind:value={proto.decision} />
			</div>
			<div class="panel__row">
				<span class="hb-text-body-d">Tests</span>
				<Segmented options={testRuns} bind:value={proto.tests} />
			</div>
			<div class="panel__row">
				<span class="hb-text-body-d">Theme</span>
				<div class="panel__select">
					<Select options={themes} bind:value={proto.theme} aria-label="Theme" />
				</div>
			</div>
			<div class="panel__row">
				<span class="hb-text-body-d">Right-to-left</span>
				<Switch bind:checked={proto.rtl} label="Right-to-left" />
			</div>
		</div>
	{:else}
		<Button icon="tune" label="Prototype states" onclick={() => (open = true)} />
	{/if}
</aside>

<style>
	.panel {
		position: fixed;
		bottom: 16px;
		inset-inline-end: 16px;
		z-index: 100; /* above everything, also above the test details */
	}
	/* No cast shadows: a 1px line sets the panel apart from the page. */
	.panel > :global(.hb-btn) {
		box-shadow: 0 0 0 1px var(--uncolorful-grey-border);
	}
	.panel__card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px 12px 12px;
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-surface);
		box-shadow: 0 0 0 1px var(--uncolorful-grey-border);
	}
	.panel__head,
	.panel__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}
	.panel__head {
		color: var(--uncolorful-grey-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.panel__row > span {
		color: var(--uncolorful-grey-secondary);
	}
	.panel__select {
		width: 136px;
	}
</style>
