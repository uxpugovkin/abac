<!--
	COMPARE PANEL — one user against another, in a panel over the page.

	Figma:  sbertech-habibi → page "abac-r5" → "compare-json" (3-5 … 3-8),
	        without the Read / Comparison tabs: in the to-be version reading the JSON
	        happens on the user page itself (its "JSON" switch).

	Use:
		{#if compareUser}<CompareDrawer user={compareUser} onclose={() => (compareUser = null)} />{/if}

	Props:
		user      one user from data.js — side A
		onclose   called when the panel is closed

	Pick another user in "Compare with" → the differences between the two.
	The result is MOCKED: always the same one (see data.js → userDiff).
	What it finds follows `proto.compare` (differences · none · nothing to compare);
	a user without domain attributes always gives "nothing to compare".
-->
<script>
	import { Select, TextInput, Menu, MenuItem, EmptyState } from '#lib';
	import { users, userDiff } from './data.js';
	import { proto } from './prototype.svelte.js';
	import Drawer from './Drawer.svelte';
	import CompareView from './CompareView.svelte';

	let { user, onclose } = $props();

	const attributeTypes = [
		{ value: 'effective', label: 'Effective attributes' },
		{ value: 'domain', label: 'Domain attributes' },
		{ value: 'roles', label: 'Roles and privileges' }
	];

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

<Drawer title="Compare" subtitle={user.login} {onclose}>
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
			options={attributeTypes}
			bind:value={attributes}
			onchange={() => other && compare()}
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
</Drawer>

<style>
	.fill {
		flex: 1;
		display: grid;
		place-items: center;
	}
	/* The two boxes, side by side. */
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
