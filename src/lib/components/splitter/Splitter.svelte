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
		ondrag   called while dragging, with how many px the line should move to be
		         under the mouse again. Positive = the panel BEFORE the splitter should
		         grow (to the right on normal pages, to the left on right-to-left pages)
		label    what it resizes, for screen readers.  Default "Resize"

	Kept simple on purpose: the splitter does not resize anything itself.
	It only reports the movement; the page decides what to do with it
	(for example, limit the width to a minimum and a maximum).
	Keyboard: arrow left / right move it by 16px.

	The line follows the mouse POSITION, not the mouse movement: when a panel
	hits its limit the line stops, and it only moves again once the mouse is
	back over the line. So the line never runs away from the mouse.
-->
<script>
	import './splitter.css';

	let { ondrag, label = 'Resize', class: extraClass = '' } = $props();

	let dragging = $state(false);
	let line; // the splitter element
	let grab = 0; // where on the line it was grabbed: px from its middle

	// Where the middle of the line is on the screen right now.
	function middle() {
		const box = line.getBoundingClientRect();
		return box.left + box.width / 2;
	}

	// On right-to-left pages the panel before the splitter is on the right,
	// so moving the mouse to the left makes it bigger.
	function rightToLeft() {
		return getComputedStyle(line).direction === 'rtl';
	}

	function start(event) {
		dragging = true;
		grab = event.clientX - middle();
		// "Capture" keeps the movement coming to us even when the mouse leaves the thin line.
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	function move(event) {
		if (!dragging) return;
		// How far the line is from where the mouse wants it. If a panel hit its limit
		// last time, the line stayed put, so this is still the whole distance.
		const pixels = Math.round(event.clientX - grab - middle());
		if (pixels) ondrag?.(rightToLeft() ? -pixels : pixels);
	}

	// Also called when the browser takes the mouse away from us (for example when the
	// button is released outside the window), so the line never stays "grabbed".
	function stop() {
		dragging = false;
	}

	function key(event) {
		const step = rightToLeft() ? -16 : 16;
		if (event.key === 'ArrowLeft') ondrag?.(-step);
		if (event.key === 'ArrowRight') ondrag?.(step);
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
	bind:this={line}
	onpointerdown={start}
	onpointermove={move}
	onpointerup={stop}
	onpointercancel={stop}
	onlostpointercapture={stop}
	onkeydown={key}
>
	<span class="hb-splitter__dot"></span>
	<span class="hb-splitter__dot"></span>
	<span class="hb-splitter__dot"></span>
</div>
