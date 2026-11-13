<!--
	TREE
	A list with levels that can be opened and closed, like folders.

	Figma:  habibi-library → page "Tree"

	Use:
		<Tree
			bind:selected={chosen}
			nodes={[
				{
					id: 'tenant',
					label: 'cyber-security-tenant',
					open: true,
					children: [
						{ id: 'd144', label: 'res-domain-144' },
						{ id: 'd145', label: 'res-domain-145', children: [{ id: 'users', label: 'Users' }] }
					]
				}
			]}
		/>

	Props:
		nodes      the tree. Each node:
		             id         something unique (used to remember what is open and selected)
		             label      the text
		             children   the nodes inside it (optional)
		             open       true = starts opened (optional)
		selected   the id of the highlighted node. Use bind:selected to read what was clicked
		onselect   called with the node when a row is clicked (optional)

	Clicking a row selects it; if it has children, it also opens or closes.
	An open row shows an arrow up, a closed one an arrow down.
	Thin lines connect every row to its parent (drawn in tree.css).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './tree.css';

	let { nodes = [], selected = $bindable(), onselect, class: extraClass = '' } = $props();

	// Which nodes are open right now:  { 'some-id': true, … }
	// Starts from the `open: true` flags in the data.
	// (Only the starting value of `nodes` is used here, on purpose — hence the ignore.)
	// svelte-ignore state_referenced_locally
	let open = $state(collectOpen(nodes));

	function collectOpen(list, result = {}) {
		for (const node of list) {
			if (node.open) result[node.id] = true;
			if (node.children) collectOpen(node.children, result);
		}
		return result;
	}

	function click(node) {
		if (node.children) open[node.id] = !open[node.id];
		selected = node.id;
		onselect?.(node);
	}
</script>

<!-- One level of the tree. It calls itself again for the children of each open node. -->
{#snippet level(list)}
	{#each list as node}
		<li>
			<button
				class="hb-tree__row"
				class:hb-tree__row--selected={node.id === selected}
				type="button"
				aria-expanded={node.children ? !!open[node.id] : undefined}
				onclick={() => click(node)}
			>
				{#if node.children}
					<Icon name={open[node.id] ? 'chevron-up' : 'chevron-down'} size={16} />
				{:else}
					<span class="hb-tree__spacer"></span>
				{/if}
				<span class="hb-tree__label">{node.label}</span>
			</button>

			{#if node.children && open[node.id]}
				<ul>{@render level(node.children)}</ul>
			{/if}
		</li>
	{/each}
{/snippet}

<ul class="hb-tree {extraClass}">
	{@render level(nodes)}
</ul>
