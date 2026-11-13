<!--
	TABLE GUIDELINES  —  /ds/tables
	Every rule for working with tables, with a live example under it.

	Where things live:
	  - the TEXT of the rules      src/lib/components/table/guidelines.js   (edit rules there)
	  - the EXAMPLES               this file, one snippet per rule, listed in `examples` below
	  - the example table itself   ./TableExample.svelte  (the "Employees" table from Figma)

	To give a rule an example: write a snippet at the bottom of this file and add
	a line to `examples` with the rule's id.
-->
<script>
	import { tableGuidelines } from '#lib/components/table/guidelines.js';
	import { Button, Tabs } from '#lib';
	import TableExample from './TableExample.svelte';
	import AppFrame from './AppFrame.svelte';

	// rule id → the snippet that shows it. Rules without a line here have no example.
	const examples = {
		1.1: anatomy,
		1.2: sorting,
		1.3: wrapAndCut,
		2.1: scrollDown,
		2.2: scrollSideways,
		2.3: scrollBoth,
		3.2: filterTags,
		3.3: searchAll,
		3.4: searchOne,
		3.5: moreFilters,
		4.1: buttonInHeader,
		4.2: buttonInToolbar,
		4.3: iconButton,
		5.1: actionsColumn,
		5.2: actionsFloating,
		5.3: actionsPinned,
		6.1: selectStart,
		6.4: selectAndFilter,
		6.5: selectAndPages
	};

	let tab = $state('a'); // for the "Button placement" examples
	const tabs = [
		{ id: 'a', label: 'Tab A' },
		{ id: 'b', label: 'Tab B' },
		{ id: 'c', label: 'Tab C' }
	];
</script>

<svelte:head>
	<title>Table guidelines · Habibi UI</title>
</svelte:head>

