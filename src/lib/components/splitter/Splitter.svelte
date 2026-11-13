<!--
	SPLITTER
	A thin vertical line between two panels that can be dragged to resize them.

	Figma:  habibi-library → page "splitter"

	Use — put it between two panels in a row, and keep the width yourself:
		<script>
			let sidebarWidth = $state(256);
		</script>

		<div style="display: flex">
			<aside style="width: {sidebarWidth}px">…</aside>
			<Splitter ondrag={(pixels) => (sidebarWidth += pixels)} />
			<main style="flex: 1">…</main>
		</div>

	Props:
		ondrag   called while dragging, with how many px the mouse moved since
		         the last call (positive = to the right, negative = to the left)
		label    what it resizes, for screen readers.  Default "Resize"

	Kept simple on purpose: the splitter does not resize anything itself.
	It only reports the movement; the page decides what to do with it
	(for example, limit the width to a minimum and a maximum).
	Keyboard: arrow left / right move it by 16px.
-->
<script>
	import './splitter.css';

	let { ondrag, label = 'Resize', class: extraClass = '' } = $props();

	let dragging = $state(false);
	let lastX = 0; // where the mouse was at the previous step

	function start(event) {
		dragging = true;
		lastX = event.clientX;
		// "Capture" keeps the movement coming to us even when the mouse leaves the thin line.
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	function move(event) {
		if (!dragging) return;
		ondrag?.(event.clientX - lastX);
		lastX = event.clientX;
	}

	function stop() {
		dragging = false;
	}

	function key(event) {
		if (event.key === 'ArrowLeft') ondrag?.(-16);
		if (event.key === 'ArrowRight') ondrag?.(16);
	}
</script>

<!-- A separator you can move IS interactive, so these two warnings do not apply here. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
<div
	class="hb-splitter {extraClass}"
	class:hb-splitter--dragging={dragging}
	role="separator"
	aria-orientation="vertical"
	aria-label={label}
	tabindex="0"
	onpointerdown={start}
	onpointermove={move}
	onpointerup={stop}
	onpointercancel={stop}
	onkeydown={key}
>
	<span class="hb-splitter__dot"></span>
	<span class="hb-splitter__dot"></span>
	<span class="hb-splitter__dot"></span>
</div>
