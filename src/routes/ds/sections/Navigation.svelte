<!-- DOCS: Tabs, Chip, Segmented, FilterChip, Menu, Tree. -->
<script>
	import { Tabs, Chip, Segmented, FilterChip, Menu, MenuItem, Tree } from '#lib';
	import Demo from '../Demo.svelte';

	let tab = $state('attributes');
	let mine = $state(true);
	let locked = $state(false);
	let view = $state('read');
	let status = $state('Active');
	let sort = $state('name');
	let node = $state('users');
</script>

<Demo title="Tabs" figma="tabs" about="Switch between views that live in the same place.">
	<Tabs
		bind:active={tab}
		tabs={[
			{ id: 'attributes', label: 'Domain attributes' },
			{ id: 'roles', label: 'Roles and privileges' },
			{ id: 'delegations', label: 'Delegations', icon: 'share' },
			{ id: 'audit', label: 'Audit', disabled: true }
		]}
	/>
</Demo>

<Demo title="Chip" figma="chips → scope" about="A pill that can be switched on and off.">
	<Chip bind:active={mine}>Mine</Chip>
	<Chip bind:active={locked} icon="lock">Locked</Chip>
	<Chip disabled>Disabled</Chip>
</Demo>

<Demo
	title="Segmented"
	figma="chips → segment-group"
	about="Exactly one of a few options is chosen."
>
	<Segmented
		bind:value={view}
		options={[
			{ value: 'read', label: 'Read', icon: 'visibility-on' },
			{ value: 'compare', label: 'Comparison', icon: 'arrows' },
			{ value: 'history', label: 'History', icon: 'wait' }
		]}
	/>
	<Segmented value="Week" options={['Day', 'Week', 'Month']} disabled />
</Demo>

<Demo
	title="FilterChip"
	figma="chips → filter-tag"
	about="Opens a filter. Turns blue and shows the value once something is chosen."
>
	<FilterChip
		name="Status"
		value={status}
		onclick={() => (status = 'Active')}
		onclear={() => (status = '')}
	/>
	<FilterChip name="Last sync" />
	<FilterChip name="Disabled" disabled />
</Demo>

<Demo
	title="Menu"
	figma="Drop List"
	about="A floating list of choices. Menu draws the card; the page decides when to show it."
>
	<Menu label="Actions">
		<MenuItem icon="edit">Rename</MenuItem>
		<MenuItem icon="duplicate">Duplicate</MenuItem>
		<MenuItem icon="archive" disabled>Archive</MenuItem>
		<div class="hb-menu__heading">Sort by</div>
		<MenuItem checked={sort === 'name'} onclick={() => (sort = 'name')}>Name</MenuItem>
		<MenuItem checked={sort === 'date'} onclick={() => (sort = 'date')}>Last sync</MenuItem>
	</Menu>
	<Menu label="Profile">
		<MenuItem icon="profile" label="Signed in as" subtitle="Super admin">Tatiana Pirog</MenuItem>
		<MenuItem icon="settings">Settings</MenuItem>
	</Menu>
</Demo>

<Demo title="Tree" figma="Tree" about="Levels that open and close, like folders.">
	<div class="tree">
		<Tree
			bind:selected={node}
			nodes={[
				{
					id: 'tenant',
					label: 'cyber-security-tenant',
					open: true,
					children: [
						{
							id: 'd144',
							label: 'res-domain-144',
							open: true,
							children: [
								{ id: 'users', label: 'Users' },
								{ id: 'model', label: 'Model' }
							]
						},
						{ id: 'd145', label: 'res-domain-145', children: [{ id: 'users2', label: 'Users' }] },
						{ id: 'd146', label: 'res-domain-146' }
					]
				}
			]}
		/>
	</div>
</Demo>

<style>
	.tree {
		width: 240px;
	}
</style>
