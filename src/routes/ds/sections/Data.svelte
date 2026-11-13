<!-- DOCS: Table, EmptyState, Splitter. -->
<script>
	import { resolve } from '$app/paths';
	import { Table, Tag, EmptyState, Splitter, Button } from '#lib';
	import Demo from '../Demo.svelte';
	import { employees, statusColour, sortEmployees } from '../employees.js';

	/* ---------- Table example: sorting and picking one row ---------- */

	const columns = [
		{ key: 'fullName', label: 'Full name', sortable: true },
		{ key: 'department', label: 'Department', sortable: true, width: 160 },
		{ key: 'status', label: 'Status', width: 120 },
		{ key: 'office', label: 'Office', width: 120 }
	];

	// The page (not the table) owns the sorting and the highlighted row.
	let sortKey = $state('fullName');
	let sortDirection = $state('asc');
	let picked = $state(undefined); // the id of the clicked row

	let rows = $derived(sortEmployees(employees.slice(0, 5), sortKey, sortDirection));

	function sortBy(key) {
		// Clicking the same column again flips the direction.
		sortDirection = key === sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
		sortKey = key;
	}

	/* ---------- EmptyState example ---------- */
	const emptyTypes = [
		{ type: 'empty', button: 'Create', icon: 'plus' },
		{ type: 'not-found', button: 'Clear filters', icon: 'close' },
		{ type: 'error', button: 'Try again', icon: 'refresh' },
		{ type: 'forbidden', button: 'Request access', icon: 'lock' },
		{ type: 'maintenance', button: 'Go back', icon: 'arrow-left' }
	];

	/* ---------- Splitter example ---------- */
	let leftWidth = $state(200);
</script>

<Demo
	title="Table"
	figma="table"
	about="Describe the columns, hand over the rows. Click a header to sort, click a row to pick it."
	column
>
	<Table
		{columns}
		{rows}
		{sortKey}
		{sortDirection}
		onsort={sortBy}
		selected={picked}
		onrowclick={(row) => (picked = row.id)}
	>
		{#snippet cell(row, column)}
			{#if column.key === 'status'}
				<Tag colour={statusColour[row.status]} size="s">{row.status}</Tag>
			{:else}
				{row[column.key]}
			{/if}
		{/snippet}
	</Table>
	<p class="hb-text-body-c more">
		Checkboxes, pinned columns, row actions, filters and the rest — all with live examples — are in
		the
		<a href={resolve('/ds/tables')}>table guidelines</a>.
	</p>
</Demo>

<Demo
	title="EmptyState"
	figma="Empty"
	about="What a screen shows when there is nothing to show. Five situations, each with its own monkey."
>
	{#each emptyTypes as item}
		<EmptyState type={item.type}>
			<Button appearance="accent" mode="primary" icon={item.icon}>{item.button}</Button>
		</EmptyState>
	{/each}
</Demo>

<Demo title="Splitter" figma="splitter" about="Drag the line between the two panels.">
	<div class="panels">
		<div class="panel" style="width: {leftWidth}px">Left · {leftWidth}px</div>
		<!-- The page decides the limits: here, between 120 and 400 px. -->
		<Splitter ondrag={(pixels) => (leftWidth = Math.min(400, Math.max(120, leftWidth + pixels)))} />
		<div class="panel panel--rest">Right</div>
	</div>
</Demo>

<style>
	.more {
		margin: 0;
		color: var(--uncolorful-grey-secondary);
	}
	.more a {
		color: var(--boring-blue-50);
	}
	.panels {
		display: flex;
		width: 100%;
		height: 120px;
	}
	.panel {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--uncolorful-grey-background);
		font: var(--text-body-c);
	}
	.panel--rest {
		flex: 1;
	}
</style>
