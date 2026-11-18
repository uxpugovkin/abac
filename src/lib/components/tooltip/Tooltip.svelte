<!--
	TOOLTIP
	A small dark bubble with a hint. Appears when the mouse is over something
	(or when it is focused with the keyboard).

	Figma:  habibi-library → page "tooltip"

	Use — wrap the thing that needs a hint:
		<Tooltip text="Download as JSON">
			<Button icon="download" label="Download" />
		</Tooltip>

		<Tooltip title="Last sync" text="12.08.2026, 14:30" placement="bottom">
			<Tag>Synced</Tag>
		</Tooltip>

	Props:
		text        the hint
		title       optional bold first line
		placement   "top" | "bottom".  Default "top"
		align       "center" | "end".  Default "center".
		            "end" lines the bubble up with the end of the wrapped thing, so it does
		            not run off the screen at the far edge. Made for icon buttons: the
		            arrow sits 14px from the end (the middle of a 28px button)

	Kept simple on purpose: the bubble does not check the edges of the screen.
	Near an edge, pick the placement and align that fit.
-->
<script>
	import './tooltip.css';

	let {
		text = '',
		title = '',
		placement = 'top',
		align = 'center',
		children,
		class: extraClass = ''
	} = $props();
</script>

<span class="hb-tooltip hb-tooltip--{placement} hb-tooltip--align-{align} {extraClass}">
	{@render children?.()}
	<span class="hb-tooltip__bubble" role="tooltip">
		{#if title}<span class="hb-tooltip__title">{title}</span>{/if}
		{#if text}<span>{text}</span>{/if}
	</span>
</span>
