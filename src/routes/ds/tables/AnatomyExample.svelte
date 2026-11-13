<!--
	ANATOMY EXAMPLE — guide only.
	The first example of the guidelines page: a table taken apart into its four
	parts, each in an outlined box with a purple label, as in Figma.

	Because every part needs its own box, the parts are placed by hand here.
	(A real page hands the toolbar and the summary to <Table>, see TableExample.svelte.)

	Use:
		<AnatomyExample />
-->
<script>
	import { Table } from '#lib';
	import { employees, formatScore, filterEmployees, sortEmployees } from '../employees.js';
	import { columnsWith, columnWidths } from './columns.js';
	import ExampleToolbar from './ExampleToolbar.svelte';
	import EmployeeCell from './EmployeeCell.svelte';

	const columns = columnsWith(columnWidths.normal);

	let query = $state('');
	let values = $state({});
	let sortKey = $state('score');
	let sortDirection = $state('desc');
	let selection = $state([]);

	let rows = $derived(
		sortEmployees(filterEmployees(employees.slice(0, 5), query, values), sortKey, sortDirection)
	);
	let total = $derived(rows.reduce((sum, person) => sum + person.score, 0));

	function sortBy(key) {
		// Clicking the same column again flips the direction.
		sortDirection = key === sortKey && sortDirection === 'desc' ? 'asc' : 'desc';
		sortKey = key;
	}
</script>

<!-- One part: [label ─] [outlined box]. -->
{#snippet part(label, content)}
	<div class="part">
		<span class="note">
			<span class="note__pill hb-text-body-d-bold">{label}</span>
			<span class="note__line"></span>
		</span>
		<div class="region">{@render content()}</div>
	</div>
{/snippet}

{#snippet title()}<h3 class="hb-table-title">Employees</h3>{/snippet}
{#snippet toolbar()}<ExampleToolbar bind:query bind:values />{/snippet}
{#snippet body()}
	<Table
		{columns}
		{rows}
		{sortKey}
		{sortDirection}
		onsort={sortBy}
		selectable
		bind:selection
		minWidth={872}
	>
		{#snippet cell(row, column)}<EmployeeCell {row} {column} />{/snippet}
	</Table>
{/snippet}
{#snippet summary()}
	<div class="hb-table__summary">
		<span>{rows.length} employees&nbsp;· {selection.length} selected</span>
		<span>Total: {formatScore(total)}</span>
	</div>
{/snippet}

<div class="anatomy">
	{@render part('Title', title)}
	{@render part('Toolbar', toolbar)}
	{@render part('Table body', body)}
	{@render part('Summary row', summary)}
</div>

<style>
	/* As in Figma: the parts are 8px apart, the boxes never touch,
	   and the labels sit in their own column on the side. */
	.anatomy {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.part {
		display: flex;
		align-items: center;
	}
	.region {
		flex: 1;
		min-width: 0;
		padding: 4px;
		border-radius: var(--radius-s);
		outline: 1px solid var(--accent-9);
		outline-offset: -1px;
	}
	/* Inside their boxes the title needs no room under it, the summary no line above it. */
	.region :global(.hb-table-title) {
		margin: 0;
	}
	.region :global(.hb-table__summary) {
		border-top: 0;
	}

	/* The label: a pill and a short line that reaches the box. */
	.note {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: 172px;
	}
	.note__pill {
		padding: 2px 10px;
		border-radius: var(--radius-full);
		background: var(--accent-9);
		color: var(--uncolorful-grey-surface);
		white-space: nowrap;
	}
	.note__line {
		width: 16px;
		height: 1px;
		background: var(--accent-9);
	}
</style>
