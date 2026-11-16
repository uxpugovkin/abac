<!--
	JSON PANEL — the raw data of one user, in a panel that slides over the page.

	Figma:  sbertech-habibi → page "abac-r5" → "read-json" (3-1 … 3-5)
	Not built yet: the "Comparison" tab ("compare-json" in Figma) — it is drawn, but disabled.

	Use:
		{#if jsonUser}<JsonDrawer user={jsonUser} onclose={() => (jsonUser = null)} />{/if}

	Props:
		user      one user from data.js
		onclose   called when × is clicked, the dark area is clicked, or Esc is pressed

	The edge of the panel can be dragged to make it wider or narrower.
	The JSON area follows `proto.data` (ready · loading · empty · error).
-->
<script>
	import { Button, Tabs, Segmented, SearchChip, Splitter, Skeleton, EmptyState } from '#lib';
	import { jsonOf, jsonLines } from './data.js';
	import { proto, notify } from './prototype.svelte.js';

	let { user, onclose } = $props();

	const tabs = [
		{ id: 'read', label: 'Read' },
		{ id: 'compare', label: 'Comparison', disabled: true }
	];
	const views = [
		{ value: 'effective', label: 'Effective attributes' },
		{ value: 'domain', label: 'Domain attributes' },
		{ value: 'roles', label: 'Roles and privileges' }
	];

	let tab = $state('read');
	let view = $state('effective');
	let query = $state('');
	let width = $state(840);

	let json = $derived(jsonOf(user)[view]);
	let lines = $derived(jsonLines(json));
	let words = $derived(query.trim().toLowerCase());

	// Does this line contain the search text?
	function found(line) {
		return (
			words &&
			line
				.map((piece) => piece.text)
				.join('')
				.toLowerCase()
				.includes(words)
		);
	}

	// The panel is AFTER the splitter, so it grows when the line moves backwards.
	function resize(pixels) {
		width = Math.min(Math.max(width - pixels, 480), window.innerWidth - 120);
	}

	function copy() {
		navigator.clipboard?.writeText(JSON.stringify(json, null, 2));
		notify('JSON copied', 'success');
	}
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && onclose?.()} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="shade" onclick={onclose}></div>

<div
	class="drawer"
	style:width="{width}px"
	role="dialog"
	aria-modal="true"
	aria-label="JSON of {user.login}"
>
	<Splitter ondrag={resize} label="Resize the JSON panel" />

	<div class="body">
		<header class="head">
			<h2 class="hb-text-h2">JSON <span class="head__dot">•</span> {user.login}</h2>
			<Button mode="ghost" size="m" icon="close" label="Close" onclick={onclose} />
		</header>

		<Tabs {tabs} bind:active={tab} />

		<div class="bar">
			<Segmented options={views} bind:value={view} />
			<Button
				appearance="accent"
				mode="primary"
				icon="download"
				onclick={() => notify('Auth context downloaded', 'success')}>Auth context</Button
			>
		</div>

		<section class="card">
			{#if proto.data === 'loading'}
				<div class="code" aria-busy="true">
					{#each [30, 45, 60, 40, 55, 35, 50, 25] as size}<Skeleton width="{size}%" />{/each}
				</div>
			{:else if proto.data === 'error'}
				<div class="fill"><EmptyState type="error" /></div>
			{:else if proto.data === 'empty'}
				<div class="fill">
					<EmptyState
						type="empty"
						title="No attributes yet"
						description="There is nothing to show as JSON until the first sync."
					/>
				</div>
			{:else}
				<div class="tools">
					<SearchChip bind:value={query} placeholder="Search in JSON" />
					<Button icon="duplicate" label="Copy JSON" onclick={copy} />
				</div>
				<!-- JSON always reads left to right, also on a right-to-left page. -->
				<ol class="code hb-text-code-s hb-scroll" dir="ltr">
					{#each lines as line}
						<li class:found={found(line)}>
							{#each line as piece}<span class="json-{piece.kind}">{piece.text}</span>{/each}
						</li>
					{/each}
				</ol>
			{/if}
		</section>
	</div>
</div>

<style>
	/* The dark area over the page behind the panel. */
	.shade {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: var(--opacity-16);
		backdrop-filter: blur(4px);
	}
	.drawer {
		position: fixed;
		top: 0;
		bottom: 0;
		inset-inline-end: 0;
		z-index: 41;
		display: flex;
		max-width: 100vw;
		background: var(--uncolorful-grey-background);
		border-inline-start: 1px solid var(--uncolorful-grey-border);
	}
	.body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 24px;
	}
	.head,
	.bar,
	.tools {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.bar {
		flex-wrap: wrap;
	}
	.head h2 {
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.head__dot {
		color: var(--uncolorful-grey-disabled);
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
		padding: 8px;
		border-bottom: 1px solid var(--uncolorful-grey-border);
	}
	.fill {
		flex: 1;
		display: grid;
		place-items: center;
	}

	/* The code: numbered lines, long ones scroll sideways. */
	.code {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0;
		margin: 0;
		padding: 8px 0;
		overflow: auto;
		list-style: none;
		counter-reset: line;
	}
	div.code {
		gap: 12px;
		padding: 16px;
	}
	.code li {
		flex: none;
		padding-inline-end: 16px;
		white-space: pre;
		color: var(--uncolorful-grey-primary);
	}
	.code li::before {
		counter-increment: line;
		content: counter(line, decimal-leading-zero);
		display: inline-block;
		width: 52px;
		padding-inline-start: 12px;
		color: var(--uncolorful-grey-tertiary);
	}
	.code li.found {
		background: var(--boring-blue-90);
	}
	.json-key {
		color: var(--shitpile-orange-50);
	}
	.json-value {
		color: var(--uncreative-green-50);
	}
	.json-mark {
		color: var(--uncolorful-grey-tertiary);
	}
</style>
