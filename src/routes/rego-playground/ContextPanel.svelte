<!--
	CONTEXT PANEL — what the policy gets as input: "Auth context" and "Data".
	"Add from fixtures" fills the Auth context from a saved example.

	Figma:  sbertech-habibi → page "rego-playground" → "Context-Panel" and "drop-list"
	        (screens 07-evaluation-1 … 3)
	Local to the playground.

	Use:
		<ContextPanel bind:input />

	Props:
		input   the Auth context as text; '' = empty. Use bind:input — picking a fixture changes it

	The fixtures list loads for a moment when it opens ("Loading…" at the bottom),
	then shows everything. Every fixture puts the same made-up input in (see data.js).
-->
<script>
	import { Button, Chip, Loader, Menu, MenuItem, TextInput } from '#lib';
	import { fixtures, fixtureInput, contextData } from './data.js';
	import { copy } from './prototype.svelte.js';
	import Panel from './Panel.svelte';
	import Code from './Code.svelte';

	let { input = $bindable('') } = $props();

	let tab = $state('auth'); // "auth" | "data"
	let searching = $state(false);

	let menuOpen = $state(false);
	let loading = $state(false);
	let query = $state('');

	let shownText = $derived(tab === 'auth' ? input : JSON.stringify(contextData, null, 2));
	let matching = $derived(
		fixtures.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()))
	);

	function openMenu(event) {
		event.stopPropagation(); // the window handler below must not close what was just opened
		menuOpen = !menuOpen;
		query = '';
		loading = true;
		setTimeout(() => (loading = false), 800);
	}

	function pick() {
		input = JSON.stringify(fixtureInput, null, 2);
		tab = 'auth';
		menuOpen = false;
	}

	// Focus the search as soon as the list appears.
	function focusInput(node) {
		node.querySelector('input')?.focus();
	}
</script>

<svelte:window
	onclick={() => (menuOpen = false)}
	onkeydown={(event) => event.key === 'Escape' && (menuOpen = false)}
/>

<Panel>
	{#snippet head()}
		<!-- Two tabs that look like chips (Figma "tab/auth-context", "tab/data"). -->
		<Chip active={tab === 'auth'} onclick={() => (tab = 'auth')}>Auth context</Chip>
		<Chip active={tab === 'data'} onclick={() => (tab = 'data')}>Data</Chip>
	{/snippet}
	{#snippet actions()}
		<span class="fixtures">
			<Button mode={menuOpen ? 'secondary' : 'ghost'} aria-expanded={menuOpen} onclick={openMenu}
				>Add from fixtures</Button
			>
			{#if menuOpen}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div class="fixtures__menu" onclick={(event) => event.stopPropagation()}>
					<Menu label="Fixtures">
						<div class="fixtures__search" use:focusInput>
							<TextInput
								icon="search"
								placeholder="Search"
								aria-label="Search fixtures"
								bind:value={query}
							/>
						</div>
						{#each matching as name (name)}
							<MenuItem icon="doc" onclick={pick}>{name}</MenuItem>
						{:else}
							<div class="fixtures__note hb-text-body-c">No fixtures match “{query}”</div>
						{/each}
						{#if loading}
							<div class="fixtures__note hb-text-body-b">
								<Loader label="Loading fixtures" />
								Loading…
							</div>
						{/if}
					</Menu>
				</div>
			{/if}
		</span>
		<Button
			appearance={searching ? 'accent' : 'default'}
			icon="search"
			label="Search"
			onclick={() => (searching = !searching)}
		/>
		<Button appearance="white" icon="duplicate" label="Copy" onclick={() => copy(shownText)} />
	{/snippet}

	<Code text={shownText} placeholder="### Enter content for Input" {searching} />
</Panel>

<style>
	.fixtures {
		position: relative;
		display: inline-flex;
	}
	/* The list opens under the button, lined up with its end. */
	.fixtures__menu {
		position: absolute;
		top: calc(100% + 4px);
		inset-inline-end: 0;
		z-index: 30;
		width: 330px;
	}
	.fixtures__search {
		padding: 12px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
	}
	.fixtures__note {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 16px;
		color: var(--uncolorful-grey-tertiary);
	}
</style>
