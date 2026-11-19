<!--
	USER PAGE — everything ABAC knows about one user.

	Figma:  sbertech-habibi → page "abac-r5" → "domain-user-page" (2-1, three variants)

	Use:
		<UserPage {user} onback={…} onjson={…} onhistory={…} />

	Props:
		user     one user from data.js
		onback   called when "Users" in the breadcrumbs is clicked
		onjson   called when the "JSON" button is clicked
		onhistory   called when the "Audit log" button is clicked

	The page reads `proto.data` (the state panel): ready · loading · empty · error —
	what the attributes area shows.

	Some users are broken on purpose, as in Figma: a user whose domain attributes
	are not filled shows "Failed to load the user schema", whatever the state panel says.
-->
<script>
	import { Button, Tabs, Tag, TextInput, Table, Skeleton, EmptyState } from '#lib';
	import { statuses, formatSync, attributeGroups, roles } from './data.js';
	import { proto, notBuilt } from './prototype.svelte.js';
	import Breadcrumbs from './Breadcrumbs.svelte';

	let { user, onback, onjson, onhistory } = $props();

	/* ---------- Tabs ---------- */

	const tabs = [
		{ id: 'attributes', label: 'Domain attributes' },
		{ id: 'roles', label: 'Roles and privileges' },
		{ id: 'delegations', label: 'Delegations' }
	];
	let tab = $state('attributes');

	/* ---------- Attributes: the search narrows the groups to the matching rows ---------- */

	let query = $state('');

	let groups = $derived.by(() => {
		const words = query.trim().toLowerCase();
		return attributeGroups
			.map((item) => ({
				...item,
				rows: item.rows.filter((row) => row.some((text) => text.toLowerCase().includes(words)))
			}))
			.filter((item) => item.rows.length);
	});

	// What the attributes area shows.
	let view = $derived(
		proto.data === 'loading'
			? 'loading'
			: proto.data === 'error' || user.domainAttrs !== 'filled'
				? 'failed'
				: proto.data
	);

	const roleColumns = [
		{ key: 'role', label: 'Role', width: '20%' },
		{ key: 'scope', label: 'Scope' },
		{ key: 'grantedBy', label: 'Granted by' },
		{ key: 'validUntil', label: 'Valid until', width: 140 }
	];

	let crumbs = $derived([
		{ label: 'cyber-security-tenant' },
		{ label: 'res-domain-144', domains: true },
		{ label: 'Users', onclick: onback }
	]);
</script>

