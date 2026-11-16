<!--
	DRAWER — a panel that slides over the page from the far side, with a title and ×.
	The JSON panel and the snapshots comparison both sit in one.

	Figma:  sbertech-habibi → page "abac-r5" → "read-json" / "compare-json" (the panel)
	Local to the ABAC prototype (habibi-library has no drawer yet).

	Use:
		<Drawer title="JSON" subtitle={user.login} onclose={() => (open = false)}>
			…what the panel shows…
		</Drawer>

	Props:
		title      the heading
		subtitle   a second part of the heading, after a dot (e.g. the login)
		onclose    called when × is clicked, the dark area is clicked, or Esc is pressed

	The edge of the panel can be dragged to make it wider or narrower.
-->
<script>
	import { Button, Splitter } from '#lib';

	let { title = '', subtitle = '', onclose, children } = $props();

	let width = $state(840);

	// The panel is AFTER the splitter, so it grows when the line moves backwards.
	function resize(pixels) {
		width = Math.min(Math.max(width - pixels, 480), window.innerWidth - 120);
	}
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && onclose?.()} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="shade" onclick={onclose}></div>

<div
	class="drawer"
	style:width="{width}px"
	role="dialog"
	aria-modal="true"
	aria-label="{title} {subtitle}"
>
	<Splitter ondrag={resize} label="Resize the panel" />

	<div class="body">
		<header class="head">
			<h2 class="hb-text-h2">
				{title}
				{#if subtitle}<span class="head__dot">•</span> {subtitle}{/if}
			</h2>
			<Button mode="ghost" size="m" icon="close" label="Close" onclick={onclose} />
		</header>

		{@render children?.()}
	</div>
</div>

<style>
	/* The dark area over the page behind the panel. */
	.shade {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: var(--opacity-16);
		backdrop-filter: blur(4px);
	}
	.drawer {
		position: fixed;
		top: 0;
		bottom: 0;
		inset-inline-end: 0;
		z-index: 41;
		display: flex;
		max-width: 100vw;
		background: var(--uncolorful-grey-background);
		border-inline-start: 1px solid var(--uncolorful-grey-border);
	}
	.body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 24px;
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.head h2 {
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.head__dot {
		color: var(--uncolorful-grey-disabled);
	}
</style>
