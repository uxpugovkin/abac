<!--
	EMPTY STATE
	What a screen shows when there is nothing to show: a picture, a title,
	one line of explanation and (optionally) a button to fix it.

	Figma:  habibi-library → page "Empty" → "empty-state"

	Use:
		<EmptyState
			title="Nothing here yet"
			description="When items are added, they'll show up here. Create the first one to get started."
		>
			<Button appearance="accent" mode="primary" icon="plus">Add user</Button>
		</EmptyState>

		<EmptyState icon="search" title="No results found"
			description="Nothing matches your search or filters. Try different keywords or clear the filters." />

	Props:
		title         the bold line
		description   the explanation under it
		icon          icon name for the picture.  Default "folder"
		image         address of your own picture. Replaces the icon

	Buttons: put them between the tags.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './empty-state.css';

	let {
		title = '',
		description = '',
		icon = 'folder',
		image = '',
		children,
		class: extraClass = ''
	} = $props();
</script>

<div class="hb-empty {extraClass}">
	<div class="hb-empty__picture">
		{#if image}
			<img src={image} alt="" />
		{:else}
			<Icon name={icon} size={48} />
		{/if}
	</div>

	<div class="hb-empty__text">
		{#if title}<div class="hb-empty__title">{title}</div>{/if}
		{#if description}<div class="hb-empty__description">{description}</div>{/if}
	</div>

	{#if children}
		<div class="hb-empty__actions">{@render children()}</div>
	{/if}
</div>
