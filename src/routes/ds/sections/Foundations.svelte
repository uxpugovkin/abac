<!-- DOCS: colours, text styles, icons, radius and shadows. -->
<script>
	import { Icon, iconNames, Tooltip } from '#lib';
	import Demo from '../Demo.svelte';
	import ColourPalette from '../ColourPalette.svelte';

	const textStyles = [
		'display-b',
		'h1',
		'h2',
		'h3',
		'body-a',
		'body-a-bold',
		'body-b',
		'body-b-bold',
		'body-c',
		'body-c-bold',
		'body-d',
		'body-d-bold',
		'body-e',
		'body-e-bold',
		'code-s'
	];

	const radii = ['xs', 's', 'm', 'l', 'full'];
	const shadows = ['default-s', 'default-l'];
</script>

<Demo
	fixed
	title="Colours"
	figma="colour"
	about="Use them in CSS as var(--name). The values change with the theme — try the switcher at the top."
	column
>
	<ColourPalette />
</Demo>

<Demo
	fixed
	title="Typography"
	figma="typo"
	about="Add the class to any text, or use font: var(--text-…) in CSS."
	column
>
	{#each textStyles as style}
		<div class="type-row">
			<code class="hb-text-code-s">.hb-text-{style}</code>
			<span class="hb-text-{style}">The quick brown fox</span>
		</div>
	{/each}
</Demo>

<Demo
	fixed
	title="Icons"
	figma="icons"
	about={`${iconNames.length} icons. Hover one to see its name.  <Icon name="search" />`}
>
	<div class="icons">
		{#each iconNames as name}
			<Tooltip text={name}><span class="icon-cell"><Icon {name} /></span></Tooltip>
		{/each}
	</div>
</Demo>

<Demo
	fixed
	title="Radius and shadows"
	figma="variables + effect styles"
	about="var(--radius-…) and var(--shadow-…)"
>
	{#each radii as radius}
		<div class="box" style="border-radius: var(--radius-{radius})">
			<code class="hb-text-code-s">--radius-{radius}</code>
		</div>
	{/each}
	{#each shadows as shadow}
		<div class="box box--shadow" style="box-shadow: var(--shadow-{shadow})">
			<code class="hb-text-code-s">--shadow-{shadow}</code>
		</div>
	{/each}
</Demo>

<style>
	code {
		color: var(--uncolorful-grey-secondary);
	}
	.type-row {
		display: flex;
		align-items: baseline;
		gap: 24px;
	}
	.type-row code {
		flex: none;
		width: 180px;
	}
	.icons {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.icon-cell {
		display: flex;
		padding: 8px;
		border-radius: var(--radius-m);
	}
	.icon-cell:hover {
		background: var(--uncolorful-grey-border);
	}
	.box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 140px;
		height: 72px;
		background: var(--uncolorful-grey-border);
	}
	.box--shadow {
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-surface);
	}
</style>
