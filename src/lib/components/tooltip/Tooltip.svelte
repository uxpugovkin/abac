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

	Kept simple on purpose: the bubble is always centred on the wrapped thing
	and does not check the edges of the screen. Near an edge, pick the
	placement that fits.
-->
<script>
	import './tooltip.css';

	let { text = '', title = '', placement = 'top', children, class: extraClass = '' } = $props();
</script>

<span class="hb-tooltip hb-tooltip--{placement} {extraClass}">
	{@render children?.()}
	<span class="hb-tooltip__bubble" role="tooltip">
		{#if title}<span class="hb-tooltip__title">{title}</span>{/if}
		{#if text}<span>{text}</span>{/if}
	</span>
</span>
