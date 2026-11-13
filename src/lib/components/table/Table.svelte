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
		wrap       true = long text wraps to more lines instead of being cut with "…"
		           a number = wraps, but to at most that many lines (wrap: 2)
		pinned     true = stays in place when the table scrolls sideways (needs a width in px)
		children   a list of columns UNDER this one (makes a two-level header).
		           A column with children only needs `label` and `children`.

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
		minHeight       px. The rows area is never shorter than this, so the page does not
		                jump when a search or a filter leaves only a few rows
		maxHeight       px. Taller tables scroll inside; the header stays on top
		minWidth        px. The table fills the room it gets, but is never narrower than this:
		                in a smaller place it scrolls sideways instead of squeezing its columns
		pageScroll      true = the table does NOT scroll by itself: it is as big as its content and
		                scrolls together with the page (or the box) around it. Its header then sticks
		                to the top of that page, pinned columns to its side, the summary to its bottom.
		                If something is already stuck at the top (a toolbar), say how tall it is:
		                    style="--table-sticky-top: 56px"   on the table or any parent
		summary         snippet for the summary row under the table, e.g. two <span>s
		                (the first sits at the start, the last at the end).
		                It is always visible; the sideways scrollbar sits below it

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
		minHeight = 0,
		maxHeight = 0,
		minWidth = 0,
		pageScroll = false,
		summary,
		class: extraClass = ''
	} = $props();

	const CHECK_WIDTH = 28; // width of the checkbox column, px

	/* ---------- Columns ----------
	   "Leaf" columns are the ones that actually hold cells: plain columns, and
	   the children of grouped columns. One leaf = one <col> in the table. */

	let grouped = $derived(columns.some((column) => column.children));
	let leaves = $derived(columns.flatMap((column) => column.children ?? [column]));

	// How many columns of cells there are in total (used by the "empty" row).
	let columnCount = $derived(leaves.length + (selectable ? 1 : 0) + (actions ? 1 : 0));

	/* ---------- Pinned columns ----------
	   Each pinned column sits right after the pinned ones before it.
	   pinnedAt = { 'column-key': distance from the side in px } */

	let pinnedAt = $derived.by(() => {
		const result = {};
		let distance = selectable ? CHECK_WIDTH : 0;
		for (const column of leaves) {
			if (!column.pinned) continue;
			result[column.key] = distance;
			distance += column.width ?? 0;
		}
		return result;
	});
	let hasPinned = $derived(leaves.some((column) => column.pinned));
	let lastPinnedKey = $derived(leaves.findLast((column) => column.pinned)?.key);

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

<!-- ─── One header cell. `parent` is set for the children of a grouped column. ─── -->
{#snippet headerCell(column, parent)}
	<th
		colspan={column.children?.length}
		rowspan={grouped && !column.children && !parent ? 2 : undefined}
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

<div class="hb-table-frame {extraClass}" class:hb-table-frame--page-scroll={pageScroll}>
	<div
		class="hb-table-scroll"
		style:min-height={minHeight ? `${minHeight}px` : undefined}
		style:max-height={maxHeight ? `${maxHeight}px` : undefined}
	>
		<table
			class="hb-table"
			class:hb-table--grouped={grouped}
			class:hb-table--clickable={onrowclick}
			class:hb-table--hover={onrowclick || actions || selectable}
			style:min-width={minWidth ? `${minWidth}px` : undefined}
		>
			<!-- Column widths. One <col> per column of cells, in the same order as the cells below. -->
			<colgroup>
				{#if selectable}<col style:width="{CHECK_WIDTH}px" />{/if}
				{#each leaves as column}
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
							rowspan={grouped ? 2 : undefined}
							style:inset-inline-start={hasPinned ? '0px' : undefined}
						>
							<button
								class="hb-table__check"
								type="button"
								role="checkbox"
								aria-checked={headerState}
								aria-label="Select all rows"
								onclick={(event) => {
									event.stopPropagation(); // do not let the window handler close the menu we just opened
									toggleAll();
								}}
							>
								<Icon name={checkIcons[headerState]} size={16} />
							</button>

							{#if menuOpen}
								<Menu class="hb-table__check-menu" label="Which rows to select">
									<MenuItem onclick={() => selectRows(rows)}>Rows on this page</MenuItem>
									<MenuItem onclick={() => selectRows(allRows)}>All rows in the table</MenuItem>
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
							rowspan={grouped ? 2 : undefined}
						></th>
					{/if}
				</tr>

				<!-- Second header row: the children of grouped columns. -->
				{#if grouped}
					<tr>
						{#each columns as column}
							{#each column.children ?? [] as child}{@render headerCell(child, column)}{/each}
						{/each}
					</tr>
				{/if}
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
									aria-label="Select row"
									onclick={(event) => {
										event.stopPropagation(); // ticking a row is not a click on the row
										toggleRow(row);
									}}
								>
									<Icon name={selection.includes(keyOf(row)) ? 'check' : 'uncheck'} size={16} />
								</button>
							</td>
						{/if}

						{#each leaves as column}
							<td
								class:hb-table__cell--end={column.align === 'end'}
								class:hb-table__cell--wrap={column.wrap}
								class:hb-table__cell--pinned={column.pinned}
								class:hb-table__cell--pinned-last={column.key === lastPinnedKey}
								style:inset-inline-start={column.pinned ? `${pinnedAt[column.key]}px` : undefined}
							>
								<!-- wrap: 2 → the text may take two lines, then it is cut with "…". -->
								<div
									class:hb-table__clamp={typeof column.wrap === 'number'}
									style:-webkit-line-clamp={typeof column.wrap === 'number'
										? column.wrap
										: undefined}
								>
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
