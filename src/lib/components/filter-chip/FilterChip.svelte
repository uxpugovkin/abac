<!--
	FILTER CHIP
	A pill above a table that opens a filter ("Status ▾").
	Once a value is chosen it turns blue and shows it ("Status Active ×").

	Figma:  habibi-library → page "chips" → "filter-tag"

	Use:
		<FilterChip name="Status" value={status} onclick={openStatusMenu} onclear={() => (status = '')} />

	Props:
		name       what is being filtered, e.g. "Status"
		value      the chosen value as text. Empty = nothing chosen yet
		onclick    called when the chip is clicked (open your menu here)
		onclear    called when the × is clicked (reset your filter here)
		clearLabel what the × is called, for screen readers: "<clearLabel> <name>".
		           Default "Clear"
		disabled   true = cannot be clicked

	FilterChip only shows the state. Opening a list of choices and keeping the
	chosen value is up to the page.
	The look lives in ../chip/chip.css (shared with Chip and Segmented).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import '../chip/chip.css';

	let {
		name = '',
		value = '',
		onclick,
		onclear,
		clearLabel = 'Clear',
		disabled = false,
		class: extraClass = ''
	} = $props();
</script>

<span
	class="hb-chip hb-chip--filter {extraClass}"
	class:hb-chip--active={value}
	class:hb-chip--disabled={disabled}
>
	{#if value}
		<button type="button" {disabled} {onclick}>
			<span class="hb-chip__filter-name">{name}</span>
			<span class="hb-chip__filter-value">{value}</span>
		</button>
		<button type="button" {disabled} aria-label="{clearLabel} {name}" onclick={onclear}>
			<Icon name="close" size={20} />
		</button>
	{:else}
		<button type="button" {disabled} {onclick}>
			{name}
			<Icon name="chevron-down" size={20} />
		</button>
	{/if}
</span>
