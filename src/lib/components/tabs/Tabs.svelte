<!--
	TABS
	Switches between a few views that live in the same place.

	Figma:  habibi-library → page "tabs"

	Use:
		<script>
			let tab = $state('attributes');
		</script>

		<Tabs
			bind:active={tab}
			tabs={[
				{ id: 'attributes', label: 'Domain attributes' },
				{ id: 'roles', label: 'Roles and privileges' },
				{ id: 'delegations', label: 'Delegations', icon: 'share' }
			]}
		/>

		{#if tab === 'attributes'} … {/if}

	Props:
		tabs     the list of tabs. Each one: { id, label, icon (optional), disabled (optional) }
		active   the id of the open tab. Use bind:active to read and change it

	Tabs only shows the row of tabs. Showing the right content under it
	is up to the page (see the {#if} in the example).
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './tabs.css';

	let { tabs = [], active = $bindable(), class: extraClass = '' } = $props();
</script>

<div class="hb-tabs {extraClass}" role="tablist">
	{#each tabs as tab}
		<button
			class="hb-tab"
			class:hb-tab--active={tab.id === active}
			type="button"
			role="tab"
			aria-selected={tab.id === active}
			disabled={tab.disabled}
			onclick={() => (active = tab.id)}
		>
			{tab.label}
			{#if tab.icon}<Icon name={tab.icon} size={20} />{/if}
		</button>
	{/each}
</div>
