<!--
	COMPARE VIEW — the result of comparing two JSONs: the differences, or each side whole.
	Used for "user against user" (JSON panel → Comparison) and for two snapshots of one user.

	Figma:  sbertech-habibi → page "abac-r5" → "compare-json" (3-6 … 3-8)
	        and "domain-history-option-a" (4-2 … 4-4)
	Local to the ABAC prototype.

	Use:
		<CompareView
			state="diff"
			rows={userDiff(userA, userB)}
			labels={{ a: 'A: walker85@acme.corp', b: 'B: const.b.e@acme.corp' }}
			marks={{ a: 'A', b: 'B' }}
		/>

	Props:
		state     what to show:
		            "loading"   grey bars
		            "diff"      the differences
		            "same"      "No differences found" (the two sides can still be read)
		            "nothing"   "Nothing to compare" — one side has no content
		            "error"     the comparison failed
		rows      the result, as written in data.js (userDiff, snapshotDiff)
		labels    { a, b }  the names of the two sides in the switch
		marks     { a, b }  the sign in front of a line only that side has.  Default A and B
		texts     { same, nothing }  the explanations of the two empty states

	It only shows. Choosing what to compare, and waiting for it, is up to the panel around it.

	The colours of a difference:
		orange   the value is different     "~"   old value crossed out → new value
		red      only side A has the line
		purple   only side B has the line   (green in the light and dark themes)
-->
<script>
	import { Button, Segmented, SearchChip, Skeleton, EmptyState } from '#lib';
	import { diffLines, sideLines } from './data.js';
	import { notify } from './prototype.svelte.js';
	import JsonText from './JsonText.svelte';

	let {
		state: status = 'diff',
		rows = [],
		labels = { a: 'A', b: 'B' },
		marks = { a: 'A', b: 'B' },
		texts = {}
	} = $props();

	let view = $state('diff'); // 'diff' | 'a' | 'b'
	let query = $state('');

	let views = $derived([
		{ value: 'diff', label: 'Difference' },
		{ value: 'a', label: labels.a },
		{ value: 'b', label: labels.b }
	]);

	let lines = $derived(diffLines(rows));
	// With no differences both sides are the same JSON: side A of the result.
	let side = $derived(sideLines(rows, status === 'same' ? 'a' : view));
	let words = $derived(query.trim().toLowerCase());

	const number = (value) => (value ? String(value).padStart(2, '0') : '');
	const found = (text) => words && text.toLowerCase().includes(words);

	function copyLink() {
		navigator.clipboard?.writeText(location.href);
		notify('Link to this comparison copied', 'success');
	}
</script>

{#if status === 'nothing'}
	<!-- Figma 3-8 / 4-4: no card at all, only the message. -->
	<div class="fill">
		<EmptyState
			type="maintenance"
			title="Nothing to compare"
			description={texts.nothing ?? 'One of the sides has no content'}
		/>
	</div>
{:else if status === 'error'}
	<div class="fill">
		<EmptyState
			type="error"
			title="Couldn't compare"
			description="The comparison did not finish. Try again in a moment."
		/>
	</div>
{:else}
	<section class="card">
		<div class="tools">
			<Segmented options={views} bind:value={view} />
			<span class="tools__end">
				<SearchChip bind:value={query} placeholder="Search in JSON" />
				<Button icon="link" label="Copy link" onclick={copyLink} />
			</span>
		</div>

		{#if status === 'loading'}
			<div class="bars" aria-busy="true">
				{#each [8, 40, 50, 35, 30, 48, 42, 52, 8, 45, 55, 28, 34, 30, 8, 38] as size, index}
					<Skeleton width="{size}%" />
				{/each}
			</div>
		{:else if view === 'diff' && status === 'same'}
			<div class="fill">
				<EmptyState
					type="not-found"
					title="No differences found"
					description={texts.same ?? 'Try another pair to compare'}
				/>
			</div>
		{:else if view === 'diff'}
			<!-- JSON always reads left to right, also on a right-to-left page. -->
			<ol class="code hb-text-code-s hb-scroll" dir="ltr">
				{#each lines as line}
					<li
						class="line line--{line.kind}"
						class:found={found(line.text + (line.old ?? '') + (line.now ?? ''))}
					>
						<span class="num">{number(line.a)}</span>
						<span class="num">{number(line.b)}</span>
						<span class="mark"
							>{line.kind === 'change'
								? '~'
								: line.kind === 'a'
									? marks.a
									: line.kind === 'b'
										? marks.b
										: ''}</span
						>
						{#if line.kind === 'skip'}
							<span class="text">{line.text}</span>
						{:else if line.kind === 'change'}
							<span class="text"
								><JsonText text={line.text} /><s>{line.old}</s> →
								<span class="now">{line.now}</span>{line.end}</span
							>
						{:else}
							<span class="text"><JsonText text={line.text} /></span>
						{/if}
					</li>
				{/each}
			</ol>
		{:else}
			<ol class="code hb-text-code-s hb-scroll" dir="ltr">
				{#each side as text, index}
					<li class="line" class:found={found(text)}>
						<span class="num">{number(index + 1)}</span>
						<span class="text"><JsonText {text} /></span>
					</li>
				{/each}
			</ol>
		{/if}
	</section>
{/if}

<style>
	.fill {
		flex: 1;
		display: grid;
		place-items: center;
	}
	.card {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-m);
		background: var(--uncolorful-grey-surface);
	}
	.tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 8px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
	}
	.tools__end {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.bars {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
	}

	/* The code: numbered lines; long ones scroll sideways. */
	.code {
		flex: 1;
		margin: 0;
		padding: 8px 0;
		overflow: auto;
		list-style: none;
	}
	.line {
		display: flex;
		min-width: max-content;
		padding-inline-end: 16px;
		white-space: pre;
		color: var(--uncolorful-grey-primary);
	}
	.num {
		flex: none;
		width: 32px;
		padding-inline-start: 12px;
		color: var(--uncolorful-grey-tertiary);
	}
	.mark {
		flex: none;
		width: 44px;
		text-align: center;
	}
	.text {
		padding-inline-start: 12px;
	}

	/* A value that differs: orange, the old value crossed out. */
	.line--change {
		background: var(--shitpile-orange-90);
	}
	.line--change .mark,
	.line--change .now {
		color: var(--shitpile-orange-50);
	}
	.line--change s {
		color: var(--uncolorful-grey-tertiary);
	}
	/* A line only side A has. */
	.line--a {
		background: var(--traffic-light-red-90);
	}
	.line--a .mark {
		color: var(--traffic-light-red-50);
	}
	/* A line only side B has. */
	.line--b {
		background: var(--uncreative-green-90);
	}
	.line--b .mark {
		color: var(--uncreative-green-50);
	}
	/* Unchanged lines, folded. */
	.line--skip {
		color: var(--uncolorful-grey-tertiary);
	}
	/* A line the search found. */
	.found {
		box-shadow: inset 3px 0 0 var(--boring-blue-50);
	}
</style>
