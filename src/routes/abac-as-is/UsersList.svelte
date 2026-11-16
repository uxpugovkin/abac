<!--
	USERS — the list of the users of one domain (the NEW design).

	Figma:  sbertech-habibi → page "abac-r5" → "domain-user-list"
	        1-1 default · 1-2 empty · 1-3 filtered · 1-4 no-results
	Rules:  the table follows src/lib/components/table/guidelines.js
	        (sorted by one column, filter tags, "Search" for a many-column search,
	        row actions on hover in their own column).

	Use:
		<UsersList onopen={(user) => …} onjson={(user) => …} />

	Props:
		onopen   called with a user when their row is clicked
		onjson   called with a user when "View JSON" is picked in the row's menu

	What it shows depends on `proto.data` (the state panel):
		ready     the table            loading   grey bars instead of the texts
		empty     "No users yet"       error     "Something went wrong" + Try again
-->
<script>
	import {
		Table,
		TableToolbar,
		Button,
		SearchChip,
		FilterChip,
		Switch,
		Menu,
		MenuItem,
		Checkbox,
		Tag,
		Skeleton,
		EmptyState
	} from '#lib';
	import { users, statuses, formatSync, hasWarning, sortRows } from './data.js';
	import { proto, notify } from './prototype.svelte.js';
	import Breadcrumbs from './Breadcrumbs.svelte';

	let { onopen, onjson } = $props();

	const columns = [
		{ key: 'login', label: 'Login', width: 176, sortable: true },
		{ key: 'fullName', label: 'Full Name', sortable: true },
		{ key: 'uid', label: 'UID', width: 120 },
		{ key: 'status', label: 'Status', width: 120, sortable: true },
		{ key: 'domainAttrs', label: 'Domain attributes', width: 144 },
		{ key: 'baseAttrs', label: 'Base attributes', width: 144 },
		{ key: 'lastSync', label: 'Last sync', width: 160, sortable: true }
	];

	/* The filters. `options` are [value, text] pairs; `test` says if a user passes. */
	const filters = [
		{
			id: 'status',
			name: 'Status',
			options: Object.entries(statuses).map(([value, status]) => [value, status.label]),
			test: (user, value) => user.status === value
		},
		{
			id: 'sync',
			name: 'Last sync',
			options: [
				['2026-08-15', '15.08.2026'],
				['2026-08-14', '14.08.2026'],
				['stale', '72h ago']
			],
			test: (user, value) => (value === 'stale' ? user.stale : user.lastSync?.startsWith(value))
		},
		{
			id: 'domainAttrs',
			name: 'Domain attributes',
			options: [
				['filled', 'Filled'],
				['empty', 'Empty']
			],
			test: (user, value) => user.domainAttrs === value
		},
		{
			id: 'baseAttrs',
			name: 'Base attributes',
			options: [
				['filled', 'Filled'],
				['empty', 'Empty']
			],
			test: (user, value) => user.baseAttrs === value
		}
	];

	/* ---------- What this screen remembers ---------- */

	let query = $state('');
	let shown = $state(['status', 'sync']); // which filter tags are in the toolbar (guidelines 3.5)
	let chosen = $state({}); // the picked values: { status: 'active', … }
	let warningsOnly = $state(false);
	let sortKey = $state('login');
	let sortDirection = $state('asc');
	let openMenu = $state(''); // which list is open: 'all-filters', a filter id, or '' for none
	let rowMenu = $state(null); // the open menu of one row: { user, top, end }

	/* ---------- Rows: the page filters and sorts, the Table only shows ---------- */

	let filtering = $derived(Boolean(query || warningsOnly || Object.keys(chosen).length));

	let rows = $derived.by(() => {
		const words = query.trim().toLowerCase();
		const matching = users.filter(
			(user) =>
				(!words ||
					[user.login, user.fullName, user.uid].some((text) =>
						text?.toLowerCase().includes(words)
					)) &&
				(!warningsOnly || hasWarning(user)) &&
				filters.every((filter) => !chosen[filter.id] || filter.test(user, chosen[filter.id]))
		);
		return sortRows(matching, sortKey, sortDirection);
	});

	// While loading, the table shows a dozen rows of grey bars.
	const loadingRows = Array.from({ length: 12 }, (_, index) => ({ id: index, loading: true }));

	function sortBy(key) {
		// Clicking the same column again flips the direction.
		sortDirection = key === sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
		sortKey = key;
	}

	function clearFilters() {
		query = '';
		chosen = {};
		warningsOnly = false;
	}

	function choose(id, value) {
		chosen = { ...chosen, [id]: value };
		openMenu = '';
	}
	function unchoose(id) {
		chosen = Object.fromEntries(Object.entries(chosen).filter(([other]) => other !== id));
	}

	// Tick or untick a filter in the "all filters" list: its tag appears in, or leaves, the toolbar.
	function toggleShown(id) {
		if (shown.includes(id)) {
			shown = shown.filter((other) => other !== id);
			unchoose(id); // a filter that is not shown must not keep filtering
		} else {
			shown = filters
				.map((filter) => filter.id)
				.filter((other) => shown.includes(other) || other === id);
		}
	}

	// Opens one list and closes the others. (stopPropagation: the window handler
	// below must not close what was just opened.)
	function toggleMenu(event, id) {
		event.stopPropagation();
		rowMenu = null;
		openMenu = openMenu === id ? '' : id;
	}

	// The menu of one row opens right under its "⋮" button.
	function openRowMenu(event, user) {
		event.stopPropagation();
		openMenu = '';
		const button = event.currentTarget.getBoundingClientRect();
		rowMenu = {
			user,
			top: button.bottom + 4,
			end: proto.rtl ? button.left : window.innerWidth - button.right
		};
	}

	function textOf(filter) {
		return filter.options.find(([value]) => value === chosen[filter.id])?.[1] ?? '';
	}
