<!--
	SIDEBAR — the side menu of the ABAC service.
	Logo, the current domain, the sections and the signed-in person.

	Figma:  sbertech-habibi → page "abac-r5" → "local-components" → "Sidebar"
	It is a local component of the ABAC file, not part of habibi-library —
	that is why it lives here, next to the prototype, and not in src/lib.

	Use:
		<Sidebar />

	Only "Users" is built in this prototype; the other sections are drawn but do nothing.
-->
<script>
	import { Icon, Avatar } from '#lib';
	import { photos } from '../ds/employees.js';
	import { proto } from './prototype.svelte.js';

	const sections = [
		{ label: 'Dashboard', icon: 'view-grid' },
		{ label: 'Users', icon: 'profile', active: true },
		{ label: 'Model', icon: 'script' },
		{ label: 'Task Manager', icon: 'wait' }
	];
</script>

<aside class="side">
	<div class="brand">
		<!-- The product logo, exported from Figma. It takes the text colour. -->
		<svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
			<path
				d="M16 4.53L13.16 7.37L2.84 2.84L5.67 0L16 4.53ZM29.16 2.84L18.84 7.37L16 4.53L26.33 0L29.16 2.84ZM27.47 16L24.63 13.16L29.16 2.84L32 5.67L27.47 16ZM29.16 29.16L24.63 18.84L27.47 16L32 26.33L29.16 29.16ZM16 27.47L26.33 32L29.16 29.16L18.84 24.63L16 27.47ZM2.84 29.16L5.67 32L16 27.47L13.16 24.63L2.84 29.16ZM4.53 16L7.37 18.84L2.84 29.16L0 26.33L4.53 16ZM4.53 16L7.37 13.16L2.84 2.84L0 5.67L4.53 16Z"
			/>
		</svg>
		<div>
			<div class="hb-text-body-a-bold brand__name">ABAC</div>
			<div class="hb-text-body-d brand__sub">Platform V</div>
		</div>
	</div>

	<div class="domain">
		<div>
			<div class="hb-text-body-d domain__label">Current domain</div>
			<div class="hb-text-body-c">res-domain-144</div>
		</div>
		<Icon name="chevron-down" size={20} />
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
		gap: 16px;
		width: 232px;
		padding: 16px 8px;
		background: var(--uncolorful-grey-surface);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 8px;
		color: var(--uncolorful-grey-extra);
	}
	.brand__name {
		margin-bottom: -4px; /* the two lines of the logo text sit close together, as in Figma */
	}
	.brand__sub,
	.profile__role {
		color: var(--uncolorful-grey-tertiary);
	}
	.domain {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 12px;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-border);
	}
	.domain__label {
		color: var(--uncolorful-grey-secondary);
	}
	nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.item {
		display: flex;
		align-items: center;
		gap: 8px;
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
		padding: 12px 8px 0;
		border-top: 1px solid var(--uncolorful-grey-border);
	}
	.profile > div {
		flex: 1;
	}
</style>
