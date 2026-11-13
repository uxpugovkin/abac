<!--
	AVATAR
	A round picture of a person. Shows a grey placeholder when there is no photo.

	Figma:  habibi-library → page "avatar"

	Use:
		<Avatar src="/photos/tatiana.jpg" name="Tatiana Pirog" />
		<Avatar name="Brenda Cooper" size="s" />          ← no photo: placeholder icon

		Several overlapping avatars (Figma "avatar-stack"):
		<div class="hb-avatar-stack">
			<Avatar name="Anna" />
			<Avatar name="Boris" />
		</div>

	Props:
		src    address of the photo. Empty = placeholder
		name   the person's name (read by screen readers, shown as a tooltip)
		size   "m" (40px) | "s" (32px) | "xs" (24px).  Default "m"
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './avatar.css';

	let { src = '', name = '', size = 'm', class: extraClass = '' } = $props();
</script>

<span class="hb-avatar hb-avatar--{size} {extraClass}" title={name || undefined}>
	{#if src}
		<img {src} alt={name} />
	{:else}
		<Icon name="profile" size={size === 'xs' ? 16 : 24} label={name} />
	{/if}
</span>
