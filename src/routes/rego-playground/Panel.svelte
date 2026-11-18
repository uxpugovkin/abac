<!--
	PANEL — a white area with a 40px header and a body that scrolls.
	The editor, "Auth context", "Result" and the code in the test details are all panels.

	Figma:  sbertech-habibi → page "rego-playground" → "Editor", "Context-Panel", "Result-Panel"
	Local to the playground.

	Use:
		<Panel>
			{#snippet head()}policy.rego{/snippet}
			{#snippet actions()}<Button icon="duplicate" label="Copy" />{/snippet}
			…the body…
		</Panel>

	Props:
		head      snippet: the start of the header (a title or a few tabs)
		actions   snippet: the end of the header (small buttons)
		flat      true = no body scrolling of its own (the body lays itself out)

	The body is everything between the tags.
-->
<script>
	let { head, actions, flat = false, children } = $props();
</script>

<section class="panel">
	<header class="panel__head">
		<div class="panel__start">{@render head?.()}</div>
		{#if actions}<div class="panel__end">{@render actions()}</div>{/if}
	</header>
	<div class="panel__body" class:panel__body--flat={flat}>
		{@render children?.()}
	</div>
</section>

<style>
	.panel {
		flex: 1;
		min-width: 0;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: var(--uncolorful-grey-surface);
	}
	.panel__head {
		flex: none;
		display: flex;
		align-items: center;
		gap: 20px;
		height: 40px;
		padding: 0 10px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
	}
	.panel__start {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.panel__end {
		flex: none;
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.panel__body {
		flex: 1;
		min-height: 0;
		overflow: auto;
	}
	.panel__body--flat {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
</style>
