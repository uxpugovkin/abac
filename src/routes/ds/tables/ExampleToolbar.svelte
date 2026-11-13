<!--
	EXAMPLE TOOLBAR — guide only.
	The toolbar of the "Employees" example table: a <TableToolbar> filled with the
	"all filters" button, the search, the filter tags and two buttons at the end.

	It changes `query` and `values`; the example that uses it filters its rows with them.

	Use:
		<ExampleToolbar title="Employees" bind:query bind:values />

	Props:
		title              heading above the toolbar (optional)
		query              the search text.  Use bind:query
		values             filter name → chosen value, e.g. { Status: 'Active' }.  Use bind:values
		shown              which filter tags are in the toolbar.  Default the first four
		filterMenu         true = the list behind the "all filters" button starts open
		searchPlaceholder  hint in the search box.  Default "Search"
		searchPinned       true = the search box is always open and looks focused, so the
		                   example shows its placeholder (the two search examples)
		buttons            snippet for the buttons at the end.  Default: Download and Settings
-->
<script>
	import { TableToolbar, Button, FilterChip, SearchChip, TextInput, Menu, Checkbox } from '#lib';
	import { filterPresets } from '../employees.js';

	let {
		title = '',
		query = $bindable(''),
		values = $bindable({}),
		shown = ['Status', 'Skills', 'Department', 'Office'],
		filterMenu = false,
		searchPlaceholder = 'Search',
		searchPinned = false,
		buttons
	} = $props();

	const allFilters = Object.keys(filterPresets);

	// (Only the starting values come from the props, on purpose — hence the ignores.)
	// svelte-ignore state_referenced_locally
	let chips = $state([...shown]); // which filter tags are in the toolbar now
	// svelte-ignore state_referenced_locally
	let menuOpen = $state(filterMenu); // the list behind the "all filters" button

	let anyFilter = $derived(Object.values(values).some(Boolean));

	function reset() {
		query = '';
		values = {};
	}

	// Tick or untick a filter in the list: its tag appears in, or leaves, the toolbar.
	function toggleChip(name) {
		if (chips.includes(name)) {
			chips = chips.filter((other) => other !== name);
			values[name] = ''; // a filter that is not shown must not keep filtering
		} else {
			chips = allFilters.filter((other) => chips.includes(other) || other === name); // keep the usual order
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
			label="Filters"
			onclick={(event) => {
				event.stopPropagation(); // do not let the window handler close what we just opened
				menuOpen = !menuOpen;
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

	{#if searchPinned}
		<!-- Guide-only trick: the open search box, drawn as if the cursor were in it.
		     (A real SearchChip closes when you click elsewhere.) It does search. -->
		<span class="hb-search-chip search-pinned">
			<TextInput
				icon="search"
				placeholder={searchPlaceholder}
				bind:value={query}
				aria-label={searchPlaceholder}
			/>
		</span>
	{:else}
		<SearchChip bind:value={query} placeholder={searchPlaceholder} />
	{/if}

	<!-- Filter tags. In these examples a click simply sets a ready-made value. -->
	{#each chips as name}
		<FilterChip
			{name}
			value={values[name]}
			onclick={() => (values[name] = filterPresets[name])}
			onclear={() => (values[name] = '')}
		/>
	{/each}
	{#if anyFilter}<Button mode="ghost" onclick={reset}>Reset</Button>{/if}

	{#snippet end()}
		{#if buttons}
			{@render buttons()}
		{:else}
			<Button icon="download" label="Download" />
			<Button icon="settings" label="Table settings" />
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
