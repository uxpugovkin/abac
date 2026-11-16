<!--
	HISTORY — every change of one user, newest first. Any old state (a "snapshot")
	can be compared with the current one.

	Figma:  sbertech-habibi → page "abac-r5" → "domain-history-option-a" → 4-1
	Rules:  the table follows src/lib/components/table/guidelines.js

	Use:
		<HistoryPage {user} onback={…} onuser={…} oncompare={(snapshot) => …} />

	Props:
		user        one user from data.js
		onback      called when "Users" in the breadcrumbs is clicked
		onuser      called when the user's login in the breadcrumbs is clicked
		oncompare   called with a snapshot when its "Compare with the current" button is clicked

	What it shows depends on `proto.data` (the state panel):
		ready · loading (grey bars) · empty ("No history yet") · error
-->
<script>
	import {
		Table,
		TableToolbar,
		Button,
		SearchChip,
		FilterChip,
		Menu,
		MenuItem,
		Tag,
		Marker,
		Skeleton,
		EmptyState
	} from '#lib';
	import { snapshots, operations, formatSync, sortRows } from './data.js';
	import { proto } from './prototype.svelte.js';
	import Breadcrumbs from './Breadcrumbs.svelte';

	let { user, onback, onuser, oncompare } = $props();

	const columns = [
		{ key: 'time', label: 'Timestamp', width: 176, sortable: true },
		{ key: 'operation', label: 'Operation', width: 104 },
		{ key: 'type', label: 'Type', width: 136 },
		{ key: 'author', label: 'Author', width: 176 },
		{ key: 'id', label: 'ID' }
	];

	// The values of a column, each once — for the lists of the filters.
	const valuesOf = (key) => [...new Set(snapshots.map((snapshot) => snapshot[key]))].sort();

	/* The filters: one per column. `options` are [value, text] pairs. */
	const filters = [
		{
			id: 'operation',
			name: 'Operation',
			options: Object.entries(operations).map(([value, operation]) => [value, operation.label])
		},
		{ id: 'type', name: 'Type', options: valuesOf('type').map((value) => [value, value]) },
		{ id: 'author', name: 'Author', options: valuesOf('author').map((value) => [value, value]) }
	];

	/* ---------- What this screen remembers ---------- */

	let query = $state('');
	let chosen = $state({}); // the picked values: { operation: 'update', … }
	let sortDirection = $state('desc'); // by time: newest first
	let openMenu = $state(''); // the id of the filter whose list is open, or ''

	/* ---------- Rows: the page filters and sorts, the Table only shows ---------- */

	let rows = $derived.by(() => {
		const words = query.trim().toLowerCase();
		const matching = snapshots.filter(
			(snapshot) =>
				(!words ||
					[snapshot.author, snapshot.id].some((text) => text.toLowerCase().includes(words))) &&
				filters.every((filter) => !chosen[filter.id] || snapshot[filter.id] === chosen[filter.id])
		);
		return sortRows(matching, 'time', sortDirection);
	});

	const loadingRows = Array.from({ length: 12 }, (_, index) => ({ id: index, loading: true }));

	function clearFilters() {
		query = '';
		chosen = {};
	}
	function choose(id, value) {
		chosen = { ...chosen, [id]: value };
		openMenu = '';
	}
	function unchoose(id) {
		chosen = Object.fromEntries(Object.entries(chosen).filter(([other]) => other !== id));
	}
	function textOf(filter) {
		return filter.options.find(([value]) => value === chosen[filter.id])?.[1] ?? '';
	}
</script>

<!-- Clicking anywhere else closes the open list. -->
<svelte:window onclick={() => (openMenu = '')} />

