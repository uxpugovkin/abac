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

	<!-- Prototypes will be listed here, one card per folder in src/routes. -->
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
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-surface);
		box-shadow: var(--shadow-default-s);
		color: var(--uncolorful-grey-primary);
		text-decoration: none;
	}
	.home__card:hover {
		box-shadow: var(--shadow-default-l);
	}
	.home__card > span {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
