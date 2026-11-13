<!--
	SEGMENTED
	A row of pills in a grey tray where exactly ONE is chosen —
	for switching a view mode, like "List · Grid" or "Read · Comparison".

	Figma:  habibi-library → page "chips" → "segment" and "segment-group"

	Use:
		<Segmented
			bind:value={view}
			options={[
				{ value: 'list', label: 'List', icon: 'menu' },
				{ value: 'grid', label: 'Grid', icon: 'view-grid' }
			]}
		/>

		Plain texts work too:
		<Segmented bind:value={period} options={['Day', 'Week', 'Month']} />

	Props:
		value      the chosen value. Use bind:value to read and change it
		options    the list. Either plain texts, or objects { value, label, icon, disabled }
		disabled   true = the whole control cannot be clicked

	The look lives in ../chip/chip.css (shared with Chip and FilterChip).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import '../chip/chip.css';

	let { value = $bindable(), options = [], disabled = false, class: extraClass = '' } = $props();

	// Accept both 'Text' and { value, label }: turn everything into { value, label }.
	let items = $derived(
		options.map((option) =>
			typeof option === 'string' ? { value: option, label: option } : option
		)
	);
</script>

<div class="hb-segmented {extraClass}" role="radiogroup">
	{#each items as item}
		<button
			class="hb-chip hb-chip--segment"
			class:hb-chip--active={item.value === value}
			type="button"
			role="radio"
			aria-checked={item.value === value}
			disabled={disabled || item.disabled}
			onclick={() => (value = item.value)}
		>
			{#if item.icon}<Icon name={item.icon} size={20} />{/if}
			<span class="hb-chip__label">{item.label}</span>
		</button>
	{/each}
</div>
