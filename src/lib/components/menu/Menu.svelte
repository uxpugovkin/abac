<!--
	MENU
	A floating card with a list of choices (Figma calls it "drop-list").
	Put MenuItem rows inside.

	Figma:  habibi-library → page "Drop List" → "drop-list"

	Use:
		<Menu>
			<MenuItem icon="edit" onclick={rename}>Rename</MenuItem>
			<MenuItem icon="duplicate" onclick={copy}>Duplicate</MenuItem>
			<div class="hb-menu__heading">Danger zone</div>
			<MenuItem icon="delete" onclick={remove}>Delete</MenuItem>
		</Menu>

	Props:
		label   what the menu is for, for screen readers (optional)

	A heading between groups is a plain <div class="hb-menu__heading">.

	Kept simple on purpose: Menu only draws the card. Showing and hiding it,
	and placing it next to a button, is up to the page, e.g.
		{#if open}<Menu>…</Menu>{/if}
-->
<script>
	import './menu.css';

	let { label = '', children, class: extraClass = '' } = $props();
</script>

<div class="hb-menu {extraClass}" role="menu" aria-label={label || undefined}>
	{@render children?.()}
</div>
