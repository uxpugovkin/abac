<!--
	TABLE
	Rows and columns of data. You describe the columns, hand over the rows,
	and the table draws itself.

	Figma:  habibi-library → pages "table" and "Tables Guide"
	Rules:  read guidelines.js (next to this file) before designing a screen with a table.
	        It says when to use a table, where buttons and filters go, how selection works…
	        The same rules, with a live example under each, are on the docs page /ds/tables.

	────────────────────────────────────────────────────────────────────────────
	THE SIMPLEST TABLE
	────────────────────────────────────────────────────────────────────────────
		<Table
			columns={[
				{ key: 'login', label: 'Login', width: 240 },
				{ key: 'fullName', label: 'Full name' }
			]}
			rows={[
				{ id: 1, login: 'walker85@acme.corp', fullName: 'Brenda Cooper' },
				{ id: 2, login: 'const.b.e@acme.corp', fullName: 'Constantin Polski' }
			]}
		/>

	────────────────────────────────────────────────────────────────────────────
	COLUMNS — each column is an object:
	────────────────────────────────────────────────────────────────────────────
		key        which field of a row to show                                   (required)
		label      the header text                                                (required)
		width      a number = width in px;  a text = any CSS width, e.g. "25%".
		           Columns without it share the room that is left
		sortable   true = the header can be clicked to sort
		align      "end" = stick to the far side (good for numbers)
		wrap       true = long text wraps instead of being cut with "…" right away.
		           In a row it takes at most 3 lines; what is left after that is cut
		pinned     true = stays in place when the table scrolls sideways (needs a width in px)

	────────────────────────────────────────────────────────────────────────────
	PROPS — everything except `columns` and `rows` is optional. Turn on what you need.
	────────────────────────────────────────────────────────────────────────────
	Data
		columns         the list of columns (see above)
		rows            the data: a list of objects. Each object is one row
		rowKey          name of the field that tells rows apart (unique in every row).  Default "id"
		cell            snippet to draw a cell yourself (tags, avatars…). Gets (row, column)
		empty           snippet shown instead of the rows when there are none (e.g. an EmptyState)

	Sorting  — the table shows the arrow and reports clicks; the PAGE sorts the rows
		sortKey         key of the column the rows are sorted by
		sortDirection   "asc" (small → big, arrow up) | "desc" (big → small, arrow down).  Default "asc"
		onsort          called with the column key when a sortable header is clicked

	Rows
		onrowclick      called with the row when a row is clicked
		selected        the key of ONE row to highlight (its value of the `rowKey` field)
		actions         snippet with buttons for one row, shown on hover. Gets (row)
		actionsWidth    give a number (px) to put the actions in their own column.
		                Without it they float over the end of the row

	Bulk selection
		selectable      true = adds a checkbox column
		selection       the keys of the ticked rows. Use bind:selection to read it
		allRows         only with pages: ALL rows of the table (not just this page).
		                Then the header checkbox asks "Rows on this page / All rows in the table"

	Size and scrolling
		minWidth        px. The table fills the room it gets, but is never narrower than this:
		                in a smaller place it scrolls sideways instead of squeezing its columns
		minHeight       px. The rows area is never shorter than this, so the page does not
		                jump when a search or a filter leaves only a few rows
		pageScroll      true = for long tables. The table does NOT scroll by itself: it is as big
		                as its content and scrolls together with the page (or the box) around it.
		                While it scrolls, the toolbar and the header stay at the top of that page,
		                pinned columns at its side, the summary at its bottom.
		                If the page has something of its own stuck at the top (a page header),
		                say how tall it is:  style="--table-sticky-top: 56px"  on any parent

	Around the table
		toolbar         snippet for what sits above the table: usually a <TableToolbar>
		                (see TableToolbar.svelte). With `pageScroll` it stays on top
		summary         snippet for the summary row under the table, e.g. two <span>s
		                (the first sits at the start, the last at the end).
		                It is always visible; the sideways scrollbar sits below it

	Words the table writes itself (only needed for another language)
		texts           any of these, the rest stay English:
		                  { selectAll: 'Select all rows',            ← screen readers
		                    selectRow: 'Select row',                  ← screen readers
		                    whichRows: 'Which rows to select',        ← screen readers
		                    rowsOnPage: 'Rows on this page',          ← the list under "select all"
		                    allRows: 'All rows in the table' }        ← the same list

	────────────────────────────────────────────────────────────────────────────
	Kept simple on purpose: the table never changes your data. Sorting, filtering
	and paging happen in the page — the table shows `rows` in the order it gets
	them and tells you what was clicked.

	Rows are told apart by their key: by default the `id` field of each row.
	`selected` and `selection` hold keys, not whole rows — for example
	selection = ['walker85', 'const.b.e'].  Only needed if you use those two.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import Menu from '../menu/Menu.svelte';
	import MenuItem from '../menu/MenuItem.svelte';
	import './table.css';

	let {
		columns = [],
		rows = [],
		rowKey = 'id',
		cell,
		empty,
		sortKey = '',
		sortDirection = 'asc',
		onsort,
		onrowclick,
		selected = undefined,
		actions,
		actionsWidth = 0,
		selectable = false,
		selection = $bindable([]),
		allRows = undefined,
		minWidth = 0,
		minHeight = 0,
		pageScroll = false,
		toolbar,
		summary,
		texts = {},
		class: extraClass = ''
	} = $props();

	// The words the table writes itself: English, unless `texts` says otherwise.
	const englishTexts = {
		selectAll: 'Select all rows',
		selectRow: 'Select row',
		whichRows: 'Which rows to select',
		rowsOnPage: 'Rows on this page',
		allRows: 'All rows in the table'
	};
	let words = $derived({ ...englishTexts, ...texts });

	const CHECK_WIDTH = 32; // width of the checkbox column, px

	// How many columns of cells there are in total (used by the "empty" row).
	let columnCount = $derived(columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0));

	/* ---------- Sizes the table measures by itself (only used with `pageScroll`) ----------
	   frameWidth      how wide the visible place of the table is. The toolbar is made
	                   this wide, so it does not grow with a table that is wider than the page.
	   toolbarHeight   how tall the toolbar is. The header sticks right under it. */
	let frameWidth = $state(0);
	let toolbarHeight = $state(0);

	/* ---------- Pinned columns ----------
	   Each pinned column sits right after the pinned ones before it.
	   pinnedAt = { 'column-key': distance from the side in px } */

	let pinnedAt = $derived.by(() => {
		const result = {};
		let distance = selectable ? CHECK_WIDTH : 0;
		for (const column of columns) {
			if (!column.pinned) continue;
			result[column.key] = distance;
			distance += column.width ?? 0;
		}
		return result;
	});
	let hasPinned = $derived(columns.some((column) => column.pinned));
	let lastPinnedKey = $derived(columns.findLast((column) => column.pinned)?.key);

	/* ---------- Bulk selection ---------- */

	// The key of a row, e.g. its id.
	function keyOf(row) {
		return row[rowKey];
	}

	// How many of the rows on screen are ticked: decides the header checkbox.
	let tickedHere = $derived(rows.filter((row) => selection.includes(keyOf(row))).length);
	let headerState = $derived(
		tickedHere === 0 ? 'false' : tickedHere === rows.length ? 'true' : 'mixed'
	);
	const checkIcons = { false: 'uncheck', true: 'check', mixed: 'semi-check' };

	let menuOpen = $state(false); // the "this page / all rows" menu

	function toggleRow(row) {
		const key = keyOf(row);
		selection = selection.includes(key)
			? selection.filter((other) => other !== key)
			: [...selection, key];
	}

	function toggleAll() {
		if (selection.length > 0) {
			selection = []; // something is ticked → clear everything
		} else if (allRows) {
			menuOpen = !menuOpen; // there are pages → ask which rows are meant
		} else {
			selection = rows.map(keyOf);
		}
	}

	function selectRows(list) {
		selection = list.map(keyOf);
		menuOpen = false;
	}

	// Guidelines 6.4: when the rows change (for example a filter was changed),
	// rows that are no longer in the table are dropped from the selection.
	// Rows that newly appear are simply not ticked.
	$effect(() => {
		const available = (allRows ?? rows).map(keyOf);
		const stillThere = selection.filter((key) => available.includes(key));
		if (stillThere.length !== selection.length) selection = stillThere;
	});
