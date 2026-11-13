<!-- DOCS: Button and Loader. -->
<script>
	import { Button, Loader } from '#lib';
	import Demo from '../Demo.svelte';

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
				<Button {appearance} {mode} icon="upload">Button</Button>
			{/each}
			{#each modes as mode}
				<Button {appearance} {mode} icon="kitecat" label="Icon only" />
			{/each}
			{#each modes as mode}
				<Button {appearance} {mode} disabled>Disabled</Button>
			{/each}
		</div>
	{/each}
	<div class="row">
		<code class="hb-text-code-s">size="m"</code>
		<Button size="m" appearance="accent" mode="primary" icon="plus">Add user</Button>
		<Button size="m" icon="brackets">JSON</Button>
		<Button size="m" mode="ghost" iconEnd="chevron-down">More</Button>
		<Button size="m" mode="ghost" icon="overflow" label="More actions" />
	</div>
</Demo>

<Demo title="Loader" figma="icons → loader" about="Says “please wait”.">
	<Loader />
	<Loader size={16} />
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
