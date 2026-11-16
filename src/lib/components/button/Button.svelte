<!--
	BUTTON
	Something you click to make an action happen.

	Figma:  habibi-library → page "button" (covers "button" and "icon-button")

	Use:
		<Button>Cancel</Button>
		<Button appearance="accent" mode="primary" icon="plus">Add user</Button>
		<Button mode="ghost" icon="close" label="Close" />        ← icon only
		<Button href="/users">Go to users</Button>                 ← a link that looks like a button
		<Button onclick={save} disabled={!canSave}>Save</Button>

	Props:
		appearance   colour set:  "default" (grey) | "accent" (blue) | "danger" (red) | "white".  Default "default"
		mode         how loud:    "primary" (strong fill) | "secondary" (soft fill) | "ghost" (no fill).  Default "secondary"
		size         "s" (28px tall) | "m" (36px tall).  Default "s"
		icon         name of an icon shown BEFORE the text (see Icon)
		iconEnd      name of an icon shown AFTER the text
		label        needed for icon-only buttons: says what the button does (tooltip + screen readers)
		disabled     true = cannot be clicked
		href         if set, the button becomes a link to this address
		onclick      what happens on click. Not called while disabled
		…anything else (type, id, …) is passed straight to the <button>

	Text: put it between the tags. Leave it out for an icon-only button.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './button.css';

	let {
		appearance = 'default',
		mode = 'secondary',
		size = 's',
		icon = '',
		iconEnd = '',
		label = '',
		disabled = false,
		href = '',
		onclick,
		children,
		class: extraClass = '',
		...rest
	} = $props();

	// Icons are 20px in size S and 24px in size M (with or without text).
	let iconOnly = $derived(!children);
	let iconSize = $derived(size === 'm' ? 24 : 20);

	let classes = $derived(
		[
			'hb-btn',
			`hb-btn--${appearance}`,
			`hb-btn--${mode}`,
			`hb-btn--${size}`,
			iconOnly && 'hb-btn--icon-only',
			extraClass
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<!-- What goes inside is the same for a real button and for a link. -->
{#snippet content()}
	{#if icon}<Icon name={icon} size={iconSize} />{/if}
	{#if children}<span class="hb-btn__label">{@render children()}</span>{/if}
	{#if iconEnd}<Icon name={iconEnd} size={iconSize} />{/if}
{/snippet}

{#if href}
	<!-- A disabled <button> ignores clicks by itself; a link does not, so a disabled link gets no onclick. -->
	<a
		class={classes}
		href={disabled ? undefined : href}
		aria-disabled={disabled ? 'true' : undefined}
		aria-label={label || undefined}
		title={label || undefined}
		onclick={disabled ? undefined : onclick}
		{...rest}
	>
		{@render content()}
	</a>
{:else}
	<button
		class={classes}
		type="button"
		{disabled}
		aria-label={label || undefined}
		title={label || undefined}
		{onclick}
		{...rest}
	>
		{@render content()}
	</button>
{/if}
