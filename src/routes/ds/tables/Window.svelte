<!--
	WINDOW — guide only.
	Makes an example box play the browser window: the box scrolls, and what is
	inside (a <Table pageScroll>) behaves like on a real, long page.
	Used by the SCROLLING examples.

	Use:
		<Window height={420}>
			<Table pageScroll … />
		</Window>

	Props:
		height   px. With it the window is that tall and scrolls up-down as well.
		         Without it the window is as tall as its content and only scrolls sideways
-->
<script>
	let { height = 0, children } = $props();
</script>

<!-- hb-scroll = the design system's scrollbars.
     --table-sticky-top tells the table that 16px at the top are already taken (the cover below). -->
<div
	class="window hb-scroll"
	class:window--tall={height}
	style:height={height ? `${height}px` : undefined}
	style:--table-sticky-top="16px"
>
	<!-- A 16px strip that stays at the top: the card's padding, which rows must not scroll over. -->
	<div class="cover"></div>
	{@render children()}
</div>

<style>
	.window {
		overflow: auto;
		/* Reach the top and bottom edge of the bordered card (it has 16px of padding),
		   so the sideways scrollbar sits at the bottom edge, like in a real window. */
		margin-block: -16px;
	}
	/* With an up-down scrollbar: reach the far edge too, so that scrollbar sits at the edge. */
	.window--tall {
		margin-inline-end: -16px;
	}
	.cover {
		position: sticky;
		top: 0;
		inset-inline-start: 0;
		z-index: 7;
		height: 16px;
		background: var(--uncolorful-grey-surface);
	}
</style>
