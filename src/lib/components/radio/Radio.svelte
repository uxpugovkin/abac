<!--
	RADIO
	One option out of a group. Picking one un-picks the others.

	Figma:  habibi-library → page "radio-button"

	Use (all radios of one question share the same bind:group):
		<Radio bind:group={plan} value="free">Free</Radio>
		<Radio bind:group={plan} value="pro" subtitle="Billed yearly">Pro</Radio>

	Props:
		group      the chosen value of the whole group. Use bind:group
		value      the value THIS radio stands for
		subtitle   small second line under the title
		disabled   true = cannot be picked
		…anything else (name, onchange, …) is passed straight to the <input>

	Text: put the title between the tags.
	The look lives in ../checkbox/check.css (shared with Checkbox).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import '../checkbox/check.css';

	let {
		group = $bindable(),
		value,
		subtitle = '',
		disabled = false,
		children,
		class: extraClass = '',
		...rest
	} = $props();
</script>

<label class="hb-check {extraClass}" class:hb-check--disabled={disabled}>
	<input class="hb-check__input" type="radio" bind:group {value} {disabled} {...rest} />
	<Icon name={group === value ? 'radio-on' : 'radio-off'} />
	{#if children || subtitle}
		<span class="hb-check__text">
			{#if children}<span>{@render children()}</span>{/if}
			{#if subtitle}<span class="hb-check__subtitle">{subtitle}</span>{/if}
		</span>
	{/if}
</label>