<div class="screen">
	<header class="head">
		<Breadcrumbs
			items={[
				{ label: 'cyber-security-tenant' },
				{ label: 'res-domain-144', domains: true },
				{ label: 'Users', onclick: onback },
				{ label: user.login, onclick: onuser }
			]}
		/>
		<h1 class="hb-text-h2">History</h1>
	</header>

	{#if proto.data === 'error'}
		<div class="fill">
			<EmptyState
				type="error"
				title="Couldn't load the history"
				description="The domain did not answer. Check your connection and try again."
			>
				<Button
					appearance="accent"
					mode="primary"
					icon="refresh"
					onclick={() => (proto.data = 'ready')}>Try again</Button
				>
			</EmptyState>
		</div>
	{:else if proto.data === 'empty'}
		<div class="fill">
			<EmptyState
				type="empty"
				title="No history yet"
				description="Changes of this user will be listed here after the first sync."
			/>
		</div>
	{:else}
		<TableToolbar>
			<SearchChip bind:value={query} />

			{#each filters as filter (filter.id)}
				<span class="anchor">
					<FilterChip
						name={filter.name}
						value={textOf(filter)}
						onclick={(event) => {
							event.stopPropagation(); // the window handler must not close what was just opened
							openMenu = openMenu === filter.id ? '' : filter.id;
						}}
						onclear={() => unchoose(filter.id)}
					/>
					{#if openMenu === filter.id}
						<div class="anchor__menu">
							<Menu label={filter.name}>
								{#each filter.options as [value, text]}
									<MenuItem
										checked={chosen[filter.id] === value}
										onclick={() => choose(filter.id, value)}>{text}</MenuItem
									>
								{/each}
							</Menu>
						</div>
					{/if}
				</span>
			{/each}
		</TableToolbar>

		{#if proto.data === 'ready' && rows.length === 0}
			<div class="fill">
				<EmptyState
					type="not-found"
					title="No matching changes"
					description="Try adjusting or clearing filters to see more"
				>
					<Button appearance="accent" mode="primary" onclick={clearFilters}>Clear filters</Button>
				</EmptyState>
			</div>
		{:else}
			<div class="card">
				<Table
					{columns}
					rows={proto.data === 'loading' ? loadingRows : rows}
					sortKey="time"
					{sortDirection}
					onsort={() => (sortDirection = sortDirection === 'desc' ? 'asc' : 'desc')}
					actions={proto.data === 'loading' ? undefined : rowActions}
					actionsWidth={46}
					minWidth={960}
					pageScroll
				>
					{#snippet cell(snapshot, column)}
						{#if snapshot.loading}
							<Skeleton width="70%" />
						{:else if column.key === 'time'}
							<!-- The current state of the user is marked with a dot. -->
							<span class="time" title={snapshot.current ? 'Current' : undefined}>
								{#if snapshot.current}<Marker colour="progress" shape="circle" size="s" />{/if}
								<span dir="ltr">{formatSync(snapshot.time)}</span>
							</span>
						{:else if column.key === 'operation'}
							<Tag colour={operations[snapshot.operation].colour} size="s"
								>{operations[snapshot.operation].label}</Tag
							>
						{:else if column.key === 'type'}
							<Tag size="s">{snapshot.type}</Tag>
						{:else}
							{snapshot[column.key]}
						{/if}
					{/snippet}
				</Table>
			</div>
		{/if}
	{/if}
</div>

<!-- One button per row (shown on hover, guidelines 5.1). The current state has nothing to compare with. -->
{#snippet rowActions(snapshot)}
	{#if !snapshot.current}
		<Button
			mode="ghost"
			icon="duplicate"
			label="Compare with the current"
			onclick={() => oncompare?.(snapshot)}
		/>
	{/if}
{/snippet}

<style>
	.screen {
		display: flex;
		flex-direction: column;
		gap: 12px; /* toolbar and table sit 12px apart, as in the table guide */
		min-height: 100%;
		padding-block: 24px;
		padding-inline: 24px var(--screen-end, 24px); /* start, end: follows right-to-left */
	}
	.head {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.head h1 {
		margin: 0;
	}
	.fill {
		flex: 1;
		display: grid;
		place-items: center;
	}
	/* The white card the table lies on. */
	.card {
		padding: 0 0 8px;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	.card :global(th:first-child) {
		border-start-start-radius: var(--radius-m);
	}
	.card :global(th:last-child) {
		border-start-end-radius: var(--radius-m);
	}
	.anchor {
		position: relative;
		display: inline-flex;
	}
	.anchor__menu {
		position: absolute;
		top: calc(100% + 4px);
		inset-inline-start: 0;
		z-index: 10;
		min-width: 160px;
	}
	.time {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
</style>
