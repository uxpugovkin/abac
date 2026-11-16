<!-- DOCS: Button and Loader. -->
<script>
	import { Button, Loader } from '#lib';
	import Demo from '../Demo.svelte';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	const t = pick(content.buttons); // the example texts, in the current language

	const appearances = ['default', 'accent', 'danger', 'white'];
	const modes = ['primary', 'secondary', 'ghost'];
	const sizes = ['s', 'm'];
</script>

<Demo
	title="Button"
	figma="button, icon-button"
	about="4 colour sets × 3 modes × 2 sizes. Hover and press them to see the states."
	column
>
	{#each sizes as size}
		<p class="hb-text-body-d size"><bdi>size="{size}"</bdi></p>
		{#each appearances as appearance}
			<div class="row">
				<code class="hb-text-code-s">{appearance}</code>
				{#each modes as mode}
					<Button {appearance} {mode} {size} icon="upload">{t.button}</Button>
				{/each}
				{#each modes as mode}
					<Button {appearance} {mode} {size} icon="kitecat" label={t.iconOnly} />
				{/each}
			</div>
		{/each}
	{/each}
	<p class="hb-text-body-d size">disabled</p>
	{#each sizes as size}
		<div class="row">
			<code class="hb-text-code-s">{size}</code>
			{#each modes as mode}
				<Button {mode} {size} icon="upload" disabled>{t.disabled}</Button>
			{/each}
			<Button {size} icon="kitecat" label={t.iconOnly} disabled />
		</div>
	{/each}
	<p class="hb-text-body-d size">{t.inUse}</p>
	<div class="row">
		<code class="hb-text-code-s">m</code>
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
	.size {
		margin: 8px 0 0;
		color: var(--uncolorful-grey-tertiary);
	}
	.size:first-child {
		margin-top: 0;
	}
</style>