{#snippet search()}
	<div class="search">
		<TextInput
			icon="search"
			placeholder="Search attributes"
			aria-label="Search attributes"
			bind:value={query}
		/>
	</div>
{/snippet}

<div class="screen">
	<header class="head">
		<Breadcrumbs items={crumbs} />

		<div class="title">
			<h1 class="hb-text-h2">{user.fullName ?? 'No full name'}</h1>

			<!-- The tags say what state the user is in. Red ones are problems. -->
			{#if user.status === 'blocked'}
				<Tag colour="error" icon="lock">Blocked</Tag>
			{:else if user.status}
				<Tag colour={statuses[user.status].colour}>{statuses[user.status].label}</Tag>
			{/if}
			{#if user.stale}
				<Tag colour="error" icon="warning">Last sync 72h ago</Tag>
			{:else if user.lastSync}
				<Tag>Last sync {formatSync(user.lastSync, true)}</Tag>
			{/if}
			{#if user.domainAttrs === 'empty'}<Tag colour="error" icon="warning">Domain attributes</Tag
				>{/if}
			{#if user.baseAttrs === 'empty'}<Tag colour="error" icon="warning">Base attributes</Tag>{/if}
		</div>

		<div class="hb-text-body-c ids">
			<span>{user.uid ? `ID${user.uid}` : 'No ID'}</span>
			<span class="ids__dot" aria-hidden="true">·</span>
			<span>{user.login}</span>
		</div>
	</header>

	<div class="bar">
		{@render search()}
		<span class="bar__end">
			<Button icon="brackets" onclick={onjson}>JSON</Button>
			<Button icon="wait" onclick={onhistory}>Audit log</Button>
			<Button icon="overflow" label="More" onclick={() => notBuilt('This menu')} />
		</span>
	</div>

	<Tabs {tabs} bind:active={tab} />

	{#if tab === 'attributes'}
		{#if view === 'loading'}
			<section class="card" aria-busy="true">
				<Skeleton width={160} />
				{#each { length: 8 } as _}
					<div class="row">
						<Skeleton width={120} />
						<Skeleton width="45%" />
					</div>
				{/each}
			</section>
		{:else if view === 'failed'}
			<div class="fill">
				<EmptyState
					type="maintenance"
					title="Failed to load the user schema"
					description="The attributes of this user cannot be shown until the schema loads."
				/>
			</div>
		{:else if view === 'empty'}
			<div class="fill">
				<EmptyState
					type="empty"
					title="No attributes yet"
					description="Attributes will appear here after the first sync of this domain."
				/>
			</div>
		{:else if groups.length === 0}
			<div class="fill">
				<EmptyState
					type="not-found"
					title="No matching attributes"
					description="Try another word, or clear the search."
				>
					<Button appearance="accent" mode="primary" onclick={() => (query = '')}
						>Clear search</Button
					>
				</EmptyState>
			</div>
		{:else}
			{#each groups as item (item.title)}
				<section class="card">
					<h2 class="hb-text-body-a">{item.title}</h2>
					<dl>
						{#each item.rows as [name, value]}
							<div class="row hb-text-body-c">
								<dt>{name}</dt>
								<dd>{value}</dd>
							</div>
						{/each}
					</dl>
				</section>
			{/each}
		{/if}
	{:else if tab === 'roles' && proto.data === 'ready'}
		<section class="card card--table">
			<Table columns={roleColumns} rows={roles}>
				{#snippet cell(row, column)}
					{#if column.key === 'role'}<Tag size="s">{row.role}</Tag>{:else}{row[column.key]}{/if}
				{/snippet}
			</Table>
		</section>
	{:else if proto.data === 'loading'}
		<section class="card" aria-busy="true">
			{#each { length: 4 } as _}<div class="row"><Skeleton width="60%" /></div>{/each}
		</section>
	{:else if proto.data === 'error'}
		<div class="fill"><EmptyState type="error" /></div>
	{:else}
		<div class="fill">
			<EmptyState
				type="empty"
				title={tab === 'roles' ? 'No roles yet' : 'No delegations yet'}
				description={tab === 'roles'
					? 'Roles granted in this domain will show up here.'
					: 'Rights passed to or from this user will show up here.'}
			/>
		</div>
	{/if}
</div>

<style>
	.screen {
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-height: 100%;
		padding-block: 24px;
		padding-inline: 24px var(--screen-end, 24px); /* start, end: follows right-to-left */
	}
	.head {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.title h1 {
		margin: 0;
	}
	.ids {
		display: flex;
		gap: 8px;
	}
	.ids__dot {
		color: var(--uncolorful-grey-tertiary);
	}

	/* One line: something at the start, buttons (or the search) at the end. */
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.bar__end {
		display: flex;
		gap: 8px;
		margin-inline-start: auto;
	}
	.search {
		width: 256px;
	}

	.fill {
		flex: 1;
		display: grid;
		place-items: center;
	}

	/* A white card with one group of attributes. */
	.card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 12px;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	.card--table {
		padding: 0 0 8px;
	}
	.card h2,
	.card dl,
	.card dd {
		margin: 0;
	}
	.card dl {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.row {
		display: flex;
		gap: 16px;
		min-height: 20px;
		align-items: center;
	}
	.row dt {
		flex: none;
		width: 184px;
		color: var(--uncolorful-grey-tertiary);
	}
</style>
