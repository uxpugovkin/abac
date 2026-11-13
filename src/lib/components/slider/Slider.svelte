<!--
	SLIDER
	Picks a number by dragging along a line.

	Figma:  habibi-library → page "slider" → "slider-horiz"

	Use:
		<Slider bind:value={volume} />
		<Slider bind:value={risk} min={0} max={1} step={0.01} label="Risk score" />

	Props:
		value      the number. Use bind:value to read it
		min, max   the range. Default 0 to 100
		step       how big one step is. Default 1
		label      what the slider controls, for screen readers
		disabled   true = cannot be moved
		…anything else (name, oninput, …) is passed straight to the <input>

	On a card (white surface) the little gap beside the thumb should match
	the card colour. Set it on any parent:
		style="--slider-gap: var(--uncolorful-grey-surface)"
-->
<script>
	import './slider.css';

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		label = '',
		disabled = false,
		class: extraClass = '',
		...rest
	} = $props();

	// How far along the track the value is, as a percentage. CSS uses it to colour the track.
	let fill = $derived(((value - min) / (max - min)) * 100);
</script>

<input
	class="hb-slider {extraClass}"
	type="range"
	bind:value
	{min}
	{max}
	{step}
	{disabled}
	aria-label={label || undefined}
	style="--slider-fill: {fill}%"
	{...rest}
/>