<article class="guide">
	{#each tableGuidelines as chapter}
		<!-- One chapter = one page of the Figma guide: a dark banner, then its rules. -->
		<section class="chapter">
			<header class="hero">
				<h2 class="hb-text-display-b">{chapter.title}</h2>
				<p class="hb-text-body-b">{chapter.about}</p>
			</header>

			{#each chapter.rules as rule}
				<!-- "1.2" → "02". The intro rule of a chapter ("1.0") has no number and a bigger title. -->
				{@const number = rule.id.split('.')[1].padStart(2, '0')}
				{@const isIntro = number === '00'}

				<section class="rule" id="rule-{rule.id}">
					<div class="rule__text">
						{#if !isIntro}<span class="rule__number hb-text-code-s">{number}</span>{/if}
						<h3 class={isIntro ? 'hb-text-h1' : 'hb-text-h3'}>{rule.title}</h3>
						{#each rule.text as line}
							<p class="hb-text-body-b">{line}</p>
						{/each}
						{#if rule.code}
							<p class="rule__code hb-text-body-d">
								<strong>In code:</strong> <code>{rule.code}</code>
							</p>
						{/if}
					</div>

					{#if examples[rule.id]}
						<div class="rule__example">{@render examples[rule.id]()}</div>
					{/if}
				</section>
			{/each}
		</section>
	{/each}
</article>

<!-- ════════════════════════ THE EXAMPLES ════════════════════════
     One snippet per rule, in the order of the rules. -->

<!-- 1. Tables -->
{#snippet anatomy()}
	<TableExample title="Employees" annotate selectable summary maxHeight={230} />
{/snippet}

{#snippet sorting()}
	<TableExample title="Employees" selectable summary maxHeight={300} />
{/snippet}

{#snippet wrapAndCut()}
	<TableExample title="Employees" longTexts selectable summary maxHeight={260} />
{/snippet}

<!-- 2. Scrolling -->
{#snippet scrollDown()}
	<TableExample maxHeight={400} />
{/snippet}

{#snippet scrollSideways()}
	<TableExample wide pinned />
{/snippet}

{#snippet scrollBoth()}
	<TableExample wide pinned selectable maxHeight={400} />
{/snippet}

<!-- 3. Search and filter -->
{#snippet filterTags()}
	<TableExample
		selectable
		shown={['Status', 'Skills', 'Department', 'Office', 'Tetris score']}
		filters={{
			Status: 'Active',
			Skills: 'Go, API, SQL',
			Department: 'Engineering',
			Office: 'Berlin',
			'Tetris score': '> 20,000'
		}}
		minHeight={220}
	/>
{/snippet}

{#snippet searchAll()}
	<TableExample search="Cooper" minHeight={330} />
{/snippet}

{#snippet searchOne()}
	<TableExample
		searchPlaceholder="Search by name"
		search="Cooper"
		minHeight={220}
		maxHeight={220}
	/>
{/snippet}

{#snippet moreFilters()}
	<TableExample title="Employees" filterMenu maxHeight={360} minHeight={360} />
{/snippet}

<!-- 4. Button placement -->
{#snippet buttonInHeader()}
	<AppFrame>
		<div class="page-header">
			<h4 class="hb-text-h2">Page</h4>
			<Button appearance="accent" mode="primary">Add row</Button>
		</div>
		<TableExample narrow maxHeight={330} />
	</AppFrame>
{/snippet}

{#snippet buttonInToolbar()}
	<AppFrame>
		<div class="page-header"><h4 class="hb-text-h2">Page</h4></div>
		<div class="page-tabs"><Tabs {tabs} bind:active={tab} /></div>
		<TableExample narrow maxHeight={300}>
			{#snippet toolbarEnd()}
				<Button icon="overflow" label="More" />
				<Button icon="upload" label="Upload" />
				<Button appearance="accent" mode="primary">Add row</Button>
			{/snippet}
		</TableExample>
	</AppFrame>
{/snippet}

{#snippet iconButton()}
	<AppFrame>
		<div class="page-header"><h4 class="hb-text-h2">Page</h4></div>
		<div class="page-tabs"><Tabs {tabs} bind:active={tab} /></div>
		<TableExample narrow maxHeight={300}>
			{#snippet toolbarEnd()}
				<Button icon="overflow" label="More" />
				<Button icon="upload" label="Upload" />
				<Button appearance="accent" mode="primary" icon="plus" label="Add row" />
			{/snippet}
		</TableExample>
	</AppFrame>
{/snippet}

<!-- 5. Single-row actions -->
{#snippet actionsColumn()}
	<TableExample hide={['office']} actions={['delete']} actionsWidth={48} maxHeight={400} />
{/snippet}

{#snippet actionsFloating()}
	<TableExample
		title="Employees"
		wide
		pinned
		actions={['edit', 'download', 'delete']}
		maxHeight={400}
	/>
{/snippet}

{#snippet actionsPinned()}
	<TableExample wide pinned actions={['delete']} actionsWidth={48} maxHeight={400} />
{/snippet}

<!-- 6. Bulk operations -->
{#snippet selectStart()}
	<TableExample title="Employees" selectable summary maxHeight={330} />
{/snippet}

{#snippet selectAndFilter()}
	<TableExample selectable summary minHeight={330} maxHeight={330} />
{/snippet}

{#snippet selectAndPages()}
	<TableExample title="Employees" selectable paged minHeight={220} />
{/snippet}

<style>
	/* The sizes below are the ones of the Figma guide:
	   a 1216px column; texts are 760px wide and centred in it; examples use the full width. */
	.guide {
		display: flex;
		flex-direction: column;
		gap: 96px;
		max-width: 1216px;
		margin: 0 auto;
	}
	h2,
	h3,
	h4,
	p {
		margin: 0;
	}

	/* ---------- Chapter: banner + rules, 72px apart ---------- */
	.chapter {
		display: flex;
		flex-direction: column;
		gap: 72px;
	}
	.hero {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-height: 200px;
		padding: 36px 40px 40px;
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-primary);
		color: var(--uncolorful-grey-surface);
	}

	/* ---------- One rule: its text, then (24px lower) its example ---------- */
	.rule {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		/* When you jump here from a link, leave room for the sticky top bar. */
		scroll-margin-top: 72px;
	}
	.rule__text {
		position: relative; /* the number hangs off its side */
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		max-width: 760px;
	}
	.rule__text h3 {
		color: var(--uncolorful-grey-extra);
	}
	/* The small "01" sits in the margin, in front of the title. */
	.rule__number {
		position: absolute;
		top: 4px;
		inset-inline-end: calc(100% + 8px);
		color: var(--uncolorful-grey-tertiary);
	}
	.rule__code {
		color: var(--uncolorful-grey-secondary);
	}
	.rule__code code {
		font: var(--text-code-s);
	}

	/* The bordered white box around a whole example. */
	.rule__example {
		width: 100%;
		padding: 16px;
		border: 1px solid var(--uncolorful-grey-border);
		border-radius: var(--radius-l);
		background: var(--uncolorful-grey-surface);
		overflow: hidden; /* keeps the app-window examples inside the rounded corners */
	}

	/* ---------- Bits of the fake pages in "Button placement" ---------- */
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 32px;
		margin-bottom: 16px;
		color: var(--uncolorful-grey-extra);
	}
	.page-tabs {
		margin-bottom: 16px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
		/* Tabs sit 24px apart on this page, as in Figma. */
		--tabs-gap: 24px;
	}
</style>
