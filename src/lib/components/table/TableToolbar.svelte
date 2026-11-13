<!--
	TABLE TOOLBAR
	What sits above a table: an optional title, then one line with search and
	filters at the start and up to 3 buttons at the end (guidelines 1.1, 3 and 4).

	Figma:  habibi-library → page "Tables Guide" (Tool-Bar)

	Use — hand it to the table, so the table can keep it on top while it scrolls:
		<Table {columns} {rows}>
			{#snippet toolbar()}
				<TableToolbar title="Employees">
					<SearchChip bind:value={query} />
					<FilterChip name="Status" value={status} onclick={…} onclear={…} />

					{#snippet end()}
						<Button icon="download" label="Download" />
						<Button appearance="accent" mode="primary">Add row</Button>
					{/snippet}
				</TableToolbar>
			{/snippet}
		</Table>

	It also works on its own, without a table around it.

	Props (all optional):
		title      a heading above the toolbar. Only needed if the page has other
		           content besides the table
		children   the search and the filters (they wrap to a new line if they do not fit)
		end        snippet with the buttons at the far side

	It only places things. What the search and the filters do is up to the page.
-->
<script>
	import './table.css';

	let { title = '', children, end, class: extraClass = '' } = $props();
</script>

{#if title}<h3 class="hb-table-title">{title}</h3>{/if}

<div class="hb-table-toolbar {extraClass}">
	{@render children?.()}
	{#if end}<div class="hb-table-toolbar__end">{@render end()}</div>{/if}
</div>
