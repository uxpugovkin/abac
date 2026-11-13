<!--
	TABLE EXAMPLE — a helper used only by the table guidelines page.
	One "Employees" table, like the examples in Figma, where each feature can be
	switched on with a prop. It keeps its own search, filters, sorting and
	selection, so every example on the page works on its own.

	Use:
		<TableExample title="Employees" selectable summary />
		<TableExample wide pinned actions={['edit', 'download', 'delete']} maxHeight={330} />

	Props (all optional):
		title             heading above the table, e.g. "Employees"
		annotate          true = draws the purple labels of the "Anatomy" example

		Toolbar
		toolbar           false = no toolbar.  Default true
		search            starting search text
		searchPlaceholder hint in the search box.  Default "Search"
		filters           starting filter values, e.g. { Status: 'Active' }
		shown             which filter chips are in the toolbar.  Default the first four
		filterMenu        true = the "tune" button opens the list of all filters
		toolbarEnd        snippet for the buttons at the end of the toolbar

		Table
		hide              keys of columns to leave out, e.g. ['office']
		wide              true = every column has a fixed width, so the table scrolls sideways
		pinned            true = the Employee column is pinned
		longTexts         true = the "wrap and cut" example: long header, long name, long department
		selectable        true = checkbox column
		paged             true = 5 rows per page, with a pager in the summary row
		actions           icon names of the row actions, e.g. ['delete']
		actionsWidth      px. Puts the actions in their own column
		maxHeight         px. Rows scroll inside
		minHeight         px. Keeps the height when a search leaves few rows
		summary           true = summary row
-->
<script>
	import {
		Table,
		Tag,
		Avatar,
		Button,
		FilterChip,
		SearchChip,
		Menu,
		Checkbox,
		EmptyState
	} from '#lib';
	import {
		employees,
		statusColour,
		formatScore,
		filterPresets,
		filterEmployees,
		sortEmployees
	} from '../employees.js';

	let {
		title = '',
		annotate = false,
		toolbar = true,
		search = '',
		searchPlaceholder = 'Search',
		filters = {},
		shown = ['Status', 'Skills', 'Department', 'Office'],
		filterMenu = false,
		toolbarEnd,
		hide = [],
		wide = false,
		pinned = false,
		longTexts = false,
		selectable = false,
		paged = false,
		actions = [],
		actionsWidth = 0,
		maxHeight = 0,
		minHeight = 0,
		summary = false
	} = $props();

	const PAGE_SIZE = 5;
	const allFilters = Object.keys(filterPresets);

	/* ---------- What this example remembers ----------
	   (Only the starting values come from the props, on purpose — hence the ignores.) */

	// svelte-ignore state_referenced_locally
	let query = $state(search);
	// svelte-ignore state_referenced_locally
	let values = $state({ ...filters }); // filter name → chosen value
	// svelte-ignore state_referenced_locally
	let chips = $state([...shown]); // which filter chips are in the toolbar
	// svelte-ignore state_referenced_locally
	let menuOpen = $state(filterMenu); // the list behind the "tune" button (starts open in its own example)
	let sortKey = $state('score');
	let sortDirection = $state('desc');
	let selection = $state([]); // ids of the ticked rows
	let page = $state(0);

	/* ---------- Columns ---------- */

	// Widths as in Figma. Without `wide` they are a bit smaller, so the table fits its card
	// (when the card is wider than all columns together, they share the extra room).
	let columns = $derived(
		[
			{ key: 'fullName', label: 'Employee', width: wide ? 260 : 200, sortable: true, pinned },
			{ key: 'status', label: 'Status', width: wide ? 130 : 100, sortable: true },
			{ key: 'skills', label: 'Skills', width: wide ? 210 : 180 },
			{ key: 'department', label: 'Department', width: wide ? 180 : 150, sortable: true },
			{ key: 'office', label: 'Office', width: wide ? 180 : 110, sortable: true },
			{ key: 'score', label: 'Tetris score', width: wide ? 196 : 160, sortable: true, align: 'end' }
		]
			.filter((column) => !hide.includes(column.key))
			// The "wrap and cut" example: the first column is narrow, and its header and names wrap.
			// Department may take two lines, then it is cut with "…".
			.map((column) => {
				if (!longTexts) return column;
				if (column.key === 'fullName')
					return { ...column, label: 'Very long column name', width: 150, wrap: true };
				if (column.key === 'department') return { ...column, wrap: 2 };
				return column;
			})
	);

	/* ---------- Rows: the page filters, sorts and cuts into pages. The Table only shows. ---------- */

	let people = $derived(
		longTexts
			? employees.map((person) =>
					person.id === 1
						? {
								...person,
								fullName: 'Alexandria Montgomery-Fitzgerald Villanueva',
								department: 'Platform Reliability Engineering and Operations'
							}
						: person
				)
			: employees
	);

	let matching = $derived(
		sortEmployees(filterEmployees(people, query, values), sortKey, sortDirection)
	);
	let rows = $derived(paged ? matching.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) : matching);
	let lastPage = $derived(Math.max(0, Math.ceil(matching.length / PAGE_SIZE) - 1));
	let total = $derived(matching.reduce((sum, person) => sum + person.score, 0));
	let anyFilter = $derived(Object.values(values).some(Boolean));

	// After a filter change the current page may not exist any more: go back to the last one.
	$effect(() => {
		if (page > lastPage) page = lastPage;
	});

	function sortBy(key) {
		// Clicking the same column again flips the direction.
		sortDirection = key === sortKey && sortDirection === 'desc' ? 'asc' : 'desc';
		sortKey = key;
	}

	function reset() {
		query = '';
		values = {};
	}

	// Tick or untick a filter in the "tune" list: its chip appears in, or leaves, the toolbar.
	function toggleChip(name) {
		if (chips.includes(name)) {
			chips = chips.filter((other) => other !== name);
			values[name] = ''; // a filter that is not shown must not keep filtering
		} else {
			chips = allFilters.filter((other) => chips.includes(other) || other === name); // keep the usual order
		}
	}
