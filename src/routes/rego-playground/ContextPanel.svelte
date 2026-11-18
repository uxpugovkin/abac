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
	import { Button, Chip, Loader, Menu, MenuItem } from '#lib';
	import { fixtures, fixtureInput, contextData } from './data.js';
	import { copy, notify } from './prototype.svelte.js';
	import Panel from './Panel.svelte';
	import Code from './Code.svelte';

	let { input = $bindable('') } = $props();

	let tab = $state('auth'); // "auth" | "data"
	let menuOpen = $state(false);
	let loading = $state(false);

	let shownText = $derived(tab === 'auth' ? input : JSON.stringify(contextData, null, 2));

	function openMenu(event) {
		event.stopPropagation(); // the window handler below must not close what was just opened
		menuOpen = !menuOpen;
		loading = true;
		setTimeout(() => (loading = false), 800);
	}

	function pick() {
		input = JSON.stringify(fixtureInput, null, 2);
		tab = 'auth';
		menuOpen = false;
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
			<Button aria-expanded={menuOpen} onclick={openMenu}>Add from fixtures</Button>
			{#if menuOpen}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div class="fixtures__menu" onclick={(event) => event.stopPropagation()}>
					<Menu label="Fixtures">
						{#each fixtures as name (name)}
							<MenuItem icon="doc" onclick={pick}>{name}</MenuItem>
						{/each}
						{#if loading}
							<div class="fixtures__loading hb-text-body-b">
								<Loader label="Loading fixtures" />
								Loading…
							</div>
						{/if}
					</Menu>
				</div>
			{/if}
		</span>
		<Button
			icon="search"
			label="Search"
			onclick={() => notify('Search is not part of this prototype')}
		/>
		<Button icon="duplicate" label="Copy" onclick={() => copy(shownText)} />
	{/snippet}

	<Code text={shownText} placeholder="### Enter content for Input" />
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
	.fixtures__loading {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 16px;
		color: var(--uncolorful-grey-tertiary);
	}
</style>
