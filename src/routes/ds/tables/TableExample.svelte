<!--
	TABLE EXAMPLE — a helper used only by the table guidelines page.
	One "Employees" table, like the examples in Figma, where each feature can be
	switched on with a prop. It keeps its own search, filters, sorting and
	selection, so every example on the page works on its own.

	Use:
		<TableExample title="Employees" selectable summary />
		<TableExample wide pinned actions={['edit', 'download', 'delete']} viewport />

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
		wide              true = the columns are wider than the example, so the table scrolls sideways
		narrow            true = for the small page inside the app window (AppFrame): the table may
		                  get narrower there before it starts to scroll sideways
		pinned            true = the Employee column is pinned
		longTexts         true = the "wrap and cut" example: long header, long name, long department,
		                  and two purple lines that show the shared text baseline
		selectable        true = checkbox column
		paged             true = 5 rows per page, with a pager in the summary row
		picked            which rows are ticked at the start: a list of ids, e.g. [2, 3, 5],
		                  or "all" = every row that the starting search and filters leave
		choiceShown       true = the "Rows on this page / All rows in the table" list is always
		                  on screen (the pagination example). Needs `paged`
		actions           icon names of the row actions, e.g. ['delete']
		actionsWidth      px. Puts the actions in their own column
		limit             show only the first N people (most examples need just a few rows)
		viewport          for the SCROLLING examples: the example box plays the browser window.
		                  true = it scrolls sideways; a number = it is that many px tall and also
		                  scrolls up-down. Title and toolbar stick to its top, the table header under them
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
		MenuItem,
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
		narrow = false,
		pinned = false,
		longTexts = false,
		selectable = false,
		paged = false,
		picked = [],
		choiceShown = false,
		actions = [],
		actionsWidth = 0,
		limit = 0,
		viewport = false,
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
	// ids of the ticked rows
	// svelte-ignore state_referenced_locally
	let selection = $state(
		picked === 'all'
			? filterEmployees(limit ? employees.slice(0, limit) : employees, search, filters).map(
					(person) => person.id
				)
			: [...picked]
	);
	let page = $state(0);
	let stickyHeight = $state(0); // how tall the stuck title + toolbar are (scrolling examples)
	// How wide the window is inside (without its scrollbar): the stuck part is this wide.
	let windowWidth = $state(0);

	/* ---------- Columns ---------- */

	// Column widths.
	//   normal     shares of the table width, close to Figma (260 of 1184px = 22%…).
	//              The table fills the example box. Skills has no width: it takes what is left.
	//   longTexts  the "wrap and cut" example: a slimmer first column, so its long texts wrap
	//   wide       px, exactly as in Figma: wider than the box, so the table scrolls sideways
	//
	// The table never gets narrower than 872px (see minWidth below): that is a 904px
	// example box without its padding. In a smaller box it scrolls sideways.
	let widths = $derived(
		{
			normal: { fullName: '22%', status: '10%', department: '14%', office: '12%', score: '18%' },
			longTexts: { fullName: '19%', status: '11%', department: '13%', office: '15%', score: '22%' },
			wide: { fullName: 260, status: 130, skills: 300, department: 240, office: 240, score: 260 }
		}[longTexts ? 'longTexts' : wide ? 'wide' : 'normal']
	);

	let columns = $derived(
		[
			{ key: 'fullName', label: 'Employee', sortable: true, pinned },
			{ key: 'status', label: 'Status', sortable: true },
			{ key: 'skills', label: 'Skills' },
			{ key: 'department', label: 'Department', sortable: true },
			{ key: 'office', label: 'Office', sortable: true },
			{ key: 'score', label: 'Tetris score', sortable: true, align: 'end' }
		]
			.filter((column) => !hide.includes(column.key))
			.map((column) => ({ ...column, width: widths[column.key] }))
			// The "wrap and cut" example: the header and the names of the first column wrap,
			// and Department may take two lines before it is cut with "…".
			.map((column) => {
				if (!longTexts) return column;
				if (column.key === 'fullName')
					return { ...column, label: 'Very long column name that needs two lines', wrap: true };
				if (column.key === 'department') return { ...column, wrap: 2 };
				return column;
			})
	);

	/* ---------- Rows: the page filters, sorts and cuts into pages. The Table only shows. ---------- */

	let everyone = $derived(
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
	// Most examples only need a few rows.
	let people = $derived(limit ? everyone.slice(0, limit) : everyone);

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

<!-- The purple label next to a part. Only drawn in the "Anatomy" example. -->
{#snippet note(label)}
	{#if annotate}
		<span class="note">
			<span class="note__pill hb-text-body-d-bold">{label}</span>
			<span class="note__line"></span>
		</span>
	{/if}
{/snippet}

<!--
	With `viewport`, this box plays the browser window: IT scrolls, not the table.
	  - .stuck (title + toolbar) sticks to its top and does not move sideways
	  - the table header sticks right under it: --table-sticky-top is the height of .stuck
-->
<div
	class="example"
	class:example--annotate={annotate}
	class:viewport
	class:hb-scroll={viewport}
	class:viewport--tall={typeof viewport === 'number'}
	style:height={typeof viewport === 'number' ? `${viewport}px` : undefined}
	style:--table-sticky-top={viewport ? `${stickyHeight}px` : undefined}
	bind:clientWidth={windowWidth}
>
	<div
		class="stuck"
		bind:clientHeight={stickyHeight}
		style:width={viewport ? `${windowWidth}px` : undefined}
	>
		{#if title}
			<div class="part">
				{@render note('Title')}
				<div class="region"><h4 class="hb-text-h3">{title}</h4></div>
			</div>
		{/if}

		{#if toolbar}
			<div class="part">
				{@render note('Toolbar')}
				<div class="region">
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
						<SearchChip bind:value={query} placeholder={searchPlaceholder} />

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
			</div>
		{/if}
	</div>

	<div class="part">
		{@render note('Table body')}
		<div class="region">
			<!-- Two thin lines across the header and the first row: they show that all
			     texts of a row sit on one baseline (guidelines 1.3). -->
			<!-- Guide-only trick: a copy of the table's own "which rows?" list that never closes,
			     so the example always shows it. It sits exactly where the real one opens. -->
			{#if choiceShown}
				<div class="choice">
					<Menu label="Which rows to select">
						<MenuItem onclick={() => (selection = rows.map((person) => person.id))}
							>Rows on this page</MenuItem
						>
						<MenuItem onclick={() => (selection = matching.map((person) => person.id))}
							>All rows in the table</MenuItem
						>
					</Menu>
				</div>
			{/if}

			{#if longTexts}<span class="guide guide--header"></span><span class="guide guide--row"
				></span>{/if}

			<Table
				{columns}
				{rows}
				{sortKey}
				{sortDirection}
				onsort={sortBy}
				{selectable}
				bind:selection
				allRows={paged ? matching : undefined}
				minWidth={wide ? 0 : narrow ? 620 : 872}
				pageScroll={!!viewport}
				{minHeight}
				{actionsWidth}
				actions={actions.length ? rowActions : undefined}
				summary={(summary || paged) && !annotate ? summaryRow : undefined}
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

	<!-- In the "Anatomy" example the summary row is its own part, so it gets its own label. -->
	{#if annotate}
		<div class="part">
			{@render note('Summary row')}
			<div class="region"><div class="hb-table__summary">{@render summaryRow()}</div></div>
		</div>
	{/if}
</div>

<!-- The buttons of one row. -->
{#snippet rowActions(row)}
	{#each actions as icon}
		<Button mode="ghost" {icon} label="{icon} {row.fullName}" />
	{/each}
{/snippet}

<!-- The summary row. With pages, it also holds the pager. -->
{#snippet summaryRow()}
	<span
		>{matching.length} employees{#if selectable}&nbsp;· {selection.length} selected{/if}</span
	>
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
		margin: 0;
	}
	/* Title, toolbar and table sit 12px apart (the toolbar brings its own 12px). */
	.part:has(h4) {
		margin-bottom: 12px;
	}
	.region {
		position: relative; /* the baseline guides are placed inside it */
		min-width: 0;
	}

	/* Title and toolbar. In normal examples this wrapper does nothing. */
	.example--annotate .stuck {
		display: contents; /* let the Anatomy boxes line up as one column */
	}

	/* ---------- The scrolling examples: the box is the "browser window" ---------- */
	.viewport {
		overflow: auto;
		/* Fill the bordered card up to its top and bottom edge (it has 16px of padding),
		   so the sideways scrollbar sits at the bottom edge of the card, like in a real window. */
		margin-block: -16px;
	}
	/* With an up-down scrollbar: reach the far edge too, so that scrollbar sits at the edge.
	   (Without one, the card's own 16px padding stays next to the toolbar.) */
	.viewport--tall {
		margin-inline-end: -16px;
	}
	.viewport .stuck {
		position: sticky;
		top: 0;
		/* Stays put when the table scrolls sideways. Its width is set in the markup:
		   exactly as wide as the window (without the scrollbar). */
		inset-inline-start: 0;
		z-index: 6;
		padding-top: 16px;
		background: var(--uncolorful-grey-surface);
		/* The 12px gap above the table belongs to the stuck part (as padding, not as the
		   toolbar's margin), so rows cannot show through it while they scroll. */
		padding-bottom: 12px;
	}
	.viewport .stuck > .part:last-child :global(.hb-table-toolbar),
	.viewport .stuck > .part:last-child h4 {
		margin-bottom: 0;
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

	/* The always-open list of the pagination example: right under the header checkbox. */
	.choice {
		position: absolute;
		top: 36px; /* the height of the table header */
		inset-inline-start: 0;
		z-index: 7;
	}

	.pager {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	/* ---------- Baseline guides of the "wrap and cut" example ---------- */
	.guide {
		position: absolute;
		inset-inline: 0;
		z-index: 4;
		height: 1px;
		background: var(--accent-9);
		pointer-events: none;
	}
	.guide--header {
		top: 21px; /* 8px padding + where the first line of 12px text sits */
	}
	.guide--row {
		top: 73px; /* the 49px two-line header + where the first text line of the row sits */
	}

	/* ---------- The purple labels of the "Anatomy" example ----------
	   As in Figma: every part is a row of [label ─] [outlined box], 8px apart.
	   The boxes never touch, and the labels sit in their own column on the side. */
	.example--annotate {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.example--annotate .part {
		display: flex;
		align-items: center;
		margin: 0;
	}
	.example--annotate .region {
		flex: 1;
		padding: 4px;
		border-radius: var(--radius-s);
		outline: 1px solid var(--accent-9);
		outline-offset: -1px;
	}
	.example--annotate :global(.hb-table-toolbar) {
		margin-bottom: 0;
	}
	.example--annotate :global(.hb-table__summary) {
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
