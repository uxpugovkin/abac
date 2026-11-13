<!--
	APP FRAME — a helper used only by the table guidelines page.
	A small fake application window: a side menu on one side, a page on the other.
	It gives the "Button placement" examples something to sit in.

	The side menu here is only a drawing for the examples. It is not a design
	system component (in Figma it belongs to the ABAC service file).

	Use:
		<AppFrame>
			…the page: title, tabs, toolbar, table…
		</AppFrame>
-->
<script>
	import { Icon, Avatar } from '#lib';
	import { photos } from '../employees.js';

	let { children } = $props();

	const menu = [
		{ label: 'Dashboard', icon: 'view-grid' },
		{ label: 'Users', icon: 'profile', active: true },
		{ label: 'Model', icon: 'script' },
		{ label: 'Task Manager', icon: 'wait' }
	];
</script>

<div class="app">
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
				<div class="hb-text-body-d">Platform V</div>
			</div>
		</div>

		<div class="domain">
			<div>
				<div class="hb-text-body-d">Current domain</div>
				<div class="hb-text-body-c">res-domain-144</div>
			</div>
			<Icon name="chevron-down" size={20} />
		</div>

		<nav>
			{#each menu as item}
				<div class="item hb-text-body-c" class:item--active={item.active}>
					<Icon name={item.icon} size={20} />
					{item.label}
				</div>
			{/each}
		</nav>

		<div class="profile">
			<Avatar src={photos[6]} name="Tatiana Pirog" size="s" />
			<div>
				<div class="hb-text-body-d">Tatiana Pirog</div>
				<div class="hb-text-body-e">Super admin</div>
			</div>
			<Icon name="chevron-left" size={20} />
		</div>
	</aside>

	<div class="page">{@render children()}</div>
</div>

<style>
	.brand__name {
		margin-bottom: -4px; /* the two lines of the logo text sit close together, as in Figma */
	}
	/* The whole app window — side menu AND page — is one white box.
	   (The bordered card around it comes from the guidelines page; its 16px of
	   padding is cancelled here so the app fills the card edge to edge.) */
	.app {
		display: flex;
		margin: -16px;
		background: var(--uncolorful-grey-surface);
	}

	/* ---------- Side menu ---------- */
	.side {
		flex: none;
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 232px;
		padding: 16px 8px;
		border-inline-end: 1px solid var(--uncolorful-grey-border);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 8px;
		color: var(--uncolorful-grey-extra);
	}
	.brand .hb-text-body-d,
	.profile .hb-text-body-e {
		color: var(--uncolorful-grey-tertiary);
	}
	.domain .hb-text-body-d {
		color: var(--uncolorful-grey-secondary);
	}
	.domain {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 12px;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-border);
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

	/* ---------- The page next to it ---------- */
	.page {
		flex: 1;
		min-width: 0;
		padding: 24px 24px 0;
	}
</style>
