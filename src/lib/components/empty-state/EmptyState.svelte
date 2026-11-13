<!--
	EMPTY STATE
	What a screen shows when there is nothing to show: the monkey mascot,
	a title, one line of explanation and (optionally) a button.

	Figma:  habibi-library → page "Empty" → "empty-state"

	Use — pick a type and you get its mascot and its texts:
		<EmptyState type="not-found">
			<Button appearance="accent" mode="primary" icon="close">Clear filters</Button>
		</EmptyState>

	Use — your own words:
		<EmptyState type="empty" title="No users yet" description="Add the first user to get started.">
			<Button appearance="accent" mode="primary" icon="plus">Add user</Button>
		</EmptyState>

	Props:
		type          which situation this is. It decides the mascot and the default texts:
		                "empty"        nothing has been added yet          (monkey with a ping-pong bat)
		                "not-found"    a search or filter found nothing    (monkey with a magnifying glass)
		                "error"        something broke                     (monkey with a STOP sign)
		                "forbidden"    the person has no access            (police monkey)
		                "maintenance"  the section is switched off for now (monkey with a wrench)
		              Default "empty"
		title         the bold line. Leave it out to use the text from Figma
		description   the explanation under it. Leave it out to use the text from Figma
		image         address of your own picture. Replaces the mascot

	Buttons: put them between the tags.
-->
<script>
	import './empty-state.css';

	// The mascot pictures (384 × 384, see-through background), exported from Figma.
	import emptyMascot from './mascot-empty.webp';
	import notFoundMascot from './mascot-not-found.webp';
	import errorMascot from './mascot-error.webp';
	import forbiddenMascot from './mascot-forbidden.webp';
	import maintenanceMascot from './mascot-maintenance.webp';

	// Picture and default texts of each type — the same words as in Figma.
	const types = {
		empty: {
			mascot: emptyMascot,
			title: 'Nothing here yet',
			description:
				"When items are added, they'll show up here. Create the first one to get started."
		},
		'not-found': {
			mascot: notFoundMascot,
			title: 'No results found',
			description:
				'Nothing matches your search or filters. Try different keywords or clear the filters.'
		},
		error: {
			mascot: errorMascot,
			title: 'Something went wrong',
			description: "We couldn't load this content. Check your connection and try again."
		},
		forbidden: {
			mascot: forbiddenMascot,
			title: 'Access denied',
			description: "You don't have permission to view this page. Ask your administrator for access."
		},
		maintenance: {
			mascot: maintenanceMascot,
			title: 'Under maintenance',
			description:
				'This section is temporarily unavailable while we make improvements. Please check back soon.'
		}
	};

	let {
		type = 'empty',
		title = '',
		description = '',
		image = '',
		children,
		class: extraClass = ''
	} = $props();

	// An unknown type falls back to "empty" instead of breaking the page.
	let preset = $derived(types[type] ?? types.empty);
</script>

<div class="hb-empty {extraClass}">
	<!-- alt="" : the picture is decoration; the title says the same thing in words. -->
	<img class="hb-empty__picture" src={image || preset.mascot} alt="" width="128" height="128" />

	<div class="hb-empty__text">
		<div class="hb-empty__title">{title || preset.title}</div>
		<div class="hb-empty__description">{description || preset.description}</div>
	</div>

	{#if children}
		<div class="hb-empty__actions">{@render children()}</div>
	{/if}
</div>
