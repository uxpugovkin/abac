<!--
	TREE
	A list of folders and files. Folders open and close; a file can be selected.

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
						{ id: 'd144', label: 'res-domain-144', children: [{ id: 'users', label: 'Users' }] },
						{ id: 'd145', label: 'res-domain-145', children: [] },
						{ id: 'readme', label: 'Read me' }
					]
				}
			]}
		/>

	Props:
		nodes      the tree. Each node:
		             id         something unique (used to remember what is open and selected)
		             label      the text
		             children   the nodes inside it. A node WITH children is a folder —
		                        even an empty one (children: []). A node without them is a file
		             open       true = the folder starts opened (optional)
		selected   the id of the selected file. Use bind:selected to read what was clicked
		onselect   called with the file when a file is clicked (optional)

	Folders and files work differently (Figma "tree-row", property "Folder"):
		folder   a click opens or closes it. A folder is never selected.
		         Closed: arrow down. Open: arrow up. It shows a folder icon.
		file     a click selects it: the row turns solid blue. It shows a document icon.

	How a row is built — the same layers as the Figma component "tree-row":
		folder   [ line ][ line ]…[ arrow ][ text: folder icon + label ]
		file     [ line ][ line ]…[ text: document icon + label ]
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
	   which line pieces to draw at its start, one per level (Figma names in brackets):
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

	function isFolder(node) {
		return Array.isArray(node.children);
	}

	// A folder opens or closes. A file gets selected.
	function click(node) {
		if (isFolder(node)) {
			open[node.id] = !open[node.id];
		} else {
			selected = node.id;
			onselect?.(node);
		}
	}
</script>

<ul class="hb-tree {extraClass}">
	{#each rows as { node, lines } (node.id)}
		{@const folder = isFolder(node)}
		{@const isSelected = !folder && node.id === selected}
		<li>
			<button
				class="hb-tree__row"
				class:hb-tree__row--selected={isSelected}
				type="button"
				aria-expanded={folder ? !!open[node.id] : undefined}
				aria-current={isSelected ? 'true' : undefined}
				onclick={() => click(node)}
			>
				{#each lines as line}<span class="hb-tree__line hb-tree__line--{line}"></span>{/each}

				<!-- A folder has its arrow before the text. -->
				{#if folder}
					<Icon name={open[node.id] ? 'chevron-up' : 'chevron-down'} size={16} />
				{/if}

				<!-- Inside the text block, before the label: a folder or a document icon. -->
				<span class="hb-tree__text">
					<Icon name={folder ? 'folder' : 'doc'} size={16} />
					<span class="hb-tree__label">{node.label}</span>
				</span>
			</button>
		</li>
	{/each}
</ul>
