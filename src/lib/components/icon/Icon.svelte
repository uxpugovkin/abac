<!--
	ICON
	Draws one icon from the Figma "icons" page.

	Figma:  habibi-library → page "icons"

	Use:
		<Icon name="search" />
		<Icon name="close" size={20} />
		<Icon name="warning" label="Warning" />   ← read aloud by screen readers

	Props:
		name    which icon. All names are listed in icon-paths.js (same as in Figma, without "icons/")
		size    width and height in px. Figma uses 24, 20 and 16. Default 24
		label   optional description for screen readers. Leave empty for decorative icons
		class   optional extra CSS class

	Colour: the icon uses the current text colour (see icon.css).
-->
<script>
	import { iconPaths } from './icon-paths.js';
	import './icon.css';

	let { name, size = 24, label = '', class: extraClass = '' } = $props();

	// One icon = one or more shapes, separated by "|" (format explained in icon-paths.js).
	let shapes = $derived((iconPaths[name] ?? '').split('|').filter(Boolean));

	// Helpful message while building: tells you when an icon name has a typo.
	$effect(() => {
		if (!iconPaths[name])
			console.warn(`Icon: there is no icon called "${name}". See icon-paths.js.`);
	});
</script>

<svg
	class="hb-icon {extraClass}"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
>
	{#each shapes as shape}
		{#if shape.startsWith('E')}
			<!-- "E" = this shape has holes cut out of it (the "evenodd" rule). -->
			<path d={shape.slice(1)} fill-rule="evenodd" clip-rule="evenodd" />
		{:else}
			<path d={shape} />
		{/if}
	{/each}
</svg>
