<!--
	TAG
	A small coloured label that shows a status, e.g. "Active" or "Suspended".

	Figma:  habibi-library → page "tag"

	Use:
		<Tag colour="success">Active</Tag>
		<Tag colour="error" icon="warning">Blocked</Tag>
		<Tag colour="neutral" size="s">Draft</Tag>
		<Tag colour="progress" size="xs">Syncing</Tag>      ← marker + text, no box
		<Tag colour="success" size="xs" shape="circle">Active</Tag>             ← round marker
		<Tag size="xs" shape="circle" outline>Inactive</Tag>                    ← marker not filled

	Props:
		colour     "error" (red) | "warning" (orange) | "success" (green) | "progress" (blue) | "neutral" (grey).  Default "neutral"
		size       "m" (20px) | "s" (18px, ALL CAPS) | "xs" (marker + text).  Default "m"
		icon       icon name shown before the text (sizes m and s)
		shape      size xs only: the marker is a "square" or a "circle".  Default "square"
		outline    size xs only: true = the marker is an outline, not filled.  Default false
		disabled   true = greyed out

	Text: put it between the tags.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import Marker from '../marker/Marker.svelte';
	import './tag.css';

	let {
		colour = 'neutral',
		size = 'm',
		icon = '',
		shape = 'square',
		outline = false,
		disabled = false,
		children,
		class: extraClass = ''
	} = $props();
</script>

<span class="hb-tag hb-tag--{colour} hb-tag--{size} {extraClass}" class:hb-tag--disabled={disabled}>
	{#if size === 'xs'}
		<Marker {shape} {outline} />
	{:else if icon}
		<Icon name={icon} size={16} />
	{/if}
	{@render children?.()}
</span>
