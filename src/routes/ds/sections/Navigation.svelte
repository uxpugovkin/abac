<!-- DOCS: Tabs, Chip, Segmented, FilterChip, Menu, Tree. -->
<script>
	import { Tabs, Chip, Segmented, FilterChip, SearchChip, Menu, MenuItem, Tree } from '#lib';
	import Demo from '../Demo.svelte';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	const t = pick(content.navigation); // the example texts, in the current language

	let tab = $state('attributes');
	let mine = $state(true);
	let locked = $state(false);
	let view = $state('read');
	let statusOn = $state(true); // is the Status filter set?
	let query = $state('');
	let sort = $state('name');
	let node = $state('users');

	// The domain ids (res-domain-144…) are the same in every language.
	const tree = [
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
						{ id: 'users', label: t.users },
						{ id: 'model', label: t.model }
					]
				},
				{
					id: 'd145',
					label: 'res-domain-145',
					open: true,
					children: [
						{
							id: 'users2',
							label: t.users,
							open: true,
							children: [
								{ id: 'admins', label: t.admins },
								{ id: 'guests', label: t.guests }
							]
						},
						{ id: 'model2', label: t.model }
					]
				},
				{ id: 'd146', label: 'res-domain-146', children: [{ id: 'users3', label: t.users }] },
				{ id: 'd147', label: 'res-domain-147', children: [] }
			]
		}
	];
</script>

<Demo title="Tabs" figma="tabs" about="Switch between views that live in the same place.">
	<Tabs bind:active={tab} tabs={t.tabs} />
</Demo>

<Demo title="Chip" figma="chips → scope" about="A pill that can be switched on and off.">
	<Chip bind:active={mine}>{t.mine}</Chip>
	<Chip bind:active={locked} icon="lock">{t.locked}</Chip>
	<Chip disabled>{t.disabled}</Chip>
</Demo>

<Demo
	title="Segmented"
	figma="chips → segment-group"
	about="Exactly one of a few options is chosen."
>
	<Segmented bind:value={view} options={t.views} />
	<Segmented value="week" options={t.periods} disabled />
</Demo>

<Demo
	title="FilterChip"
	figma="chips → filter-tag"
	about="Opens a filter. Turns blue and shows the value once something is chosen."
>
	<FilterChip
		name={t.status}
		value={statusOn ? t.active : ''}
		onclick={() => (statusOn = true)}
		onclear={() => (statusOn = false)}
		clearLabel={t.clear}
	/>
	<FilterChip name={t.lastSync} />
	<FilterChip name={t.disabled} disabled />
</Demo>

<Demo
	title="SearchChip"
	figma="Tables Guide → Search and filter"
	about="The search of a table toolbar: a small button, then a box to type in, then a blue chip. Click it, type, press Enter."
>
	<SearchChip bind:value={query} placeholder={t.search} clearLabel={t.clearSearch} />
	<SearchChip value={t.cooper} placeholder={t.searchByName} clearLabel={t.clearSearch} />
	<span class="hb-text-body-c">{t.searchingFor} {query || t.nothingYet}</span>
</Demo>

<Demo
	title="Menu"
	figma="Drop List"
	about="A floating list of choices. Menu draws the card; the page decides when to show it."
>
	<Menu label={t.actions}>
		<MenuItem icon="edit">{t.rename}</MenuItem>
		<MenuItem icon="duplicate">{t.duplicate}</MenuItem>
		<MenuItem icon="archive" disabled>{t.archive}</MenuItem>
		<div class="hb-menu__heading">{t.sortBy}</div>
		<MenuItem checked={sort === 'name'} onclick={() => (sort = 'name')}>{t.name}</MenuItem>
		<MenuItem checked={sort === 'date'} onclick={() => (sort = 'date')}>{t.lastSync}</MenuItem>
	</Menu>
	<Menu label={t.profile}>
		<MenuItem icon="profile" label={t.signedInAs} subtitle={t.superAdmin}>{t.tatiana}</MenuItem>
		<MenuItem icon="settings">{t.settings}</MenuItem>
	</Menu>
</Demo>

<Demo title="Tree" figma="Tree" about="Folders open and close; a file can be selected.">
	<div class="tree">
		<Tree bind:selected={node} nodes={tree} />
	</div>
</Demo>

<style>
	.tree {
		width: 240px;
	}
</style>
