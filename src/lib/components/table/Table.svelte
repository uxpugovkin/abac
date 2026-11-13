<!--
	TABLE
	Rows and columns of data. You describe the columns, hand over the rows,
	and the table draws itself.

	Figma:  habibi-library → pages "table" and "Tables Guide"
	Rules:  read GUIDELINES.md (next to this file) before designing a screen with a table.
	        It says when to use a table, where buttons and filters go, how selection works…

	────────────────────────────────────────────────────────────────────────────
	THE SIMPLEST TABLE
	────────────────────────────────────────────────────────────────────────────
		<Table
			columns={[
				{ key: 'login', label: 'Login', width: 240 },
				{ key: 'fullName', label: 'Full name' }
			]}
			rows={[
				{ login: 'walker85@acme.corp', fullName: 'Brenda Cooper' },
				{ login: 'const.b.e@acme.corp', fullName: 'Constantin Polski' }
			]}
		/>

	────────────────────────────────────────────────────────────────────────────
	COLUMNS — each column is an object:
	────────────────────────────────────────────────────────────────────────────
		key        which field of a row to show                                   (required)
		label      the header text                                                (required)
		width      width in px. Columns without it share the room that is left
		sortable   true = the header can be clicked to sort
		align      "end" = stick to the far side (good for numbers)
		wrap       true = long text wraps to more lines instead of being cut with "…"
		pinned     true = stays in place when the table scrolls sideways (needs a width)
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

	Sorting  — the table shows the arrow and reports clicks; the PAGE sorts the rows
		sortKey         key of the column the rows are sorted by
		sortDirection   "asc" | "desc".  Default "asc"
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
		maxHeight       px. Taller tables scroll inside; the header stays on top
		resizable       true = column widths can be dragged in the header
		summary         snippet for the summary row under the table, e.g. two <span>s

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
		maxHeight = 0,
		resizable = false,
		summary,
		class: extraClass = ''
	} = $props();

	const CHECK_WIDTH = 28; // width of the checkbox column, px
	const MIN_WIDTH = 48; // a column cannot be dragged narrower than this, px

	/* ---------- Columns ----------
	   "Leaf" columns are the ones that actually hold cells: plain columns, and
	   the children of grouped columns. One leaf = one <col> in the table. */

	let grouped = $derived(columns.some((column) => column.children));
	let leaves = $derived(columns.flatMap((column) => column.children ?? [column]));

	// Widths changed by dragging:  { 'column-key': 180, … }.  Empty until someone drags.
	let dragged = $state({});

	function widthOf(column) {
		return dragged[column.key] ?? column.width;
	}

	/* ---------- Pinned columns ----------
	   Each pinned column sits right after the pinned ones before it.
	   pinnedAt = { 'column-key': distance from the side in px } */

	let pinnedAt = $derived.by(() => {
		const result = {};
		let distance = selectable ? CHECK_WIDTH : 0;
		for (const column of leaves) {
			if (!column.pinned) continue;
			result[column.key] = distance;
			distance += widthOf(column) ?? 0;
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

	// Guidelines 7.4: when the rows change (for example a filter was changed),
	// rows that are no longer in the table are dropped from the selection.
	// Rows that newly appear are simply not ticked.
	$effect(() => {
		const available = (allRows ?? rows).map(keyOf);
		const stillThere = selection.filter((key) => available.includes(key));
		if (stillThere.length !== selection.length) selection = stillThere;
	});

	/* ---------- Column resizing ---------- */

	let tableElement;
	let drag = $state(null); // what is being dragged right now, or null

	// Width of a column as it is drawn right now, read from the page.
	function drawnWidth(column) {
		return tableElement.querySelector(`th[data-key="${column.key}"]`).getBoundingClientRect().width;
	}

	function startResize(event, column, parent) {
		// 1. Freeze every column at the width it has on screen, so that columns
		//    without a set width do not jump when one of them changes.
		for (const leaf of leaves) dragged[leaf.key] = drawnWidth(leaf);

		// 2. Remember where we started.
		const siblings = parent?.children ?? [];
		drag = {
			column,
			// Dragging a child moves the border between it and its neighbour (guidelines 6.3).
			neighbour: parent ? siblings[siblings.indexOf(column) + 1] : undefined,
			startX: event.clientX,
			startWidths: { ...dragged },
			// In right-to-left pages, dragging to the left makes a column wider.
			direction: getComputedStyle(tableElement).direction === 'rtl' ? -1 : 1
		};
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	function moveResize(event) {
		if (!drag) return;
		const moved = (event.clientX - drag.startX) * drag.direction;
		const start = drag.startWidths;
		const { column, neighbour } = drag;

		if (column.children) {
			// A parent column: its children grow or shrink in proportion (guidelines 6.2).
			const total = column.children.reduce((sum, child) => sum + start[child.key], 0);
			const scale = Math.max(total + moved, MIN_WIDTH * column.children.length) / total;
			for (const child of column.children) dragged[child.key] = start[child.key] * scale;
		} else if (neighbour) {
			// A child column: what it gains, its neighbour loses. The parent keeps its width.
			const both = start[column.key] + start[neighbour.key];
			const width = Math.min(Math.max(start[column.key] + moved, MIN_WIDTH), both - MIN_WIDTH);
			dragged[column.key] = width;
			dragged[neighbour.key] = both - width;
		} else {
			// A plain column: it just gets wider or narrower.
			dragged[column.key] = Math.max(start[column.key] + moved, MIN_WIDTH);
		}
	}

	function stopResize() {
		drag = null;
	}
</script>

<!-- Clicking anywhere else closes the "this page / all rows" menu. -->
<svelte:window onclick={() => (menuOpen = false)} />

<!-- ─── One header cell. `parent` is set for the children of a grouped column. ─── -->
{#snippet headerCell(column, parent)}
	{@const isLastChild = parent && parent.children.at(-1) === column}
	<th
		data-key={column.key}
		colspan={column.children?.length}
		rowspan={grouped && !column.children && !parent ? 2 : undefined}
		class:hb-table__cell--end={column.align === 'end'}
		class:hb-table__cell--pinned={column.pinned}
		class:hb-table__cell--pinned-last={column.key === lastPinnedKey}
		style:inset-inline-start={column.pinned ? `${pinnedAt[column.key]}px` : undefined}
	>
		{#if column.sortable}
			<button class="hb-table__sort" type="button" onclick={() => onsort?.(column.key)}>
				<span>{column.label}</span>
				{#if column.key === sortKey}
					<Icon name={sortDirection === 'asc' ? 'arrow-down' : 'arrow-up'} size={16} />
				{/if}
			</button>
		{:else}
			{column.label}
		{/if}

		<!-- The last child has no handle of its own: its edge belongs to the parent. -->
		{#if resizable && !isLastChild}
			<span
				class="hb-table__resize"
				class:hb-table__resize--dragging={drag?.column === column}
				role="separator"
				aria-orientation="vertical"
				aria-label="Resize column {column.label}"
				onpointerdown={(event) => startResize(event, column, parent)}
				onpointermove={moveResize}
				onpointerup={stopResize}
				onpointercancel={stopResize}
			>
				<span></span><span></span><span></span>
			</span>
		{/if}
	</th>
{/snippet}

<div class="hb-table-frame {extraClass}">
	<div class="hb-table-scroll" style:max-height={maxHeight ? `${maxHeight}px` : undefined}>
		<table
			bind:this={tableElement}
			class="hb-table"
			class:hb-table--grouped={grouped}
			class:hb-table--clickable={onrowclick}
			class:hb-table--hover={onrowclick || actions || selectable}
		>
			<!-- Column widths. One <col> per column of cells, in the same order as the cells below. -->
			<colgroup>
				{#if selectable}<col style:width="{CHECK_WIDTH}px" />{/if}
				{#each leaves as column}
					<col style:width={widthOf(column) ? `${widthOf(column)}px` : undefined} />
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
								<!-- Your own drawing if you gave a `cell` snippet, otherwise just the value. -->
								{#if cell}{@render cell(row, column)}{:else}{row[column.key] ?? ''}{/if}
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
			</tbody>
		</table>
	</div>

	{#if summary}
		<div class="hb-table__summary">{@render summary()}</div>
	{/if}
</div>