</script>

<!-- Clicking anywhere else closes the "tune" list. -->
<svelte:window onclick={() => (menuOpen = false)} />

<div class="example" class:example--annotate={annotate}>
	{#if title}
		<div class="part" data-label="Title"><h4 class="hb-text-h3">{title}</h4></div>
	{/if}

	{#if toolbar}
		<div class="part" data-label="Toolbar">
			<div class="hb-table-toolbar">
				<!-- The two small white buttons at the start: all filters, and search. -->
				<span class="tune">
					<Button
						appearance="white"
						mode="primary"
						icon="tune"
						label="Filters"
						onclick={(event) => {
							event.stopPropagation(); // do not let the window handler close what we just opened
							if (filterMenu) menuOpen = !menuOpen;
						}}
					/>
					{#if menuOpen}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<div class="tune__menu" onclick={(event) => event.stopPropagation()}>
							<Menu label="Filters to show">
								{#each allFilters as name}
									<Checkbox checked={chips.includes(name)} onchange={() => toggleChip(name)}
										>{name}</Checkbox
									>
								{/each}
							</Menu>
						</div>
					{/if}
				</span>
				<span class="search"><SearchChip bind:value={query} placeholder={searchPlaceholder} /></span
				>

				<!-- Filter chips. In these examples a click simply sets a ready-made value. -->
				{#each chips as name}
					<FilterChip
						{name}
						value={values[name]}
						onclick={() => (values[name] = filterPresets[name])}
						onclear={() => (values[name] = '')}
					/>
				{/each}
				{#if anyFilter}<Button mode="ghost" onclick={reset}>Reset</Button>{/if}

				<div class="hb-table-toolbar__end">
					{#if toolbarEnd}
						{@render toolbarEnd()}
					{:else}
						<Button icon="download" label="Download" />
						<Button icon="settings" label="Table settings" />
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<div class="part" data-label="Table body">
		<Table
			{columns}
			{rows}
			{sortKey}
			{sortDirection}
			onsort={sortBy}
			{selectable}
			bind:selection
			allRows={paged ? matching : undefined}
			{maxHeight}
			{minHeight}
			{actionsWidth}
			actions={actions.length ? rowActions : undefined}
			summary={summary || paged ? summaryRow : undefined}
			empty={nothingFound}
		>
			{#snippet cell(row, column)}
				{#if column.key === 'fullName'}
					<div class="hb-table__person">
						<Avatar src={row.photo} name={row.fullName} size="xs" />
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
		</Table>
	</div>
</div>

<!-- The buttons of one row. -->
{#snippet rowActions(row)}
	{#each actions as icon}
		<Button mode="ghost" {icon} label="{icon} {row.fullName}" />
	{/each}
{/snippet}

<!-- The summary row. With pages, it also holds the pager. -->
{#snippet summaryRow()}
	<span class="part part--inline" data-label="Summary row">
		{matching.length} employees{#if selectable}&nbsp;· {selection.length} selected{/if}
	</span>
	{#if paged}
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
	{:else}
		<span>Total: {formatScore(total)}</span>
	{/if}
{/snippet}

<!-- Shown inside the table when the search and filters leave no rows. -->
{#snippet nothingFound()}
	<EmptyState type="not-found">
		<Button appearance="accent" mode="primary" icon="close" onclick={reset}>Clear filters</Button>
	</EmptyState>
{/snippet}

<style>
	h4 {
		margin: 0 0 12px;
	}

	/* The "tune" button, with its list opening right under it. */
	.tune {
		position: relative;
		display: inline-flex;
	}
	.tune__menu {
		position: absolute;
		top: calc(100% + 4px);
		inset-inline-start: 0;
		z-index: 10;
	}
	/* Checkbox rows inside the list get a little room at the sides. */
	.tune__menu :global(.hb-check) {
		margin: 0 4px;
		padding-inline-end: 12px;
		white-space: nowrap;
	}
	/* A bit more air between the two white buttons and the filter chips (as in Figma). */
	.search {
		display: inline-flex;
		margin-inline-end: 12px;
	}

	.pager {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	/* ---------- The purple labels of the "Anatomy" example ----------
	   Every part of the table gets an outline and a pill with its name. */
	.example--annotate {
		padding-inline-start: 140px;
		--label: var(--accent-8);
	}
	.example--annotate .part {
		position: relative;
		margin-bottom: 8px;
		padding: 4px;
		border-radius: var(--radius-s);
		outline: 1px solid var(--label);
	}
	.example--annotate :global(.hb-table-toolbar),
	.example--annotate h4 {
		margin-bottom: 0;
	}
	.example--annotate .part::before {
		content: attr(data-label);
		position: absolute;
		top: 50%;
		inset-inline-end: calc(100% + 16px);
		transform: translateY(-50%);
		padding: 2px 10px;
		border-radius: var(--radius-full);
		background: var(--label);
		color: var(--pure-0);
		font: var(--text-body-d-bold);
		white-space: nowrap;
	}
	/* The thin line from the pill to the outline. */
	.example--annotate .part::after {
		content: '';
		position: absolute;
		top: 50%;
		inset-inline-end: 100%;
		width: 16px;
		height: 1px;
		background: var(--label);
	}
	/* The summary row lives inside the table, so its label hangs from the text itself. */
	.example--annotate .part--inline {
		position: static;
		margin: 0;
		padding: 0;
		outline: none;
	}
	.example--annotate :global(.hb-table__summary) {
		position: relative;
		margin-top: 8px;
		border-top: 0;
		border-radius: var(--radius-s);
		outline: 1px solid var(--label);
		outline-offset: 4px;
	}
	.example--annotate .part--inline::before {
		inset-inline-end: calc(100% + 20px);
	}
	.example--annotate .part--inline::after {
		inset-inline-end: calc(100% + 4px);
	}
</style>
