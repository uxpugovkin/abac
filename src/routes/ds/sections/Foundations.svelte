<!-- DOCS: colours, text styles, icons, radius and shadows. -->
<script>
	import { Icon, iconNames, Tooltip } from '#lib';
	import Demo from '../Demo.svelte';

	// The colour groups, as in Figma. Each name is a CSS variable: var(--name).
	const steps = ['90', '80', '70', '60', '50', '40'];
	const colourGroups = [
		{
			title: 'uncolorful-grey — text, lines, backgrounds',
			names: [
				'extra',
				'primary',
				'secondary',
				'tertiary',
				'disabled',
				'border',
				'background',
				'surface'
			].map((step) => `uncolorful-grey-${step}`)
		},
		{ title: 'boring-blue — main actions', names: steps.map((step) => `boring-blue-${step}`) },
		{
			title: 'traffic-light-red — danger',
			names: steps.map((step) => `traffic-light-red-${step}`)
		},
		{ title: 'shitpile-orange — warnings', names: steps.map((step) => `shitpile-orange-${step}`) },
		{ title: 'uncreative-green — success', names: steps.map((step) => `uncreative-green-${step}`) },
		{
			title: 'accent — charts, markers, badges',
			names: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `accent-${n}`)
		}
	];

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
	{#each colourGroups as group}
		<div>
			<div class="hb-text-body-d-bold label">{group.title}</div>
			<div class="swatches">
				{#each group.names as name}
					<div class="swatch">
						<div class="swatch__colour" style="background: var(--{name})"></div>
						<code class="hb-text-code-s">--{name}</code>
					</div>
				{/each}
			</div>
		</div>
	{/each}
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
	.label {
		margin-bottom: 8px;
		color: var(--uncolorful-grey-secondary);
	}
	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 8px;
	}
	.swatch__colour {
		height: 48px;
		border-radius: var(--radius-m);
		box-shadow: inset 0 0 0 1px var(--opacity-16);
	}
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
