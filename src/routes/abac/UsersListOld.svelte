<!--
	USERS, THE OLD DESIGN — deprecated, kept only to compare with the new one.

	Figma:  sbertech-habibi → page "abac-r5" → "user-list-q2-deprecated"

	What was different in Q2: a longer breadcrumb line, one filter tag per column
	instead of search + filters, the name cut into three columns, no status and
	no warnings. The filter tags here are drawn but do nothing.

	Use:
		<UsersListOld onopen={(user) => …} />

	Props:
		onopen   called with a user when their row is clicked
-->
<script>
	import { Table, TableToolbar, FilterChip, Skeleton, EmptyState, Notification } from '#lib';
	import { users, formatSync, sortRows } from './data.js';
	import { proto } from './prototype.svelte.js';
	import Breadcrumbs from './Breadcrumbs.svelte';

	let { onopen } = $props();

	const columns = [
		{ key: 'login', label: 'Login', width: '20%', sortable: true },
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'surname', label: 'Surname', sortable: true },
		{ key: 'patronymic', label: 'Patronymic', sortable: true },
		{ key: 'uid', label: 'ID' },
		{ key: 'lastSync', label: 'Last sync', width: 160, sortable: true, align: 'end' }
	];

	// The old table had the name in three columns: cut the full name into its words.
	const people = users.map((user) => {
		const [name, surname, patronymic] = user.fullName?.split(' ') ?? [];
		return { ...user, name, surname, patronymic };
	});

	let sortKey = $state('login');
	let sortDirection = $state('asc');
	let rows = $derived(sortRows(people, sortKey, sortDirection));

	const loadingRows = Array.from({ length: 12 }, (_, index) => ({ id: index, loading: true }));

	function sortBy(key) {
		sortDirection = key === sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
		sortKey = key;
	}
</script>

<div class="screen">
	<Notification type="warning">Deprecated Q2 screen — shown only for comparison.</Notification>

	<header class="head">
		<Breadcrumbs
			items={[
				{ label: 'tenant' },
				{ label: 'cyber-security-tenant', quiet: true },
				{ label: 'domain' },
				{ label: 'res-domain-144', quiet: true },
				{ label: 'Users', current: true }
			]}
		/>
		<h1 class="hb-text-h2">Users</h1>
	</header>

	{#if proto.data === 'error'}
		<div class="fill"><EmptyState type="error" /></div>
	{:else if proto.data === 'empty'}
		<div class="fill"><EmptyState type="empty" /></div>
	{:else}
		<TableToolbar>
			{#each columns as column}<FilterChip name={column.label} />{/each}
		</TableToolbar>

		<div class="card">
			<Table
				{columns}
				rows={proto.data === 'loading' ? loadingRows : rows}
				{sortKey}
				{sortDirection}
				onsort={sortBy}
				onrowclick={(user) => !user.loading && onopen?.(user)}
				minWidth={880}
				pageScroll
			>
				{#snippet cell(user, column)}
					{#if user.loading}
						<Skeleton width="70%" />
					{:else if column.key === 'lastSync' && user.lastSync}
						<span dir="ltr">{formatSync(user.lastSync).slice(0, 16)}</span>
					{:else}
						{#if user[column.key] == null}<span class="none">—</span>{:else}{user[column.key]}{/if}
					{/if}
				{/snippet}
			</Table>
		</div>
	{/if}
</div>

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
	.fill {
		flex: 1;
		display: grid;
		place-items: center;
	}
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
	/* The dash of an empty cell is pale. */
	.none {
		color: var(--uncolorful-grey-tertiary);
	}
</style>
