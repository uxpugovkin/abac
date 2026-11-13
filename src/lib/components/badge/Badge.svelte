<!--
	BADGE
	A small round counter, e.g. the number of unread items.

	Figma:  habibi-library → page "badge"

	Use:
		<Badge>3</Badge>
		<Badge colour="success" size="s">12</Badge>
		<Badge colour="accent-7">99+</Badge>

	Props:
		colour   "error" (red) | "warning" (orange) | "success" (green) | "progress" (blue) |
		         "neutral" (white) | "accent-1" … "accent-9".  Default "error"
		size     "m" (20px) | "s" (16px).  Default "m"

	Text: put the number between the tags.
-->
<script>
	import './badge.css';

	let { colour = 'error', size = 'm', children, class: extraClass = '' } = $props();
</script>

<span class="hb-badge hb-badge--{colour} hb-badge--{size} {extraClass}">
	{@render children?.()}
</span>
