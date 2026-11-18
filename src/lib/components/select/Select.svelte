<!--
	SELECT
	A box that opens a list to pick ONE option from.

	Figma:  habibi-library → page "input" → "select"

	Use:
		<Select
			label="Attributes type"
			placeholder="Choose…"
			options={['Domain attributes', 'Roles', 'Auth']}
			bind:value={type}
		/>

		Options can also have a separate value and label:
		<Select options={[{ value: 'ru', label: 'Russian' }, { value: 'en', label: 'English' }]} bind:value={lang} />

	Props:
		value        the chosen value. Use bind:value to read the choice
		options      the list. Either plain texts, or objects { value, label, disabled }
		label        text above the box (inside the box when `big`)
		placeholder  grey text shown while nothing is chosen
		hint         small help text under the box
		error        error message under the box. When set, the field turns red
		big          true = tall version (Figma "compact = False"). Default false.
		             While nothing is chosen, only the label shows, big (no placeholder)
		disabled     true = cannot be changed
		…anything else (name, onchange, …) is passed straight to the <select>

	Kept simple on purpose: this is the browser's own <select> with our look,
	so the opened list is drawn by the browser. It works with keyboard and
	on phones for free. For a custom-drawn list see Menu.

	The look lives in ../field/field.css (shared with TextInput).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import '../field/field.css';

	let {
		value = $bindable(''),
		options = [],
		label = '',
		placeholder = '',
		hint = '',
		error = '',
		big = false,
		disabled = false,
		class: extraClass = '',
		...rest
	} = $props();

	// Accept both 'Text' and { value, label }: turn everything into { value, label }.
	let items = $derived(
		options.map((option) =>
			typeof option === 'string' ? { value: option, label: option } : option
		)
	);

	let tip = $derived(error || hint);
	let empty = $derived(value === '' || value == null);

	// The grey text shown while nothing is chosen.
	// Big select: the label itself takes that place, big; it moves up once something is chosen.
	let emptyText = $derived(big ? label || placeholder : placeholder);
</script>

<!-- The <select> itself, used in both sizes below. -->
{#snippet control()}
	<!-- `required` lets CSS know when nothing is chosen yet, to grey out the placeholder. -->
	<select
		class="hb-field__input"
		bind:value
		{disabled}
		required
		aria-label={big ? label || undefined : undefined}
		{...rest}
	>
		{#if emptyText}<option value="" disabled hidden>{emptyText}</option>{/if}
		{#each items as item}
			<option value={item.value} disabled={item.disabled}>{item.label}</option>
		{/each}
	</select>
{/snippet}

<label
	class="hb-field {extraClass}"
	class:hb-field--big={big}
	class:hb-field--error={error}
	class:hb-field--disabled={disabled}
>
	{#if label && !big}<span class="hb-field__label">{label}</span>{/if}

	<span class="hb-field__body">
		{#if big}
			<span class="hb-field__stack">
				<!-- Nothing chosen: the select shows the label itself (see emptyText). -->
				{#if label && !empty}<span class="hb-field__label">{label}</span>{/if}
				{@render control()}
			</span>
		{:else}
			{@render control()}
		{/if}
		<Icon name="chevron-down" size={20} class="hb-field__chevron" />
	</span>

	{#if tip}
		<span class="hb-field__tips"><span>{tip}</span></span>
	{/if}
</label>
