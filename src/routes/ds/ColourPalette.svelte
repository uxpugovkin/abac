<!--
	COLOUR PALETTE — a helper used only by the docs page (the "Colours" block).
	Figma: habibi-library → page "colour" → frame "light"

	Five columns, one per colour family. Each tile is painted with its token and
	shows its step and its HSL. The 50 tile (for the greys: primary) is the big one
	with the family name, and it stretches to fill the column.

	The HSL is read from the live token value, so it is right in every theme.
	The accent colours are left out on purpose, as in Figma.

	The palette stretches with the page, between a min and a max width.
	On a narrower screen it scrolls sideways instead of squeezing.
-->
<script>
	// The four colour families: each has the steps 40…90, the 50 is the big tile.
	// Dark tiles (40, 50, 60) get the light 90 text; light tiles (70, 80, 90) get the dark 40 text.
	const families = [
		{ title: 'Boring Blue', token: 'boring-blue' },
		{ title: 'Uncreative Green', token: 'uncreative-green' },
		{ title: 'Traffic Light Red', token: 'traffic-light-red' },
		{ title: 'Shitpile Orange', token: 'shitpile-orange' }
	];

	function familyTiles(token) {
		return ['40', '50', '60', '70', '80', '90'].map((step) => ({
			name: `${token}-${step}`,
			step,
			text: Number(step) <= 60 ? `${token}-90` : `${token}-40`,
			big: step === '50'
		}));
	}

	// The greys have their own text colour per tile, as in Figma.
	const greyTiles = [
		{ step: 'extra', text: 'disabled' },
		{ step: 'primary', text: 'disabled', title: 'surface', big: true },
		{ step: 'secondary', text: 'extra' },
		{ step: 'tertiary', text: 'primary' },
		{ step: 'disabled', text: 'primary' },
		{ step: 'border', text: 'primary' },
		{ step: 'background', text: 'primary' },
		{ step: 'surface', text: 'primary', outlined: true } // white on white: needs a line
	].map((tile) => ({
		...tile,
		name: `uncolorful-grey-${tile.step}`,
		text: `uncolorful-grey-${tile.text}`,
		title: tile.title && `uncolorful-grey-${tile.title}`
	}));

	const columns = [
		...families.map((family) => ({ title: family.title, tiles: familyTiles(family.token) })),
		{ title: 'Uncolorful Stuff', tiles: greyTiles }
	];

	/* ---------- HSL of every tile, read from the page ----------
	   hsl looks like { 'boring-blue-50': { h: 220, s: 88, l: 45 }, … }
	   It is read again whenever the theme switcher changes data-theme on <html>. */
	let hsl = $state({});

	function readColours() {
		const style = getComputedStyle(document.documentElement);
		const result = {};
		for (const column of columns) {
			for (const tile of column.tiles) {
				result[tile.name] = hexToHsl(style.getPropertyValue(`--${tile.name}`).trim());
			}
		}
		hsl = result;
	}

	$effect(() => {
		readColours();
		const watcher = new MutationObserver(readColours);
		watcher.observe(document.documentElement, { attributeFilter: ['data-theme'] });
		return () => watcher.disconnect();
	});

	// '#0e50d7' → { h: 220, s: 88, l: 45 }   (the usual formula, rounded like Figma)
	function hexToHsl(hex) {
		const r = parseInt(hex.slice(1, 3), 16) / 255;
		const g = parseInt(hex.slice(3, 5), 16) / 255;
		const b = parseInt(hex.slice(5, 7), 16) / 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const range = max - min;
		const l = (max + min) / 2;

		let h = 0;
		let s = 0;
		if (range > 0) {
			s = range / (1 - Math.abs(2 * l - 1));
			if (max === r) h = 60 * (((g - b) / range + 6) % 6);
			else if (max === g) h = 60 * ((b - r) / range + 2);
			else h = 60 * ((r - g) / range + 4);
		}
		return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
	}
</script>

<div class="scroller">
	<div class="palette">
		{#each columns as column}
			<div class="column">
				{#each column.tiles as tile}
					{@const value = hsl[tile.name]}
					<div
						class="tile"
						class:tile--big={tile.big}
						class:tile--outlined={tile.outlined}
						style="background: var(--{tile.name}); color: var(--{tile.text})"
						title="var(--{tile.name})"
					>
						{#if tile.big}
							<span class="hb-text-h2" style:color={tile.title && `var(--${tile.title})`}>
								{column.title}
							</span>
						{/if}
						<span class="hb-text-body-b">{tile.step}</span>
						{#if value}
							<span class="hb-text-body-e hsl">
								<span>H{value.h}</span><span>S{value.s}</span><span>L{value.l}</span>
							</span>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	/* Narrower than the min width: scroll sideways instead of squeezing the columns. */
	.scroller {
		overflow-x: auto;
	}

	/* Five equal columns that stretch with the page, between a min and a max width. */
	.palette {
		display: flex;
		gap: 12px;
		min-width: 880px;
		max-width: 1440px;
		height: 800px;
	}
	.column {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.tile {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 16px;
		border-radius: var(--radius-m);
	}
	/* The 50 tile takes all the height that is left. */
	.tile--big {
		flex: 1;
		padding-block: 20px;
	}
	.tile--outlined {
		box-shadow: inset 0 0 0 1px var(--uncolorful-grey-border);
	}

	.hsl {
		display: flex;
		gap: 8px;
	}
</style>
