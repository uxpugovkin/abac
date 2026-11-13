<!-- DOCS: Table (three examples), EmptyState, Splitter. -->
<script>
	import { Table, Tag, Avatar, EmptyState, Splitter, Button, FilterChip, TextInput } from '#lib';
	import Demo from '../Demo.svelte';
	import { employees, statusColour, formatScore } from './employees.js';

	/* =====================================================================
	   Example 1 — the simplest table: sorting and picking one row
	   ===================================================================== */

	const simpleColumns = [
		{ key: 'fullName', label: 'Full name', sortable: true },
		{ key: 'department', label: 'Department', sortable: true, width: 160 },
		{ key: 'status', label: 'Status', width: 120 },
		{ key: 'office', label: 'Office', width: 120 }
	];

	// The page (not the table) owns the sorting and the highlighted row.
	let sortKey = $state('fullName');
	let sortDirection = $state('asc');
	let picked = $state(undefined); // the id of the clicked row

	let simpleRows = $derived(
		employees
			.slice(0, 5)
			.sort((a, b) => a[sortKey].localeCompare(b[sortKey]) * (sortDirection === 'asc' ? 1 : -1))
	);

	function sortBy(key) {
		// Clicking the same column again flips the direction.
		sortDirection = key === sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
		sortKey = key;
	}

	/* =====================================================================
	   Example 2 — a wide table: toolbar, filters, checkboxes, pinned column,
	   resizable columns, row actions, summary row, scrolling both ways
	   ===================================================================== */

	const wideColumns = [
		{ key: 'fullName', label: 'Employee', width: 220, pinned: true },
		{ key: 'status', label: 'Status', width: 130 },
		{ key: 'skills', label: 'Skills', width: 210 },
		{ key: 'department', label: 'Department', width: 180 },
		{ key: 'office', label: 'Office', width: 180 },
		{ key: 'score', label: 'Tetris score', width: 196, align: 'end', sortable: true }
	];

	let search = $state('');
	let onlyActive = $state(false);
	let ticked = $state([]); // ids of the ticked rows

	// Filtering happens here, in the page. The table just gets the result.
	let wideRows = $derived(
		employees
			.filter((person) => person.fullName.toLowerCase().includes(search.toLowerCase()))
			.filter((person) => !onlyActive || person.status === 'Active')
	);
	let total = $derived(wideRows.reduce((sum, person) => sum + person.score, 0));

	/* =====================================================================
	   Example 3 — two-level header, wrapping text, actions in their own
	   column, and pages ("select this page / all rows")
	   ===================================================================== */

	const groupedColumns = [
		{
			label: 'Full name',
			children: [
				{ key: 'lastName', label: 'Last name', width: 180, wrap: true },
				{ key: 'firstName', label: 'First name', width: 140, wrap: true }
			]
		},
		{ key: 'department', label: 'Department' },
		{ key: 'office', label: 'Office', width: 120 }
	];

	const PAGE_SIZE = 5;
	// Longest names first, so the wrapping is easy to see on page 1.
	const byNameLength = [...employees].sort((a, b) => b.fullName.length - a.fullName.length);

	let page = $state(0);
	let tickedPaged = $state([]); // ids of the ticked rows, across all pages
	let pageRows = $derived(byNameLength.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE));
	let lastPage = Math.ceil(byNameLength.length / PAGE_SIZE) - 1;

	/* ---------- Splitter example ---------- */
	let leftWidth = $state(200);
</script>

<Demo
	title="Table"
	figma="table"
	about="Describe the columns, hand over the rows. Click a header to sort, click a row to pick it. The rules for using tables are in Guidelines → Tables."
>
	<Table
		columns={simpleColumns}
		rows={simpleRows}
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
</Demo>

<Demo
	title="Table · wide"
	figma="Tables Guide"
	about="Toolbar and filters, checkboxes, a pinned first column, resizable columns (drag a header edge), actions on hover, a summary row. Scroll it sideways and down."
	column
>
	<div>
		<div class="hb-table-toolbar">
			<!-- The search covers one column, so the placeholder names it (guidelines 3.4). -->
			<div class="search">
				<TextInput icon="search" placeholder="Search by employee" bind:value={search} />
			</div>
			<FilterChip
				name="Status"
				value={onlyActive ? 'Active' : ''}
				onclick={() => (onlyActive = true)}
				onclear={() => (onlyActive = false)}
			/>
			<div class="hb-table-toolbar__end">
				<Button icon="download" label="Download" />
				<Button icon="settings" label="Table settings" />
			</div>
		</div>

		<Table
			columns={wideColumns}
			rows={wideRows}
			selectable
			bind:selection={ticked}
			resizable
			maxHeight={300}
			sortKey="score"
		>
			{#snippet cell(row, column)}
				{#if column.key === 'fullName'}
					<div class="hb-table__person">
						<Avatar name={row.fullName} size="xs" />
						<span>{row.fullName}</span>
					</div>
				{:else if column.key === 'status'}
					<Tag colour={statusColour[row.status]} size="s">{row.status}</Tag>
				{:else if column.key === 'skills'}
					<div class="hb-table__tags">
						{#each row.skills as skill}<Tag>{skill}</Tag>{/each}
					</div>
				{:else if column.key === 'score'}
					{formatScore(row.score)}
				{:else}
					{row[column.key]}
				{/if}
			{/snippet}

			{#snippet actions(row)}
				<Button mode="ghost" icon="edit" label="Edit {row.fullName}" />
				<Button mode="ghost" icon="download" label="Download" />
				<Button mode="ghost" icon="delete" label="Delete" />
			{/snippet}

			{#snippet summary()}
				<span>{wideRows.length} employees · {ticked.length} selected</span>
				<span>Total: {formatScore(total)}</span>
			{/snippet}
		</Table>
	</div>
</Demo>

<Demo
	title="Table · grouped"
	figma="Tables Guide"
	about="A two-level header (drag the edges: a parent resizes its children, a child borrows from its neighbour), text that wraps, actions in their own column, and pages."
	column
>
	<Table
		columns={groupedColumns}
		rows={pageRows}
		allRows={byNameLength}
		selectable
		bind:selection={tickedPaged}
		resizable
		actionsWidth={72}
	>
		{#snippet actions()}
			<Button mode="ghost" icon="edit" label="Edit" />
			<Button mode="ghost" icon="delete" label="Delete" />
		{/snippet}

		{#snippet summary()}
			<span>{tickedPaged.length} of {byNameLength.length} selected</span>
			<span class="pager">
				Page {page + 1} of {lastPage + 1}
				<Button
					mode="ghost"
					icon="chevron-left"
					label="Previous page"
					disabled={page === 0}
					onclick={() => page--}
				/>
				<Button
					mode="ghost"
					icon="chevron-right"
					label="Next page"
					disabled={page === lastPage}
					onclick={() => page++}
				/>
			</span>
		{/snippet}
	</Table>
</Demo>

<Demo title="EmptyState" figma="Empty" about="What a screen shows when there is nothing to show.">
	<EmptyState
		title="Nothing here yet"
		description="When items are added, they'll show up here. Create the first one to get started."
	>
		<Button appearance="accent" mode="primary" icon="plus">Add user</Button>
	</EmptyState>
	<EmptyState
		icon="search"
		title="No results found"
		description="Nothing matches your search or filters. Try different keywords or clear the filters."
	>
		<Button appearance="accent" mode="primary" icon="close">Clear filters</Button>
	</EmptyState>
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
	.search {
		width: 220px;
	}
	.pager {
		display: flex;
		align-items: center;
		gap: 4px;
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
