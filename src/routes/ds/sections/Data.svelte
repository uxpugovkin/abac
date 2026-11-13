<!-- DOCS: Table, EmptyState, Splitter. -->
<script>
	import { Table, Tag, Avatar, EmptyState, Splitter, Button } from '#lib';
	import Demo from '../Demo.svelte';

	// ---------- Table example ----------
	// The table is "data-driven": change these two lists and the table changes.
	const columns = [
		{ key: 'fullName', label: 'Full name', sortable: true },
		{ key: 'login', label: 'Login', sortable: true, width: 260 },
		{ key: 'status', label: 'Status', width: 120 },
		{ key: 'lastSync', label: 'Last sync', width: 120 }
	];
	const users = [
		{
			fullName: 'Brenda Gray Cooper',
			login: 'walker85@acme.corp',
			status: 'Active',
			lastSync: '12.08.2026'
		},
		{
			fullName: 'Constantin Polski',
			login: 'constantinopolski.b.e@acme.corp',
			status: 'Suspended',
			lastSync: '11.08.2026'
		},
		{
			fullName: 'Priyanka Venkataraman',
			login: 'priyanka.v@acme.corp',
			status: 'Active',
			lastSync: '12.08.2026'
		},
		{
			fullName: 'Jane Cooper',
			login: 'jane.cooper@acme.corp',
			status: 'Review',
			lastSync: '02.08.2026'
		}
	];
	const statusColour = { Active: 'success', Suspended: 'error', Review: 'warning' };

	// The page (not the table) owns the sorting and the selection.
	let sortKey = $state('fullName');
	let sortDirection = $state('asc');
	let selected = $state(undefined);

	let rows = $derived(
		[...users].sort(
			(a, b) => a[sortKey].localeCompare(b[sortKey]) * (sortDirection === 'asc' ? 1 : -1)
		)
	);

	function sortBy(key) {
		// Clicking the same column again flips the direction.
		sortDirection = key === sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
		sortKey = key;
	}

	// ---------- Splitter example ----------
	let leftWidth = $state(200);
</script>

<Demo
	title="Table"
	figma="table"
	about="Describe the columns, hand over the rows. Click a header to sort, click a row to select it. Rules for using tables: see Guidelines → Tables in the side menu."
>
	<Table
		{columns}
		{rows}
		{sortKey}
		{sortDirection}
		onsort={sortBy}
		{selected}
		onrowclick={(row) => (selected = row)}
	>
		{#snippet cell(row, column)}
			{#if column.key === 'fullName'}
				<div class="hb-table__person">
					<Avatar name={row.fullName} size="xs" />
					{row.fullName}
				</div>
			{:else if column.key === 'status'}
				<Tag colour={statusColour[row.status]} size="s">{row.status}</Tag>
			{:else}
				{row[column.key]}
			{/if}
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
