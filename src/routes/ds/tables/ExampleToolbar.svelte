<!--
	EXAMPLE TOOLBAR — guide only.
	The toolbar of the "Employees" example table: a <TableToolbar> filled with the
	"all filters" button, the search, the filter tags and two buttons at the end.

	It changes `query` and `filtersOn`; the example that uses it filters its rows with them.
	All its words come from ../content.js.

	Use:
		<ExampleToolbar title="Employees" bind:query bind:filtersOn />

	Props:
		title          heading above the toolbar (optional)
		query          the search text.  Use bind:query
		filtersOn      the ids of the filters that are on, e.g. ['status'].  Use bind:filtersOn
		shown          which filter tags are in the toolbar.  Default the first four
		filterMenu     true = the list behind the "all filters" button starts open
		searchByName   true = the search box says "Search by name" instead of "Search"
		searchPinned   true = the search box is always open and looks focused, so the
		               example shows its placeholder (the two search examples)
		buttons        snippet for the buttons at the end.  Default: Download and Settings
-->
<script>
	import { TableToolbar, Button, FilterChip, SearchChip, TextInput, Menu, Checkbox } from '#lib';
	import { filterIds } from '../employees.js';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	let {
		title = '',
		query = $bindable(''),
		filtersOn = $bindable([]),
		shown = ['status', 'skills', 'department', 'office'],
		filterMenu = false,
		searchByName = false,
		searchPinned = false,
		buttons
	} = $props();

	// (Only the starting values come from the props, on purpose — hence the ignores.)
	const t = pick(content.tables); // the example texts, in the current language
	// svelte-ignore state_referenced_locally
	const placeholder = searchByName ? t.searchByName : t.search;

	// svelte-ignore state_referenced_locally
	let chips = $state([...shown]); // which filter tags are in the toolbar now
	// svelte-ignore state_referenced_locally
	let menuOpen = $state(filterMenu); // the list behind the "all filters" button

	function reset() {
		query = '';
		filtersOn = [];
	}

	function switchOn(id) {
		if (!filtersOn.includes(id)) filtersOn = [...filtersOn, id];
	}
	function switchOff(id) {
		filtersOn = filtersOn.filter((other) => other !== id);
	}

	// Tick or untick a filter in the list: its tag appears in, or leaves, the toolbar.
	function toggleChip(id) {
		if (chips.includes(id)) {
			chips = chips.filter((other) => other !== id);
			switchOff(id); // a filter that is not shown must not keep filtering
		} else {
			chips = filterIds.filter((other) => chips.includes(other) || other === id); // keep the usual order
		}
	}
</script>

<!-- Clicking anywhere else closes the list of all filters. -->
<svelte:window onclick={() => (menuOpen = false)} />

<TableToolbar {title}>
	<!-- "All filters": opens a list where filter tags can be switched on and off. -->
	<span class="tune">
		<Button
			icon="tune"
			label={t.filtersButton}
			onclick={(event) => {
				event.stopPropagation(); // do not let the window handler close what we just opened
				menuOpen = !menuOpen;
			}}
		/>
		{#if menuOpen}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="tune__menu" onclick={(event) => event.stopPropagation()}>
				<Menu label={t.filtersToShow}>
					{#each filterIds as id}
						<Checkbox checked={chips.includes(id)} onchange={() => toggleChip(id)}
							>{t.filters[id].name}</Checkbox
						>
					{/each}
				</Menu>
			</div>
		{/if}
	</span>

	{#if searchPinned}
		<!-- Guide-only trick: the open search box, drawn as if the cursor were in it.
		     (A real SearchChip closes when you click elsewhere.) It does search. -->
		<span class="hb-search-chip search-pinned">
			<TextInput icon="search" {placeholder} bind:value={query} aria-label={placeholder} />
		</span>
	{:else}
		<SearchChip bind:value={query} {placeholder} clearLabel={t.clearSearch} />
	{/if}

	<!-- Filter tags. In these examples a click simply switches on a ready-made value. -->
	{#each chips as id}
		<FilterChip
			name={t.filters[id].name}
			value={filtersOn.includes(id) ? t.filters[id].value : ''}
			onclick={() => switchOn(id)}
			onclear={() => switchOff(id)}
			clearLabel={t.clear}
		/>
	{/each}
	{#if filtersOn.length}<Button mode="ghost" onclick={reset}>{t.reset}</Button>{/if}

	{#snippet end()}
		{#if buttons}
			{@render buttons()}
		{:else}
			<Button icon="download" label={t.download} />
			<Button icon="settings" label={t.tableSettings} />
		{/if}
	{/snippet}
</TableToolbar>

<style>
	/* The "all filters" button, with its list opening right under it. */
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

	/* The pinned search box wears the "focus" look of a field all the time:
	   the same three values as .hb-field:focus-within in field.css. */
	.search-pinned :global(.hb-field) {
		--field-line: var(--boring-blue-50);
		--field-line-width: 2px;
		--field-placeholder: var(--uncolorful-grey-disabled);
	}
</style>
