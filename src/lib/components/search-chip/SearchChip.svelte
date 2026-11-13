<!--
	SEARCH CHIP
	The search of a table toolbar. It takes little room until it is needed:

		1. closed    a small button with a magnifying glass
		2. open      click it → a box to type in
		3. applied   press Enter (or click away) → a blue chip with the text and an ×

	Figma:  habibi-library → page "Tables Guide" → "Search and filter"

	Use:
		<SearchChip bind:value={query} />                               ← searches several columns
		<SearchChip bind:value={query} placeholder="Search by name" />  ← searches one column: name it

	Props:
		value         the text that is being searched for. Use bind:value.
		              It only changes when the search is applied or cleared — not on every key press
		placeholder   grey text in the open box.  Default "Search"
		open          true = starts with the box open

	The look lives in ../chip/chip.css and ../field/field.css.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import Button from '../button/Button.svelte';
	import TextInput from '../text-input/TextInput.svelte';
	import '../chip/chip.css';

	let {
		value = $bindable(''),
		placeholder = 'Search',
		open = false,
		class: extraClass = ''
	} = $props();

	// What is in the box while typing. It becomes `value` when the search is applied.
	// (Only the starting value is used here, on purpose — hence the ignore.)
	// svelte-ignore state_referenced_locally
	let typed = $state(value);
	// svelte-ignore state_referenced_locally
	let isOpen = $state(open);

	function apply() {
		value = typed.trim();
		isOpen = false;
	}

	function clear() {
		typed = '';
		value = '';
	}

	function onkeydown(event) {
		if (event.key === 'Enter') apply();
		if (event.key === 'Escape') isOpen = false;
	}

	// Svelte "action": puts the cursor into the box as soon as it appears.
	function focusInput(wrapper) {
		wrapper.querySelector('input')?.focus();
	}
</script>

{#if isOpen}
	<span class="hb-search-chip {extraClass}" use:focusInput>
		<TextInput
			icon="search"
			{placeholder}
			bind:value={typed}
			{onkeydown}
			onblur={apply}
			aria-label={placeholder}
		/>
	</span>
{:else if value}
	<span class="hb-chip hb-chip--filter hb-chip--active hb-chip--search {extraClass}">
		<button type="button" onclick={() => (isOpen = true)}>
			<Icon name="search" size={20} />
			<span class="hb-chip__filter-value">{value}</span>
		</button>
		<button type="button" aria-label="Clear search" onclick={clear}>
			<Icon name="close" size={20} />
		</button>
	</span>
{:else}
	<Button icon="search" label={placeholder} onclick={() => (isOpen = true)} class={extraClass} />
{/if}
