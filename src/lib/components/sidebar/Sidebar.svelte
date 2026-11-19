<!--
	SIDEBAR
	The side menu of a product: logo and name, the sections, and the signed-in person.
	It can be collapsed to a narrow strip of icons: a click on the person does it.

	Figma:  habibi-library → "Sidebar" (Collapsed = False / True, RTL = False / True)

	Use:
		<script>
			let collapsed = $state(false);
			let section = $state('files');
		</script>

		<Sidebar
			title="Flow Designer"
			subtitle="Platform V"
			items={[
				{ id: 'files', label: 'Files', icon: 'folder' },
				{ id: 'settings', label: 'Settings', icon: 'tune' }
			]}
			active={section}
			onselect={(item) => (section = item.id)}
			name="Tatiana Pirog"
			role="Super admin"
			photo={tatianaPhoto}
			bind:collapsed
		/>

	Props:
		title       the product name
		subtitle    the small grey line under it
		items       the sections. Each one: { id, label, icon }
		active      the id of the section you are in (it is highlighted)
		onselect    called with the item when a section is clicked. Moving there is up to the page
		name        the signed-in person
		role        their role (shown in capitals)
		photo       their photo (optional; without it a profile icon is shown)
		collapsed   true = only icons, 56px wide. Use bind:collapsed — a click on the person
		            switches it

	Snippets (optional):
		logo        the product logo. Default: the habibi mark
		select      something under the header, e.g. a "Current domain" box. Hidden while collapsed

	While collapsed, each section shows its name when the mouse is over it.
	On right-to-left pages the arrow by the person points the other way by itself.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './sidebar.css';

	let {
		title = '',
		subtitle = '',
		items = [],
		active = '',
		onselect,
		name = '',
		role = '',
		photo = '',
		collapsed = $bindable(false),
		logo,
		select,
		class: extraClass = ''
	} = $props();
</script>

<aside class="hb-sidebar {extraClass}" class:hb-sidebar--collapsed={collapsed}>
	<div class="hb-sidebar__header">
		<div class="hb-sidebar__logo">
			{#if logo}
				{@render logo()}
			{:else}
				<!-- The default product logo, exported from Figma. It takes the text colour. -->
				<svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
					<path
						d="M16 4.53L13.16 7.37L2.84 2.84L5.67 0L16 4.53ZM29.16 2.84L18.84 7.37L16 4.53L26.33 0L29.16 2.84ZM27.47 16L24.63 13.16L29.16 2.84L32 5.67L27.47 16ZM29.16 29.16L24.63 18.84L27.47 16L32 26.33L29.16 29.16ZM16 27.47L26.33 32L29.16 29.16L18.84 24.63L16 27.47ZM2.84 29.16L5.67 32L16 27.47L13.16 24.63L2.84 29.16ZM4.53 16L7.37 18.84L2.84 29.16L0 26.33L4.53 16ZM4.53 16L7.37 13.16L2.84 2.84L0 5.67L4.53 16Z"
					/>
				</svg>
			{/if}
		</div>
		{#if !collapsed}
			<div class="hb-sidebar__titles">
				<span class="hb-sidebar__title">{title}</span>
				<span class="hb-sidebar__subtitle">{subtitle}</span>
			</div>
		{/if}
	</div>

	<div class="hb-sidebar__menu">
		{#if select && !collapsed}{@render select()}{/if}

		<nav class="hb-sidebar__items" aria-label={title}>
			{#each items as item (item.id)}
				<button
					class="hb-sidebar__item"
					class:hb-sidebar__item--active={item.id === active}
					type="button"
					aria-current={item.id === active ? 'page' : undefined}
					aria-label={collapsed ? item.label : undefined}
					title={collapsed ? item.label : undefined}
					onclick={() => onselect?.(item)}
				>
					<span class="hb-sidebar__icon"><Icon name={item.icon} size={20} /></span>
					{#if !collapsed}<span>{item.label}</span>{/if}
				</button>
			{/each}
		</nav>
	</div>

	<div class="hb-sidebar__divider"></div>

	<!-- The person. A click collapses or expands the menu. -->
	<button
		class="hb-sidebar__person"
		type="button"
		aria-expanded={!collapsed}
		aria-label={collapsed ? 'Expand the menu' : 'Collapse the menu'}
		title={collapsed ? name : undefined}
		onclick={() => (collapsed = !collapsed)}
	>
		{#if photo}
			<img class="hb-sidebar__photo" src={photo} alt="" />
		{:else}
			<span class="hb-sidebar__photo"><Icon name="profile" size={20} /></span>
		{/if}
		{#if !collapsed}
			<span class="hb-sidebar__who">
				<span class="hb-sidebar__name">{name}</span>
				<span class="hb-sidebar__role">{role}</span>
			</span>
		{/if}
		<span class="hb-sidebar__arrow">
			<Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={20} />
		</span>
	</button>
</aside>
