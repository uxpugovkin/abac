<!--
	MESSAGE — a short grey text in the middle of an empty panel,
	e.g. "Results will appear after the first run". Anything else can go under it.

	Figma:  sbertech-habibi → page "rego-playground" (the empty Result and Problems panels)
	Local to the playground.

	Use:
		<Message text="No problems found" />
		<Message text="Failed to execute the policy">…tags and a button…</Message>

	Props:
		text   the message. A "\n" in it starts a new line
-->
<script>
	let { text = '', children } = $props();
</script>

<div class="message">
	<p class="hb-text-body-c">{text}</p>
	{@render children?.()}
</div>

<style>
	.message {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 16px;
		text-align: center;
	}
	p {
		margin: 0;
		white-space: pre-line;
		color: var(--uncolorful-grey-secondary);
	}
</style>
