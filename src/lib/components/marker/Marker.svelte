<!--
	MARKER
	A tiny coloured dot or square — for legends and status lists.

	Figma:  habibi-library → page "marker"

	Use:
		<Marker colour="success" /> Active
		<Marker colour="accent-3" shape="circle" size="s" />
		<Marker colour="error" outline />

	Props:
		colour    "error" | "warning" | "success" | "progress" | "neutral" | "accent-1" … "accent-9".  Default "neutral"
		size      "m" (8px) | "s" (6px) | "xs" (4px).  Default "m"
		shape     "square" | "circle".  Default "square"
		outline   true = outline only, not filled.  Default false
-->
<script>
	import './marker.css';

	let {
		colour = 'neutral',
		size = 'm',
		shape = 'square',
		outline = false,
		class: extraClass = ''
	} = $props();
</script>

<span
	class="hb-marker hb-marker--{colour} hb-marker--{size} hb-marker--{shape} {extraClass}"
	class:hb-marker--outline={outline}
	aria-hidden="true"
></span>
