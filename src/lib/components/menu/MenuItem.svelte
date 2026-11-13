<!--
	MENU ITEM
	One row inside a Menu.

	Figma:  habibi-library → page "Drop List" → "drop-list/.meta/row"

	Use:
		<MenuItem onclick={open}>Open</MenuItem>
		<MenuItem icon="profile" label="Signed in as" subtitle="Super admin">Tatiana Pirog</MenuItem>
		<MenuItem checked={sort === 'name'} onclick={() => (sort = 'name')}>By name</MenuItem>

	Props:
		icon       icon name shown at the start of the row
		label      small grey line ABOVE the title
		subtitle   small grey line UNDER the title
		checked    true = shows a tick at the end (the chosen row)
		disabled   true = cannot be clicked
		…anything else (onclick, …) is passed straight to the <button>

	Text: put the title between the tags.
	The look lives in menu.css.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './menu.css';

	let {
		icon = '',
		label = '',
		subtitle = '',
		checked = false,
		disabled = false,
		children,
		class: extraClass = '',
		...rest
	} = $props();
</script>

<button class="hb-menu__item {extraClass}" type="button" role="menuitem" {disabled} {...rest}>
	{#if icon}<Icon name={icon} />{/if}
	<span class="hb-menu__text">
		{#if label}<span class="hb-menu__small">{label}</span>{/if}
		{#if children}<span>{@render children()}</span>{/if}
		{#if subtitle}<span class="hb-menu__small">{subtitle}</span>{/if}
	</span>
	{#if checked}<Icon name="done" class="hb-menu__tick" label="Selected" />{/if}
</button>