</script>

<!-- Clicking anywhere else closes the "this page / all rows" menu. -->
<svelte:window onclick={() => (menuOpen = false)} />

<!-- ─── One header cell. ─── -->
{#snippet headerCell(column)}
	<th
		class:hb-table__cell--end={column.align === 'end'}
		class:hb-table__cell--wrap={column.wrap}
		class:hb-table__cell--pinned={column.pinned}
		class:hb-table__cell--pinned-last={column.key === lastPinnedKey}
		style:inset-inline-start={column.pinned ? `${pinnedAt[column.key]}px` : undefined}
	>
		{#if column.sortable}
			<button class="hb-table__sort" type="button" onclick={() => onsort?.(column.key)}>
				<span>{column.label}</span>
				{#if column.key === sortKey}
					<Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} />
				{/if}
			</button>
		{:else}
			{column.label}
		{/if}
	</th>
{/snippet}

<!-- ─── What sits above the table (the `toolbar` snippet). ─── -->
{#snippet top()}
	<div
		class="hb-table__top"
		bind:clientHeight={toolbarHeight}
		style:width={pageScroll ? `${frameWidth}px` : undefined}
	>
		{@render toolbar()}
	</div>
{/snippet}

<div
	class="hb-table-frame {extraClass}"
	class:hb-table-frame--page-scroll={pageScroll}
	bind:clientWidth={frameWidth}
	style:--table-toolbar-height={pageScroll && toolbar ? `${toolbarHeight}px` : undefined}
>
	<!-- Normally the toolbar sits above the part that scrolls sideways… -->
	{#if toolbar && !pageScroll}{@render top()}{/if}

	<div class="hb-table-scroll" style:min-height={minHeight ? `${minHeight}px` : undefined}>
		<!-- …with `pageScroll` it sits inside, next to the table, and sticks to the top of the page. -->
		{#if toolbar && pageScroll}{@render top()}{/if}

		<table
			class="hb-table"
			class:hb-table--clickable={onrowclick}
			style:min-width={minWidth ? `${minWidth}px` : undefined}
		>
			<!-- Column widths. One <col> per column of cells, in the same order as the cells below. -->
			<colgroup>
				{#if selectable}<col style:width="{CHECK_WIDTH}px" />{/if}
				{#each columns as column}
					<col
						style:width={typeof column.width === 'number' ? `${column.width}px` : column.width}
					/>
				{/each}
				{#if actions}<col style:width="{actionsWidth}px" />{/if}
			</colgroup>

			<thead>
				<tr>
					{#if selectable}
						<th
							class="hb-table__check-cell"
							class:hb-table__cell--pinned={hasPinned}
							style:inset-inline-start={hasPinned ? '0px' : undefined}
						>
							<button
								class="hb-table__check"
								type="button"
								role="checkbox"
								aria-checked={headerState}
								aria-label={words.selectAll}
								onclick={(event) => {
									event.stopPropagation(); // do not let the window handler close the menu we just opened
									toggleAll();
								}}
							>
								<Icon name={checkIcons[headerState]} size={20} />
							</button>

							{#if menuOpen}
								<Menu class="hb-table__check-menu" label={words.whichRows}>
									<MenuItem onclick={() => selectRows(rows)}>{words.rowsOnPage}</MenuItem>
									<MenuItem onclick={() => selectRows(allRows)}>{words.allRows}</MenuItem>
								</Menu>
							{/if}
						</th>
					{/if}

					{#each columns as column}{@render headerCell(column)}{/each}

					{#if actions}
						<th
							class="hb-table__actions-cell hb-table__actions-cell--{actionsWidth
								? 'column'
								: 'overlay'}"
						></th>
					{/if}
				</tr>
			</thead>

			<tbody>
				{#each rows as row (keyOf(row) ?? row)}
					<tr
						class:hb-table__row--selected={selected !== undefined && keyOf(row) === selected}
						onclick={() => onrowclick?.(row)}
					>
						{#if selectable}
							<td
								class="hb-table__check-cell"
								class:hb-table__cell--pinned={hasPinned}
								style:inset-inline-start={hasPinned ? '0px' : undefined}
							>
								<button
									class="hb-table__check"
									type="button"
									role="checkbox"
									aria-checked={selection.includes(keyOf(row)) ? 'true' : 'false'}
									aria-label={words.selectRow}
									onclick={(event) => {
										event.stopPropagation(); // ticking a row is not a click on the row
										toggleRow(row);
									}}
								>
									<Icon name={selection.includes(keyOf(row)) ? 'check' : 'uncheck'} size={20} />
								</button>
							</td>
						{/if}

						{#each columns as column}
							<td
								class:hb-table__cell--end={column.align === 'end'}
								class:hb-table__cell--wrap={column.wrap}
								class:hb-table__cell--pinned={column.pinned}
								class:hb-table__cell--pinned-last={column.key === lastPinnedKey}
								style:inset-inline-start={column.pinned ? `${pinnedAt[column.key]}px` : undefined}
							>
								<div>
									<!-- Your own drawing if you gave a `cell` snippet, otherwise just the value. -->
									{#if cell}{@render cell(row, column)}{:else}{row[column.key] ?? ''}{/if}
								</div>
							</td>
						{/each}

						{#if actions}
							<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
							<td
								class="hb-table__actions-cell hb-table__actions-cell--{actionsWidth
									? 'column'
									: 'overlay'}"
								onclick={(event) => event.stopPropagation()}
							>
								<div class="hb-table__actions">{@render actions(row)}</div>
							</td>
						{/if}
					</tr>
				{/each}

				<!-- No rows: one wide cell with whatever the page wants to say. -->
				{#if rows.length === 0 && empty}
					<tr class="hb-table__empty">
						<td colspan={columnCount}>{@render empty()}</td>
					</tr>
				{/if}
			</tbody>
		</table>

		<!-- Inside the scrolling part, stuck to its bottom: the scrollbar comes after it. -->
		{#if summary}
			<div class="hb-table__summary">{@render summary()}</div>
		{/if}
	</div>
</div>
