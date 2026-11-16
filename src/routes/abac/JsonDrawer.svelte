<!--
	JSON PANEL — the raw data of one user, and a comparison with another user.

	Figma:  sbertech-habibi → page "abac-r5" → "read-json" (3-1 … 3-5)
	        and "compare-json" (3-5 … 3-8)

	Use:
		{#if jsonUser}<JsonDrawer user={jsonUser} onclose={() => (jsonUser = null)} />{/if}

	Props:
		user      one user from data.js
		onclose   called when the panel is closed

	Two tabs:
		Read         the JSON of the user, in three views. Follows `proto.data`
		Comparison   pick another user → the differences between the two.
		             The result is MOCKED: always the same one (see data.js → userDiff).
		             What it finds follows `proto.compare` (differences · none · nothing to
		             compare); a user without domain attributes always gives "nothing to compare".
-->
<script>
	import {
		Button,
		Tabs,
		Segmented,
		SearchChip,
		Select,
		TextInput,
		Menu,
		MenuItem,
		Skeleton,
		EmptyState
	} from '#lib';
	import { users, jsonOf, jsonLines, userDiff } from './data.js';
	import { proto, notify } from './prototype.svelte.js';
	import Drawer from './Drawer.svelte';
	import JsonText from './JsonText.svelte';
	import CompareView from './CompareView.svelte';

	let { user, onclose } = $props();

	const tabs = [
		{ id: 'read', label: 'Read' },
		{ id: 'compare', label: 'Comparison' }
	];
	const views = [
		{ value: 'effective', label: 'Effective attributes' },
		{ value: 'domain', label: 'Domain attributes' },
		{ value: 'roles', label: 'Roles and privileges' }
	];

	let tab = $state('read');

	/* ---------- Read ---------- */

	let view = $state('effective');
	let query = $state('');

	let json = $derived(jsonOf(user)[view]);
	let lines = $derived(jsonLines(json));
	let words = $derived(query.trim().toLowerCase());

	function copy() {
		navigator.clipboard?.writeText(JSON.stringify(json, null, 2));
		notify('JSON copied', 'success');
	}

	/* ---------- Comparison ---------- */

	let other = $state(null); // the user to compare with
	let typed = $state(''); // what is written in the "Compare with" box
	let listOpen = $state(false);
	let attributes = $state('domain'); // "Attributes type". The mocked result is the same for all three
	let waiting = $state(false); // true for a moment after a choice: the "server" is comparing
	let timer;

	// The list under "Compare with": everyone else, narrowed by what is typed.
	let matches = $derived.by(() => {
		const text = typed.trim().toLowerCase();
		const others = users.filter((item) => item.id !== user.id);
		if (!text || text === other?.login) return others;
		return others.filter((item) =>
			[item.login, item.fullName].some((value) => value?.toLowerCase().includes(text))
		);
	});

	function compare() {
		waiting = true;
		clearTimeout(timer);
		timer = setTimeout(() => (waiting = false), 700);
	}

	function pick(item) {
		other = item;
		typed = item.login;
		listOpen = false;
		compare();
	}

	// What the comparison "found".
	let outcome = $derived.by(() => {
		if (waiting || proto.data === 'loading') return 'loading';
		if (proto.data === 'error') return 'error';
		const noContent = [user, other].some((item) => item?.domainAttrs !== 'filled');
		if (noContent || proto.data === 'empty') return 'nothing';
		return proto.compare;
	});
</script>

<!-- Clicking anywhere else closes the list of users. -->
<svelte:window onclick={() => (listOpen = false)} />

<Drawer title="JSON" subtitle={user.login} {onclose}>
	<Tabs {tabs} bind:active={tab} />

	{#if tab === 'read'}
		<div class="bar">
			<Segmented options={views} bind:value={view} />
			<Button
				appearance="accent"
				mode="primary"
				icon="download"
				onclick={() => notify('Auth context downloaded', 'success')}>Auth context</Button
			>
		</div>

		<section class="card">
			{#if proto.data === 'loading'}
				<div class="bars" aria-busy="true">
					{#each [30, 45, 60, 40, 55, 35, 50, 25] as size}<Skeleton width="{size}%" />{/each}
				</div>
			{:else if proto.data === 'error'}
				<div class="fill"><EmptyState type="error" /></div>
			{:else if proto.data === 'empty'}
				<div class="fill">
					<EmptyState
						type="empty"
						title="No attributes yet"
						description="There is nothing to show as JSON until the first sync."
					/>
				</div>
			{:else}
				<div class="tools">
					<SearchChip bind:value={query} placeholder="Search in JSON" />
					<Button icon="duplicate" label="Copy JSON" onclick={copy} />
				</div>
				<!-- JSON always reads left to right, also on a right-to-left page. -->
				<ol class="code hb-text-code-s hb-scroll" dir="ltr">
					{#each lines as text}
						<li class:found={words && text.toLowerCase().includes(words)}><JsonText {text} /></li>
					{/each}
				</ol>
			{/if}
		</section>
	{:else}
		<div class="pickers">
			<!-- "Compare with": type to search, then pick a user from the list. -->
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="anchor" onclick={(event) => event.stopPropagation()}>
				<TextInput
					big
					label="Compare with"
					iconEnd="chevron-down"
					autocomplete="off"
					bind:value={typed}
					onfocus={() => (listOpen = true)}
					oninput={() => (listOpen = true)}
				/>
				{#if listOpen}
					<div class="anchor__menu hb-scroll">
						<Menu label="Users to compare with">
							{#each matches as item (item.id)}
								<MenuItem subtitle={item.login} onclick={() => pick(item)}
									>{item.fullName ?? 'No full name'}</MenuItem
								>
							{:else}
								<div class="hb-menu__heading">No users match "{typed}"</div>
							{/each}
						</Menu>
					</div>
				{/if}
			</div>

			<Select
				big
				label="Attributes type"
				options={views}
				bind:value={attributes}
				onchange={compare}
			/>
		</div>

		{#if other}
			<CompareView
				state={outcome}
				rows={userDiff(user, other)}
				labels={{ a: `A: ${user.login}`, b: `B: ${other.login}` }}
				marks={{ a: 'A', b: 'B' }}
				texts={{
					same: 'Try another profile or attribute set to compare',
					nothing: 'One of the profiles has no attributes'
				}}
			/>
		{:else}
			<div class="fill">
				<EmptyState
					type="empty"
					title="Choose a profile to compare"
					description="Pick a user in “Compare with” to see how the two differ."
				/>
			</div>
		{/if}
	{/if}
</Drawer>

<style>
	.bar,
	.tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.card {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	.tools {
		padding: 8px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
	}
	.fill {
		flex: 1;
		display: grid;
		place-items: center;
	}
	.bars {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
	}

	/* The code: numbered lines, long ones scroll sideways. */
	.code {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 8px 0;
		overflow: auto;
		list-style: none;
		counter-reset: line;
	}
	.code li {
		flex: none;
		padding-inline-end: 16px;
		white-space: pre;
		color: var(--uncolorful-grey-primary);
	}
	.code li::before {
		counter-increment: line;
		content: counter(line, decimal-leading-zero);
		display: inline-block;
		width: 52px;
		padding-inline-start: 12px;
		color: var(--uncolorful-grey-tertiary);
	}
	.code li.found {
		background: var(--boring-blue-90);
	}

	/* The two boxes of the comparison, side by side. */
	.pickers {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.anchor {
		position: relative;
	}
	.anchor__menu {
		position: absolute;
		top: calc(100% + 4px);
		inset-inline: 0;
		z-index: 10;
		max-height: 296px;
		overflow: auto;
		border-radius: var(--radius-l);
	}
</style>
