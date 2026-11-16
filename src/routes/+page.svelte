<!--
	HOME PAGE — a simple list of what lives in this repo.
	When you add a prototype folder under src/routes, add a link to it here.
-->
<script>
	import { resolve } from '$app/paths';
	import { Icon } from '#lib';
</script>

<main class="home">
	<h1 class="hb-text-h1">Habibi UI</h1>
	<p class="hb-text-body-b">
		The design system, moved from Figma into code — and the prototypes built with it.
	</p>

	<a class="home__card" href={resolve('/ds')}>
		<Icon name="view-grid" />
		<span>
			<strong class="hb-text-body-b-bold">Design system</strong>
			<span class="hb-text-body-c">Colours, type, icons and every component, in all themes.</span>
		</span>
		<Icon name="arrow-right" />
	</a>

	<!-- Prototypes: one card per folder in src/routes. -->
	<a class="home__card" href={resolve('/abac')}>
		<Icon name="group" />
		<span>
			<strong class="hb-text-body-b-bold">ABAC · Users</strong>
			<span class="hb-text-body-c">Prototype: the user list, the user page and the JSON panel.</span
			>
		</span>
		<Icon name="arrow-right" />
	</a>
</main>

<style>
	.home {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 560px;
		margin: 0 auto;
		padding: 64px 24px;
	}
	.home p {
		margin: 0;
		color: var(--uncolorful-grey-secondary);
	}
	.home__card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
		color: var(--uncolorful-grey-primary);
		text-decoration: none;
	}
	.home__card:hover {
		background: var(--boring-blue-90);
	}
	.home__card > span {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
