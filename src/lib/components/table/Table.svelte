<!--
	TABLE
	Rows and columns of data. You describe the columns, hand over the rows,
	and the table draws itself.

	Figma:  habibi-library → page "table"

	Use — the simplest table:
		<Table
			columns={[
				{ key: 'login', label: 'Login', width: 240 },
				{ key: 'fullName', label: 'Full name' },
				{ key: 'status', label: 'Status', width: 120 }
			]}
			rows={[
				{ login: 'walker85@acme.corp', fullName: 'Brenda Cooper', status: 'Active' },
				{ login: 'const.b.e@acme.corp', fullName: 'Constantin Polski', status: 'Suspended' }
			]}
		/>

	Use — draw some cells yourself (for tags, avatars, buttons…):
		<Table {columns} {rows}>
			{#snippet cell(row, column)}
				{#if column.key === 'status'}
					<Tag colour={row.status === 'Active' ? 'success' : 'error'} size="s">{row.status}</Tag>
				{:else}
					{row[column.key]}
				{/if}
			{/snippet}
		</Table>

	Props:
		columns       what the table shows, left to right. Each column:
		                key       which field of a row to show
		                label     the header text
		                width     width in px (optional; columns without it share the rest)
		                sortable  true = the header can be clicked to sort (optional)
		rows          the data: a list of objects. Each object is one row
		cell          optional snippet to draw a cell yourself. Gets (row, column)
		onrowclick    called with the row when a row is clicked. Also makes rows highlight on hover
		selected      the row to highlight (pass the same object that is in `rows`)
		sortKey       key of the column the data is sorted by (shows the arrow)
		sortDirection "asc" (A→Z) | "desc" (Z→A).  Default "asc"
		onsort        called with the column key when a sortable header is clicked

	Kept simple on purpose: the table never changes your data. Sorting and
	filtering happen in the page — the table just shows `rows` in the order
	it gets them and tells you what was clicked.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './table.css';

	let {
		columns = [],
		rows = [],
		cell,
		onrowclick,
		selected = undefined,
		sortKey = '',
		sortDirection = 'asc',
		onsort,
		class: extraClass = ''
	} = $props();
</script>

<table class="hb-table {extraClass}" class:hb-table--clickable={onrowclick}>
	<thead>
		<tr>
			{#each columns as column}
				<th style:width={column.width ? `${column.width}px` : undefined}>
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
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each rows as row}
			<tr class:hb-table__row--selected={row === selected} onclick={() => onrowclick?.(row)}>
				{#each columns as column}
					<td>
						<!-- Your own drawing if you gave a `cell` snippet, otherwise just the value. -->
						{#if cell}{@render cell(row, column)}{:else}{row[column.key] ?? ''}{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
