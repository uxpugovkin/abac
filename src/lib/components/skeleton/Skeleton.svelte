<!--
	SKELETON
	A grey pulsing bar that stands in for text while the real content loads.

	Figma:  habibi-library → page "skeleton"

	Use:
		<Skeleton />                 ← full width
		<Skeleton width={160} />     ← 160px wide
		<Skeleton width="60%" />

		{#if loading}<Skeleton width={120} />{:else}{user.name}{/if}

	Props:
		width   a number (px) or any CSS width like "60%".  Default: full width
-->
<script>
	import './skeleton.css';

	let { width = '100%', class: extraClass = '' } = $props();

	// A plain number means pixels.
	let cssWidth = $derived(typeof width === 'number' ? `${width}px` : width);
</script>

<span class="hb-skeleton {extraClass}" style:width={cssWidth} aria-hidden="true"></span>
