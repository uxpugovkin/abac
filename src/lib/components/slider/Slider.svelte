<!--
	SLIDER
	Picks a number by dragging along a line.

	Figma:  habibi-library → page "slider" → "slider-horiz"

	Use:
		<Slider bind:value={volume} />
		<Slider bind:value={risk} min={0} max={1} step={0.01} label="Risk score" />
		<Slider bind:value={volume} big />

	Props:
		value      the number. Use bind:value to read it
		min, max   the range. Default 0 to 100
		step       how big one step is. Default 1
		label      what the slider controls, for screen readers
		big        true = the tall version (Figma "compact = False"). Default false
		disabled   true = cannot be moved
		…anything else (name, oninput, …) is passed straight to the <input>

	States, as in Figma (all done in slider.css, no code needed):
		hover      the line through the value grows to the full height, a bit lighter blue,
		           and a small bubble above it shows the value
		pressed    while dragging: the line turns darker blue, the bubble stays
		disabled   grey
	The bubble also shows while the slider has keyboard focus, so the value can be read
	when it is moved with the arrow keys.
-->
<script>
	import './slider.css';

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		label = '',
		big = false,
		disabled = false,
		class: extraClass = '',
		...rest
	} = $props();

	// How far along the slider the value is, from 0 to 1. CSS uses it to place the
	// coloured parts and the bubble.
	let share = $derived((value - min) / (max - min));
</script>

<span
	class="hb-slider {extraClass}"
	class:hb-slider--big={big}
	class:hb-slider--disabled={disabled}
	style:--slider-share={share}
>
	<!-- The browser's own slider: it does the dragging, the keyboard and screen readers. -->
	<input
		class="hb-slider__input"
		type="range"
		bind:value
		{min}
		{max}
		{step}
		{disabled}
		aria-label={label || undefined}
		{...rest}
	/>

	<!-- The value bubble (Figma "tooltip"), above the line. -->
	<span class="hb-slider__bubble" aria-hidden="true">{value}</span>
</span>
