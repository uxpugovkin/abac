<!--
	SNAPSHOTS COMPARISON — two moments of one user's history, side by side.

	Figma:  sbertech-habibi → page "abac-r5" → "domain-history-option-a" (4-2 … 4-4)

	Use:
		{#if snapshot}
			<SnapshotsDrawer {user} snapshotId={snapshot.id} onclose={() => (snapshot = null)} />
		{/if}

	Props:
		user         one user from data.js
		snapshotId   the id of the snapshot to compare with the current one (it becomes "Snapshot B")
		onclose      called when the panel is closed

	Both snapshots can be changed in the two boxes at the top.
	The result is MOCKED: always the same one (see data.js → snapshotDiff). What it finds
	follows `proto.compare` in the state panel; comparing a snapshot with itself always
	gives "No differences found".
-->
<script>
	import { Select } from '#lib';
	import { snapshots, snapshotDiff, formatSync } from './data.js';
	import { proto } from './prototype.svelte.js';
	import Drawer from './Drawer.svelte';
	import CompareView from './CompareView.svelte';

	let { user, snapshotId, onclose } = $props();

	const options = snapshots.map((snapshot) => ({
		value: snapshot.id,
		label: formatSync(snapshot.time) + (snapshot.current ? ' — current' : '')
	}));

	let a = $state(snapshots[0].id);
	// (Only the starting value comes from the prop, on purpose — hence the ignore.)
	// svelte-ignore state_referenced_locally
	let b = $state(snapshotId);

	// The "server" compares for a moment when the panel opens and after every choice.
	let waiting = $state(true);
	let timer = setTimeout(() => (waiting = false), 700);

	function compare() {
		waiting = true;
		clearTimeout(timer);
		timer = setTimeout(() => (waiting = false), 700);
	}

	// What the comparison "found".
	let outcome = $derived.by(() => {
		if (waiting || proto.data === 'loading') return 'loading';
		if (proto.data === 'error') return 'error';
		if (proto.data === 'empty') return 'nothing';
		if (a === b) return 'same';
		return proto.compare;
	});
</script>

<Drawer title="Snapshots comparison" subtitle={user.login} {onclose}>
	<div class="pickers">
		<Select big label="Snapshot A" {options} bind:value={a} onchange={compare} />
		<Select big label="Snapshot B" {options} bind:value={b} onchange={compare} />
	</div>

	<CompareView
		state={outcome}
		rows={snapshotDiff(user)}
		labels={{ a: 'Snapshot A', b: 'Snapshot B' }}
		marks={{ a: '−', b: '+' }}
		texts={{
			same: 'Try other snapshots to compare',
			nothing: 'One of the snapshots has no content'
		}}
	/>
</Drawer>

<style>
	.pickers {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
</style>
