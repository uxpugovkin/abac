<!--
	DEMO — a helper used only by the docs pages.
	One titled block that shows a component, with a line of explanation.

	Use:
		<Demo title="Button" figma="button" about="Something you click.">
			<Button>Click me</Button>
		</Demo>

	Props:
		title    name of the component
		figma    name of the page in the Figma library (shown as a small note)
		about    one line saying what it is for
		column   true = stack the examples top to bottom instead of in a row
-->
<script>
	let { title, figma = '', about = '', column = false, children } = $props();
</script>

<section class="demo" id={title.toLowerCase().replaceAll(' ', '-')}>
	<header>
		<h3 class="hb-text-h3">{title}</h3>
		{#if figma}<span class="hb-text-body-d">Figma page: {figma}</span>{/if}
	</header>
	{#if about}<p class="hb-text-body-c">{about}</p>{/if}
	<div class="demo__stage" class:demo__stage--column={column}>
		{@render children()}
	</div>
</section>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: 8px;
		/* When you jump here from the side menu, leave room for the sticky top bar. */
		scroll-margin-top: 72px;
	}
	header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}
	h3,
	p {
		margin: 0;
	}
	header span,
	p {
		color: var(--uncolorful-grey-secondary);
	}
	/* The white card the examples sit on. */
	.demo__stage {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		padding: 24px;
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-surface);
		/* Sliders on this card should "cut" with the card colour (see Slider). */
		--slider-gap: var(--uncolorful-grey-surface);
	}
	.demo__stage--column {
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: stretch;
	}
</style>
