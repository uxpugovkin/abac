<!--
	TEXT INPUT
	A box to type one line of text into.

	Figma:  habibi-library → page "input" → "text-input"

	Use:
		<TextInput label="Email" placeholder="name@company.com" bind:value={email} />
		<TextInput icon="search" placeholder="Search attributes" bind:value={query} />
		<TextInput label="Login" bind:value={login} error="This login is taken" />
		<TextInput label="Comment" bind:value={text} maxlength={80} />      ← shows a "12 / 80" counter
		<TextInput big label="Full name" bind:value={name} />                ← tall box, label inside

	Props:
		value        the text. Use bind:value to read what the person typed
		label        text above the box (inside the box when `big`)
		placeholder  grey example text shown while the box is empty
		hint         small help text under the box
		error        error message under the box. When set, the field turns red
		icon         icon name shown at the start of the box
		iconEnd      icon name shown at the end of the box
		maxlength    longest text allowed. Also shows a counter under the box
		big          true = tall version (Figma "compact = False"). Default false.
		             While it is empty and not focused, only the label shows, big, in the middle
		disabled     true = cannot be edited
		…anything else (type, name, oninput, …) is passed straight to the <input>

	The look lives in ../field/field.css (shared with Select).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import '../field/field.css';

	let {
		value = $bindable(''),
		label = '',
		placeholder = '',
		hint = '',
		error = '',
		icon = '',
		iconEnd = '',
		maxlength = undefined,
		big = false,
		disabled = false,
		class: extraClass = '',
		...rest
	} = $props();

	let empty = $derived(value === '' || value == null);

	// The text under the box: the error wins over the hint.
	let tip = $derived(error || hint);
	let counter = $derived(maxlength ? `${value.length} / ${maxlength}` : '');
</script>

<label
	class="hb-field {extraClass}"
	class:hb-field--big={big}
	class:hb-field--empty={empty}
	class:hb-field--error={error}
	class:hb-field--disabled={disabled}
>
	{#if label && !big}<span class="hb-field__label">{label}</span>{/if}

	<span class="hb-field__body">
		{#if icon}<Icon name={icon} size={20} />{/if}

		{#if big}
			<!-- Big version: label and input stacked inside the box. -->
			<span class="hb-field__stack">
				{#if label}<span class="hb-field__label">{label}</span>{/if}
				<input class="hb-field__input" bind:value {placeholder} {maxlength} {disabled} {...rest} />
			</span>
		{:else}
			<input class="hb-field__input" bind:value {placeholder} {maxlength} {disabled} {...rest} />
		{/if}

		{#if iconEnd}<Icon name={iconEnd} size={20} />{/if}
	</span>

	{#if tip || counter}
		<span class="hb-field__tips">
			<span>{tip}</span>
			<span>{counter}</span>
		</span>
	{/if}
</label>
