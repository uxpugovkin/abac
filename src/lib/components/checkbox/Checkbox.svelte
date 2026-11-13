<!--
	CHECKBOX
	A tick box: on or off. Use several when people may pick more than one thing.

	Figma:  habibi-library → page "checkbox"

	Use:
		<Checkbox bind:checked={agree}>I agree</Checkbox>
		<Checkbox bind:checked={all} indeterminate={some}>Select all</Checkbox>
		<Checkbox subtitle="Sent once a week">Email me updates</Checkbox>

	Props:
		checked        true = ticked. Use bind:checked to read it
		indeterminate  true = shows a dash ("some, but not all")
		subtitle       small second line under the title
		disabled       true = cannot be changed
		…anything else (name, value, onchange, …) is passed straight to the <input>

	Text: put the title between the tags.
	The look lives in check.css (shared with Radio).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './check.css';

	let {
		checked = $bindable(false),
		indeterminate = false,
		subtitle = '',
		disabled = false,
		children,
		class: extraClass = '',
		...rest
	} = $props();

	// Which picture to show: dash, tick, or empty box.
	let icon = $derived(indeterminate ? 'semi-check' : checked ? 'check' : 'uncheck');
</script>

<label class="hb-check {extraClass}" class:hb-check--disabled={disabled}>
	<input
		class="hb-check__input"
		type="checkbox"
		bind:checked
		{indeterminate}
		{disabled}
		{...rest}
	/>
	<Icon name={icon} />
	{#if children || subtitle}
		<span class="hb-check__text">
			{#if children}<span>{@render children()}</span>{/if}
			{#if subtitle}<span class="hb-check__subtitle">{subtitle}</span>{/if}
		</span>
	{/if}
</label>
