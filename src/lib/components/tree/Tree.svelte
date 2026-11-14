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
	Rows without children have no arrow.

	How a row is built — the same layers as the Figma component "tree-row":
		[ line ][ line ]…[ arrow ][ text ]
		  └ one 16px piece per level, drawn in tree.css. Together the pieces of
		    all rows form the thin lines that connect every row to its parent.
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

	/* ---------- From a tree to a flat list of rows ----------
	   The screen shows a plain list: one row per visible node. Each row knows
	   which line pieces to draw before its arrow, one per level (Figma names in brackets):
	     'branch'  line down + a short branch to this row       (type B)  ├
	     'corner'  rounded corner into this row, the line ends  (type C)  └
	     'line'    a line passing by, to a later row above us   (type A)  │
	     'none'    empty                                         (type 0)
	   The last piece belongs to the row itself; the ones before it to its parents. */
	let rows = $derived(listRows(nodes, [], true));

	function listRows(list, passing, isTop, result = []) {
		list.forEach((node, index) => {
			const isLast = index === list.length - 1;

			// Top-level rows have nothing above them to connect to.
			const lines = isTop ? [] : [...passing, isLast ? 'corner' : 'branch'];
			result.push({ node, lines });

			// Rows under this one: where we ended they see nothing, otherwise our line passes by.
			if (node.children && open[node.id]) {
				const below = isTop ? [] : [...passing, isLast ? 'none' : 'line'];
				listRows(node.children, below, false, result);
			}
		});
		return result;
	}

	function click(node) {
		if (node.children) open[node.id] = !open[node.id];
		selected = node.id;
		onselect?.(node);
	}
</script>

<ul class="hb-tree {extraClass}">
	{#each rows as { node, lines } (node.id)}
		<li>
			<button
				class="hb-tree__row"
				class:hb-tree__row--selected={node.id === selected}
				type="button"
				aria-expanded={node.children ? !!open[node.id] : undefined}
				onclick={() => click(node)}
			>
				{#each lines as line}<span class="hb-tree__line hb-tree__line--{line}"></span>{/each}

				<!-- Only rows with children have an arrow. -->
				{#if node.children}
					<Icon name={open[node.id] ? 'chevron-up' : 'chevron-down'} size={16} />
				{/if}

				<span class="hb-tree__text">{node.label}</span>
			</button>
		</li>
	{/each}
</ul>
