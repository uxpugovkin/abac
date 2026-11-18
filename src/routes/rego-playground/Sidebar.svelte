<!--
	SIDEBAR — the side menu of Flow Designer.
	Logo, the sections and the signed-in person.

	Figma:  sbertech-habibi → page "rego-playground" → "Sidebar"
	A local component of that file, not part of habibi-library — that is why it
	lives here, next to the prototype, and not in src/lib.

	Use:
		<Sidebar />

	Only "Files" is built in this prototype; the other sections are drawn but do nothing.
-->
<script>
	import { Icon, Avatar } from '#lib';
	import { photos } from '../ds/employees.js';
	import { proto } from './prototype.svelte.js';

	const sections = [
		{ label: 'Files', icon: 'folder', active: true },
		{ label: 'Context', icon: 'database' },
		{ label: 'Distributives', icon: 'view-grid' },
		{ label: 'Deploy', icon: 'archive-remove' },
		{ label: 'Settings', icon: 'tune' }
	];
</script>

<aside class="side">
	<div class="brand">
		<!-- The product logo, exported from Figma. It takes the text colour. -->
		<svg width="32" height="36" viewBox="0 0 32 36" fill="currentColor" aria-hidden="true">
			<path
				d="M16 6.53L13.16 9.37L2.84 4.84L5.67 2L16 6.53ZM29.16 4.84L18.84 9.37L16 6.53L26.33 2L29.16 4.84ZM27.47 18L24.63 15.16L29.16 4.84L32 7.67L27.47 18ZM29.16 31.16L24.63 20.84L27.47 18L32 28.33L29.16 31.16ZM16 29.47L26.33 34L29.16 31.16L18.84 26.63L16 29.47ZM2.84 31.16L5.67 34L16 29.47L13.16 26.63L2.84 31.16ZM4.53 18L7.37 20.84L2.84 31.16L0 28.33L4.53 18ZM4.53 18L7.37 15.16L2.84 4.84L0 7.67L4.53 18Z"
			/>
		</svg>
		<div>
			<div class="hb-text-body-a-bold brand__name">Flow Designer</div>
			<div class="hb-text-body-d brand__sub">Platform V</div>
		</div>
	</div>

	<nav aria-label="Sections">
		{#each sections as section}
			<div
				class="item hb-text-body-c"
				class:item--active={section.active}
				aria-current={section.active ? 'page' : undefined}
			>
				<Icon name={section.icon} size={20} />
				{section.label}
			</div>
		{/each}
	</nav>

	<div class="profile">
		<Avatar src={photos[6]} name="Tatiana Pirog" size="s" />
		<div>
			<div class="hb-text-body-d">Tatiana Pirog</div>
			<div class="hb-text-body-e profile__role">Super admin</div>
		</div>
		<Icon name={proto.rtl ? 'chevron-right' : 'chevron-left'} size={20} />
	</div>
</aside>

<style>
	.side {
		flex: none;
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 232px;
		padding: 8px 0 16px;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		color: var(--uncolorful-grey-extra);
	}
	.brand__name {
		margin-bottom: -4px; /* the two lines of the logo text sit close together, as in Figma */
		color: var(--uncolorful-grey-primary);
	}
	.brand__sub,
	.profile__role {
		color: var(--uncolorful-grey-tertiary);
	}
	nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 8px;
	}
	.item {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 36px;
		padding: 0 12px;
		border-radius: var(--radius-m);
	}
	.item--active {
		background: var(--boring-blue-90);
		color: var(--boring-blue-50);
	}
	.profile {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 20px;
		padding-top: 12px;
		border-top: 1px solid var(--uncolorful-grey-border);
	}
	.profile > div {
		flex: 1;
	}
</style>
