<!--
	CHIP
	A small pill that can be switched on and off — for quick scopes and filters
	like "All · Mine · Archived".

	Figma:  habibi-library → page "chips" → "scope"

	Use:
		<Chip bind:active={onlyMine}>Mine</Chip>
		<Chip icon="lock" active>Locked</Chip>

	Props:
		active     true = on (blue). Use bind:active to let a click toggle it
		icon       icon name shown before the text
		disabled   true = cannot be clicked
		…anything else (onclick, …) is passed straight to the <button>

	Text: put it between the tags.
	The look lives in chip.css (shared with Segmented and FilterChip).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './chip.css';

	let {
		active = $bindable(false),
		icon = '',
		disabled = false,
		children,
		class: extraClass = '',
		...rest
	} = $props();
</script>

<button
	class="hb-chip hb-chip--scope {extraClass}"
	class:hb-chip--active={active}
	type="button"
	aria-pressed={active}
	{disabled}
	onclick={() => (active = !active)}
	{...rest}
>
	{#if icon}<Icon name={icon} size={20} />{/if}
	{#if children}<span class="hb-chip__label">{@render children()}</span>{/if}
</button>
