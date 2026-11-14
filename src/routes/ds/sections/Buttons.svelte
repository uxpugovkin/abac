<!-- DOCS: Button and Loader. -->
<script>
	import { Button, Loader } from '#lib';
	import Demo from '../Demo.svelte';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	const t = pick(content.buttons); // the example texts, in the current language

	const appearances = ['default', 'accent', 'danger', 'white'];
	const modes = ['primary', 'secondary', 'ghost'];
</script>

<Demo
	title="Button"
	figma="button"
	about="4 colour sets × 3 modes × 2 sizes. Hover and press them to see the states."
	column
>
	{#each appearances as appearance}
		<div class="row">
			<code class="hb-text-code-s">{appearance}</code>
			{#each modes as mode}
				<Button {appearance} {mode} icon="upload">{t.button}</Button>
			{/each}
			{#each modes as mode}
				<Button {appearance} {mode} icon="kitecat" label={t.iconOnly} />
			{/each}
			{#each modes as mode}
				<Button {appearance} {mode} disabled>{t.disabled}</Button>
			{/each}
		</div>
	{/each}
	<div class="row">
		<code class="hb-text-code-s">size="m"</code>
		<Button size="m" appearance="accent" mode="primary" icon="plus">{t.addUser}</Button>
		<Button size="m" icon="brackets">{t.json}</Button>
		<Button size="m" mode="ghost" iconEnd="chevron-down">{t.more}</Button>
		<Button size="m" mode="ghost" icon="overflow" label={t.moreActions} />
	</div>
</Demo>

<Demo title="Loader" figma="icons → loader" about="Says “please wait”.">
	<Loader label={t.loading} />
	<Loader size={16} label={t.loading} />
</Demo>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}
	code {
		width: 80px;
		color: var(--uncolorful-grey-secondary);
	}
</style>
