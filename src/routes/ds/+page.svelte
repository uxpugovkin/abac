<!--
	DESIGN SYSTEM DOCS  —  /ds
	One long page that shows every token and component, live.

	The top bar switches the theme and the text direction for the whole page,
	so you can check everything in all four themes and in right-to-left.

	The examples live in ./sections — one file per group.
	To document a new component: add a <Demo> to the right section file,
	and add its name to the `menu` list below.
-->
<script>
	import { resolve } from '$app/paths';
	import { Segmented, Switch, Button } from '#lib';
	import Foundations from './sections/Foundations.svelte';
	import Buttons from './sections/Buttons.svelte';
	import Forms from './sections/Forms.svelte';
	import Navigation from './sections/Navigation.svelte';
	import Status from './sections/Status.svelte';
	import Data from './sections/Data.svelte';

	// The side menu. Each name jumps to the <Demo> with the same title.
	const menu = [
		{ group: 'Foundations', items: ['Colours', 'Typography', 'Icons', 'Radius and shadows'] },
		{ group: 'Basics', items: ['Button', 'Loader'] },
		{ group: 'Forms', items: ['TextInput', 'Select', 'Checkbox', 'Radio', 'Switch', 'Slider'] },
		{ group: 'Navigation', items: ['Tabs', 'Chip', 'Segmented', 'FilterChip', 'Menu', 'Tree'] },
		{
			group: 'Status',
			items: ['Tag', 'Badge', 'Marker', 'Notification', 'Tooltip', 'Skeleton', 'Avatar']
		},
		{ group: 'Data', items: ['Table', 'Table · wide', 'Table · grouped', 'EmptyState', 'Splitter'] }
	];

	let theme = $state('light');
	let rtl = $state(false);

	// Whenever theme or direction changes, write it onto <html>.
	// That is all it takes: the tokens do the rest (see tokens/colours.css).
	$effect(() => {
		document.documentElement.dataset.theme = theme;
		document.documentElement.dir = rtl ? 'rtl' : 'ltr';
	});
</script>

<svelte:head>
	<title>Design system · Habibi UI</title>
</svelte:head>

<header class="bar">
	<Button mode="ghost" icon="arrow-left" href={resolve('/')} label="Home" />
	<strong class="hb-text-body-b-bold">Habibi UI</strong>
	<span class="bar__space"></span>
	<Switch bind:checked={rtl}>Right-to-left</Switch>
	<Segmented
		bind:value={theme}
		options={[
			{ value: 'light', label: 'Light' },
			{ value: 'dark', label: 'Dark' },
			{ value: 'olive', label: 'Olive' },
			{ value: 'olive-night', label: 'Olive Night' }
		]}
	/>
</header>

<div class="layout">
	<nav class="side">
		{#each menu as section}
			<div class="hb-text-body-e-bold side__group">{section.group}</div>
			{#each section.items as item}
				<a class="hb-text-body-c" href="#{item.toLowerCase().replaceAll(' ', '-')}">{item}</a>
			{/each}
		{/each}

		<!-- Longer write-ups that have their own page. -->
		<div class="hb-text-body-e-bold side__group">Guidelines</div>
		<a class="hb-text-body-c" href={resolve('/ds/tables')}>Tables</a>
	</nav>

	<main class="content">
		<h2 class="hb-text-h2">Foundations</h2>
		<Foundations />
		<h2 class="hb-text-h2">Basics</h2>
		<Buttons />
		<h2 class="hb-text-h2">Forms</h2>
		<Forms />
		<h2 class="hb-text-h2">Navigation and choice</h2>
		<Navigation />
		<h2 class="hb-text-h2">Status and feedback</h2>
		<Status />
		<h2 class="hb-text-h2">Data and layout</h2>
		<Data />
	</main>
</div>

<style>
	/* ---------- Top bar (stays visible while scrolling) ---------- */
	.bar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 16px;
		height: 56px;
		padding: 0 24px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
		background: var(--uncolorful-grey-surface);
	}
	.bar__space {
		flex: 1;
	}

	/* ---------- Side menu + content ---------- */
	.layout {
		display: flex;
		align-items: flex-start;
	}
	.side {
		position: sticky;
		top: 56px;
		flex: none;
		display: flex;
		flex-direction: column;
		width: 200px;
		height: calc(100vh - 56px);
		padding: 16px 12px;
		overflow-y: auto;
	}
	.side__group {
		margin: 16px 8px 4px;
		color: var(--uncolorful-grey-tertiary);
	}
	.side a {
		padding: 2px 8px;
		border-radius: var(--radius-m);
		color: var(--uncolorful-grey-primary);
		text-decoration: none;
	}
	.side a:hover {
		background: var(--uncolorful-grey-border);
	}
	.content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 1040px;
		padding: 24px 24px 96px;
	}
	.content h2 {
		margin: 24px 0 0;
	}

	/* On narrow screens the side menu is hidden; the page is still one long scroll. */
	@media (max-width: 800px) {
		.side {
			display: none;
		}
	}
</style>
