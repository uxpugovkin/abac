<!--
	PROBLEMS LIST — what a failed test run reports, grouped by test.
	A group opens and closes; each row is one error or warning.

	Figma:  sbertech-habibi → page "rego-playground" → "problems-list"
	        ("problem-group-header" + "problem-item"; screens 04-…-problems and -problems-hover)
	Local to the playground.

	Use:
		<ProblemsList groups={problems} query="unused" />

	Props:
		groups   the groups (see `problems` in data.js)
		query    only rows that contain this text are shown (case does not matter)

	A group header shows "Compilation error" when the test did not compile,
	otherwise how many errors and warnings it has.
	Under the mouse, a row shows a button to its documentation (not part of this prototype).
-->
<script>
	import { Button, Icon, Tag, Tooltip } from '#lib';
	import { notify } from './prototype.svelte.js';
	import Message from './Message.svelte';

	let { groups = [], query = '' } = $props();

	// Which groups are open:  { 'test name': true, … }. Starts from `open: true` in the data.
	// (Only the starting value of `groups` is used here, on purpose — hence the ignore.)
	// svelte-ignore state_referenced_locally
	let open = $state(Object.fromEntries(groups.map((group) => [group.test, !!group.open])));

	let words = $derived(query.trim().toLowerCase());

	// The groups with only their matching rows; groups left with no rows are hidden.
	let shown = $derived(
		groups
			.map((group) => ({
				...group,
				items: group.items.filter((item) => item.text.toLowerCase().includes(words))
			}))
			.filter((group) => group.items.length > 0)
	);

	function count(group, kind) {
		return group.items.filter((item) => item.kind === kind).length;
	}
</script>

{#each shown as group (group.test)}
	{@const compiled = count(group, 'compile') === 0}
	<section class="group">
		<button
			class="group__head"
			type="button"
			aria-expanded={open[group.test]}
			onclick={() => (open[group.test] = !open[group.test])}
		>
			<Icon name={open[group.test] ? 'chevron-up' : 'chevron-down'} size={20} />
			<span class="group__text">
				<span class="hb-text-body-c group__name">{group.test}</span>
				<span class="hb-text-body-d group__file">{group.file}</span>
			</span>
			<span class="group__tags">
				{#if !compiled}
					<Tag colour="error" size="s" icon="wrong">Compilation error</Tag>
				{:else}
					<Tag colour="error" size="s" icon="wrong">{count(group, 'error')}</Tag>
					<Tag colour="warning" size="s" icon="warning">{count(group, 'warning')}</Tag>
				{/if}
			</span>
		</button>

		{#if open[group.test]}
			{#each group.items as item}
				{@const [line, column] = item.at.split(':')}
				<div class="item">
					<span class="item__icon item__icon--{item.kind === 'warning' ? 'warning' : 'error'}">
						<Icon name={item.kind === 'warning' ? 'warning' : 'wrong'} size={20} />
					</span>
					<p class="item__text hb-text-code-s">
						{item.text}<span class="item__mark">{' — '}</span>{line}<span class="item__mark">:</span
						>{column}
					</p>
					<span class="item__docs">
						<Tooltip text="View in documentation" placement="bottom">
							<Button
								appearance="accent"
								mode="ghost"
								icon="info"
								label="View in documentation"
								onclick={() => notify('Documentation is not part of this prototype')}
							/>
						</Tooltip>
					</span>
				</div>
			{/each}
		{/if}
	</section>
{:else}
	<Message text="No problems match “{query}”" />
{/each}

<style>
	.group {
		padding: 4px 0;
		border-bottom: 1px solid var(--uncolorful-grey-border);
	}
	.group__head {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 4px 12px;
		border: 0;
		background: transparent;
		color: var(--uncolorful-grey-primary);
		text-align: start;
		cursor: pointer;
	}
	.group__text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	.group__name,
	.group__file {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.group__name {
		color: var(--boring-blue-50);
	}
	.group__file {
		color: var(--uncolorful-grey-secondary);
	}
	.group__tags {
		flex: none;
		display: flex;
		gap: 4px;
	}

	/* One problem: icon, message (code font), and the docs button under the mouse. */
	.item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-block: 4px;
		padding-inline: 36px 12px;
	}
	.item:hover {
		background: var(--uncolorful-grey-border);
	}
	.item__icon {
		flex: none;
		display: flex;
	}
	.item__icon--error {
		color: var(--traffic-light-red-50);
	}
	.item__icon--warning {
		color: var(--shitpile-orange-50);
	}
	.item__text {
		flex: 1;
		min-width: 0;
		margin: 0;
		color: var(--uncolorful-grey-primary);
	}
	.item__mark {
		color: var(--uncolorful-grey-tertiary);
	}
	/* The docs button keeps its place, but only shows under the mouse or with the keyboard.
	   (Opacity, not visibility: a hidden button could not be reached with Tab.) */
	.item__docs {
		flex: none;
		opacity: 0;
	}
	.item:hover .item__docs,
	.item:focus-within .item__docs {
		opacity: 1;
	}
</style>
