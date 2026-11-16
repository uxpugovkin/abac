<!--
	USER PAGE — everything ABAC knows about one user.

	Figma:  sbertech-habibi → page "abac-r5" → "domain-user-page" (2-1, three variants)
	        and, for the old design, "domain-user-page-q2-deprecated"

	Use:
		<UserPage {user} onback={…} onjson={…} />

	Props:
		user     one user from data.js
		onback   called when "Users" in the breadcrumbs is clicked
		onjson   called when the "JSON" button is clicked

	The page reads `proto` (the state panel):
		proto.data      ready · loading · empty · error  — what the attributes area shows
		proto.version   "new" = abac-r5;  "old" = the Q2 layout (other tabs, group switch)

	Some users are broken on purpose, as in Figma: a user whose domain attributes
	are not filled shows "Failed to load the user schema", whatever the state panel says.
-->
<script>
	import {
		Button,
		Tabs,
		Tag,
		TextInput,
		Segmented,
		Table,
		Skeleton,
		EmptyState,
		Notification
	} from '#lib';
	import { statuses, formatSync, attributeGroups, roles } from './data.js';
	import { proto, notify } from './prototype.svelte.js';
	import Breadcrumbs from './Breadcrumbs.svelte';

	let { user, onback, onjson } = $props();

	let old = $derived(proto.version === 'old');

	/* ---------- Tabs ---------- */

	const newTabs = [
		{ id: 'attributes', label: 'Domain attributes' },
		{ id: 'roles', label: 'Roles and privileges' },
		{ id: 'delegations', label: 'Delegations' }
	];
	const oldTabs = [
		{ id: 'attributes', label: 'Domain attributes' },
		{ id: 'incoming', label: 'Incoming delegations' },
		{ id: 'outgoing', label: 'Outgoing delegations' }
	];
	let tab = $state('attributes');

	// The two designs have different tabs: after a switch, start from the first one.
	$effect(() => {
		proto.version;
		tab = 'attributes';
	});

	/* ---------- Attributes: search (both designs) and the group switch (old design) ---------- */

	let query = $state('');
	let group = $state('All');
	const groupNames = ['All', ...attributeGroups.map((item) => item.title)];

	let groups = $derived.by(() => {
		const words = query.trim().toLowerCase();
		return attributeGroups
			.filter((item) => !old || group === 'All' || item.title === group)
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

	let crumbs = $derived(
		old
			? [
					{ label: 'tenant' },
					{ label: 'cyber-security-tenant', quiet: true },
					{ label: 'domain' },
					{ label: 'res-domain-144', quiet: true },
					{ label: 'Users', onclick: onback },
					{ label: user.fullName ?? user.login, current: true }
				]
			: [
					{ label: 'cyber-security-tenant' },
					{ label: 'res-domain-144', menu: true },
					{ label: 'Users', onclick: onback }
				]
	);

	function notBuilt(what) {
		notify(`${what} is not part of this prototype`);
	}
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
	{#if old}
		<Notification type="warning">Deprecated Q2 screen — shown only for comparison.</Notification>
	{/if}

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

			{#if old}
				<!-- The old design kept its actions here, next to the title. -->
				<span class="title__actions">
					<Button appearance="white" icon="brackets" label="JSON" onclick={onjson} />
					<Button
						appearance="white"
						icon="wait"
						label="Audit log"
						onclick={() => notBuilt('Audit log')}
					/>
					<Button
						appearance="white"
						icon="overflow"
						label="More"
						onclick={() => notBuilt('This menu')}
					/>
				</span>
			{/if}
		</div>

		<div class="hb-text-body-c ids">
			<span>{user.uid ? `ID${user.uid}` : 'No ID'}</span>
			<span class="ids__dot" aria-hidden="true">·</span>
			<span>{user.login}</span>
		</div>
	</header>

	{#if !old}
		<div class="bar">
			{@render search()}
			<span class="bar__end">
				<Button appearance="white" icon="brackets" onclick={onjson}>JSON</Button>
				<Button appearance="white" icon="wait" onclick={() => notBuilt('Audit log')}
					>Audit log</Button
				>
				<Button
					appearance="white"
					icon="overflow"
					label="More"
					onclick={() => notBuilt('This menu')}
				/>
			</span>
		</div>
	{/if}

	<Tabs tabs={old ? oldTabs : newTabs} bind:active={tab} />

	{#if tab === 'attributes'}
		{#if old}
			<div class="bar">
				<Segmented options={groupNames} bind:value={group} />
				<span class="bar__end">{@render search()}</span>
			</div>
		{/if}

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
		padding: 24px;
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
	.title__actions {
		display: flex;
		gap: 8px;
		margin-inline-start: auto;
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
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-surface);
		box-shadow: var(--shadow-default-s);
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