</script>

<!-- Clicking anywhere else closes every open list. -->
<svelte:window
	onclick={() => {
		openMenu = '';
		rowMenu = null;
	}}
/>

<div class="screen">
	<header class="head">
		<Breadcrumbs
			items={[{ label: 'cyber-security-tenant' }, { label: 'res-domain-144', domains: true }]}
		/>
		<h1 class="hb-text-h2">Users</h1>
	</header>

	{#if proto.data === 'error'}
		<div class="fill">
			<EmptyState
				type="error"
				title="Couldn't load users"
				description="The domain did not answer. Check your connection and try again."
			>
				<Button
					appearance="accent"
					mode="primary"
					icon="refresh"
					onclick={() => (proto.data = 'ready')}>Try again</Button
				>
			</EmptyState>
		</div>
	{:else if proto.data === 'empty'}
		<!-- Figma 1-2: no toolbar and no table, only the message. -->
		<div class="fill">
			<EmptyState
				type="not-found"
				title="No users yet"
				description="Users will appear here once they've been assigned to this domain"
			/>
		</div>
	{:else}
		<TableToolbar>
			<SearchChip bind:value={query} />

			<!-- "All filters": a list where filter tags can be switched on and off. -->
			<span class="anchor">
				<Button icon="tune" label="Filters" onclick={(event) => toggleMenu(event, 'all-filters')} />
				{#if openMenu === 'all-filters'}
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div
						class="anchor__menu anchor__menu--checks"
						onclick={(event) => event.stopPropagation()}
					>
						<Menu label="Filters to show">
							{#each filters as filter}
								<Checkbox
									checked={shown.includes(filter.id)}
									onchange={() => toggleShown(filter.id)}>{filter.name}</Checkbox
								>
							{/each}
						</Menu>
					</div>
				{/if}
			</span>

			{#each filters.filter((filter) => shown.includes(filter.id)) as filter (filter.id)}
				<span class="anchor">
					<FilterChip
						name={filter.name}
						value={textOf(filter)}
						onclick={(event) => toggleMenu(event, filter.id)}
						onclear={() => unchoose(filter.id)}
					/>
					{#if openMenu === filter.id}
						<div class="anchor__menu">
							<Menu label={filter.name}>
								{#each filter.options as [value, text]}
									<MenuItem
										checked={chosen[filter.id] === value}
										onclick={() => choose(filter.id, value)}>{text}</MenuItem
									>
								{/each}
							</Menu>
						</div>
					{/if}
				</span>
			{/each}

			<span class="warnings"><Switch bind:checked={warningsOnly}>Warnings only</Switch></span>

			{#snippet end()}
				<Button icon="upload" onclick={() => notify('Import is not part of this prototype')}
					>Import</Button
				>
				<Button icon="download" onclick={() => notify(`Exported ${rows.length} users`, 'success')}
					>Export</Button
				>
			{/snippet}
		</TableToolbar>

		{#if proto.data === 'ready' && rows.length === 0}
			<!-- Figma 1-4: the filters left nothing. -->
			<div class="fill">
				<EmptyState
					type="not-found"
					title="No matching users"
					description="Try adjusting or clearing filters to see more"
				>
					<Button appearance="accent" mode="primary" onclick={clearFilters}>Clear filters</Button>
				</EmptyState>
			</div>
		{:else}
			<div class="card">
				<Table
					{columns}
					rows={proto.data === 'loading' ? loadingRows : rows}
					{sortKey}
					{sortDirection}
					onsort={sortBy}
					onrowclick={(user) => !user.loading && onopen?.(user)}
					actions={proto.data === 'loading' ? undefined : rowActions}
					actionsWidth={46}
					minWidth={960}
					pageScroll
				>
					{#snippet cell(user, column)}
						{#if user.loading}
							<Skeleton width={column.key === 'fullName' ? '50%' : '70%'} />
						{:else if column.key === 'status' && user.status}
							<!-- Statuses have a round marker; "Inactive" is an outline (not filled). -->
							<Tag
								colour={statuses[user.status].colour}
								size="xs"
								shape="circle"
								outline={user.status === 'inactive'}
								disabled={user.status === 'inactive'}>{statuses[user.status].label}</Tag
							>
						{:else if (column.key === 'domainAttrs' || column.key === 'baseAttrs') && user[column.key]}
							{#if user[column.key] === 'empty'}
								<Tag colour="error" size="xs">Empty</Tag>
							{:else}
								Filled
							{/if}
						{:else if column.key === 'lastSync' && user.stale}
							<Tag colour="error" size="xs">72h ago</Tag>
						{:else if column.key === 'lastSync' && user.lastSync}
							<!-- A date reads left to right, also on a right-to-left page. -->
							<span dir="ltr">{formatSync(user.lastSync)}</span>
						{:else}
							{#if user[column.key] == null}<span class="none">—</span>{:else}{user[
									column.key
								]}{/if}
						{/if}
					{/snippet}
				</Table>
			</div>
		{/if}
	{/if}
</div>

<!-- The "⋮" button of one row (shown on hover, guidelines 5.1). -->
{#snippet rowActions(user)}
	<Button
		mode="ghost"
		icon="overflow"
		label="Actions for {user.login}"
		onclick={(event) => openRowMenu(event, user)}
	/>
{/snippet}

{#if rowMenu}
	<div class="row-menu" style:top="{rowMenu.top}px" style:inset-inline-end="{rowMenu.end}px">
		<Menu label="Actions for {rowMenu.user.login}">
			<MenuItem icon="profile" onclick={() => onopen?.(rowMenu.user)}>Open user</MenuItem>
			<MenuItem icon="brackets" onclick={() => onjson?.(rowMenu.user)}>View JSON</MenuItem>
			<MenuItem
				icon="duplicate"
				onclick={() => {
					navigator.clipboard?.writeText(rowMenu.user.login);
					notify('Login copied', 'success');
				}}>Copy login</MenuItem
			>
		</Menu>
	</div>
{/if}

<style>
	.screen {
		display: flex;
		flex-direction: column;
		gap: 12px; /* toolbar and table sit 12px apart, as in the table guide */
		min-height: 100%;
		padding-block: 24px;
		padding-inline: 24px var(--screen-end, 24px); /* start, end: follows right-to-left */
	}
	.head {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.head h1 {
		margin: 0;
	}
	/* Takes the room that is left and puts its message in the middle. */
	.fill {
		flex: 1;
		display: grid;
		place-items: center;
	}
	/* The white card the table lies on. */
	.card {
		padding: 0 0 8px;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	.card :global(th:first-child) {
		border-start-start-radius: var(--radius-m);
	}
	.card :global(th:last-child) {
		border-start-end-radius: var(--radius-m);
	}

	/* A button or a filter tag, with its list opening right under it. */
	.anchor {
		position: relative;
		display: inline-flex;
	}
	.anchor__menu {
		position: absolute;
		top: calc(100% + 4px);
		inset-inline-start: 0;
		z-index: 10;
		min-width: 160px;
	}
	/* Checkbox rows inside a list get a little room at the sides. */
	.anchor__menu--checks :global(.hb-check) {
		margin: 0 4px;
		padding-inline-end: 12px;
		white-space: nowrap;
	}
	.warnings {
		margin-inline-start: 12px;
	}
	/* The dash of an empty cell is pale. */
	.none {
		color: var(--uncolorful-grey-tertiary);
	}
	.row-menu {
		position: fixed;
		z-index: 30;
		min-width: 160px;
	}
</style>
