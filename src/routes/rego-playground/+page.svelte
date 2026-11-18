<!--
	REGO PLAYGROUND PROTOTYPE  —  /rego-playground
	Flow Designer's sandbox for a Rego policy: write the policy, give it an input,
	run it and see the decision — or run its tests and see which ones fail.

	Two modes (the switch in the toolbar):
		Execution   the input ("Auth context", "Data"; "Add from fixtures" fills it),
		            "Run", then the decision: Allow or Deny, with what came with it
		Testing     "Project tests" or "Policy tests", then the list of tests (a click opens
		            one test), or — when the policy did not compile — its problems

	Nothing is really run: every answer is made up (data.js), and the little
	"Prototype states" panel picks which one you get. The file tabs and the file tree
	lead nowhere: the editor always shows policy.rego.

	Figma:  sbertech-habibi → page "rego-playground"
	        https://www.figma.com/design/OKwPuNTKnQ3p99F03r9MyG/sbertech-habibi?node-id=3050-4787

	The pieces (all in this folder):
		Sidebar.svelte        the side menu of Flow Designer
		FileTree.svelte       the folders and files, with a search
		Editor.svelte         policy.rego as code
		ContextPanel.svelte   the input: Auth context, Data, Add from fixtures
		ResultPanel.svelte    what "Run" answered (Execution)
		TestsPanel.svelte     what a test run answered (Testing)
		ProblemsList.svelte   the problems of a failed test run
		TestDetails.svelte    one test, in a panel over the page
		Panel.svelte          a white area with a header — the editor and every side panel
		Code.svelte           code with numbered lines and colours
		Message.svelte        a short grey text in the middle of an empty panel
		StatePanel.svelte     the tiny panel that switches answers and themes
		prototype.svelte.js   what that panel switches (`proto`), and the short messages
		data.js               the made-up files, policy, input, answers, tests and problems

	This page holds the layout, the toolbar, and what has been run.
	Everything is built from the design system (#lib); nothing here fetches data.
-->
<script>
	import { Button, Checkbox, Loader, Notification, Segmented, Splitter, Tabs } from '#lib';
	import { openFiles, results } from './data.js';
	import { proto, notify } from './prototype.svelte.js';
	import Sidebar from './Sidebar.svelte';
	import FileTree from './FileTree.svelte';
	import Editor from './Editor.svelte';
	import ContextPanel from './ContextPanel.svelte';
	import ResultPanel from './ResultPanel.svelte';
	import TestsPanel from './TestsPanel.svelte';
	import TestDetails from './TestDetails.svelte';
	import StatePanel from './StatePanel.svelte';

	const modes = [
		{ value: 'execution', label: 'Execution' },
		{ value: 'testing', label: 'Testing' }
	];

	let mode = $state('execution'); // "execution" | "testing"
	let fileTab = $state('policy'); // the open file tab (leads nowhere)
	let coverage = $state(true);
	let input = $state(''); // the Auth context, as text

	let running = $state(''); // what is running now: "run" | "project" | "policy" | ''
	let executed = $state(false); // true once "Run" has finished
	let tested = $state(false); // true once a test run has finished
	let openTest = $state(null); // the test whose details are open

	// The answers come from the state panel, so switching it changes them right away.
	let result = $derived(executed ? { decision: proto.decision, ...results[proto.decision] } : null);
	let testRun = $derived(tested ? proto.tests : null);

	// The widths that the splitters change.
	let filesWidth = $state(228);
	let editorWidth = $state(380);

	function limit(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	// Pretends to run: the button spins for a moment, then the answer shows.
	// While something runs, the run buttons do nothing.
	function run(what) {
		if (running) return;
		running = what;
		setTimeout(() => {
			running = '';
			if (what === 'run') executed = true;
			else tested = true;
		}, 1200);
	}

	// Theme and direction go onto <html>, so every component follows (see the README).
	// When the person leaves the prototype, the site gets its own look back.
	$effect(() => {
		const html = document.documentElement;
		html.dataset.theme = proto.theme;
		html.dir = proto.rtl ? 'rtl' : 'ltr';
		return () => {
			delete html.dataset.theme;
			html.removeAttribute('dir');
		};
	});
</script>

<svelte:head>
	<title>Rego playground — Habibi UI prototype</title>
</svelte:head>

<div class="app">
	<Sidebar />
	<FileTree width={filesWidth} />
	<Splitter
		label="Resize the file tree"
		ondrag={(pixels) => (filesWidth = limit(filesWidth + pixels, 160, 480))}
	/>

	<main class="content">
		<div class="file-tabs">
			<Tabs tabs={openFiles} bind:active={fileTab} />
		</div>

		<div class="toolbar">
			<Button mode="primary" iconEnd="chevron-down" onclick={() => notify('Saved', 'success')}>
				Save
			</Button>
			<Segmented options={modes} bind:value={mode} />
			<span class="toolbar__gap"></span>

			{#if mode === 'execution'}
				<Checkbox bind:checked={coverage}>Coverage</Checkbox>
				<Button
					appearance="accent"
					mode="primary"
					icon={running === 'run' ? '' : 'play'}
					class="toolbar__run"
					onclick={() => run('run')}
				>
					{#if running === 'run'}<Loader size={20} label="Running" />{:else}Run{/if}
				</Button>
			{:else}
				<Button
					icon={running === 'project' ? '' : 'play'}
					class="toolbar__run"
					onclick={() => run('project')}
				>
					{#if running === 'project'}<Loader size={20} label="Running" />{:else}Project tests{/if}
				</Button>
				<Button
					appearance="accent"
					mode="primary"
					icon={running === 'policy' ? '' : 'play'}
					class="toolbar__run"
					onclick={() => run('policy')}
				>
					{#if running === 'policy'}<Loader size={20} label="Running" />{:else}Policy tests{/if}
				</Button>
			{/if}
		</div>

		<div class="workspace">
			<div class="editor" style:width="{editorWidth}px">
				<Editor />
			</div>
			<Splitter
				label="Resize the editor"
				ondrag={(pixels) => (editorWidth = limit(editorWidth + pixels, 240, 720))}
			/>
			<div class="side">
				{#if mode === 'execution'}
					<div class="side__context">
						<ContextPanel bind:input />
					</div>
					<div class="side__line"></div>
					<ResultPanel {result} />
				{:else}
					<TestsPanel run={testRun} onopen={(test) => (openTest = test)} />
				{/if}
			</div>
		</div>
	</main>
</div>

{#if openTest}
	<TestDetails test={openTest} onclose={() => (openTest = null)} />
{/if}

{#if proto.toast}
	<div class="toast"><Notification type={proto.toast.type}>{proto.toast.text}</Notification></div>
{/if}

<StatePanel />

<style>
	/* The service fills the window; only the panels inside scroll. */
	.app {
		display: flex;
		height: 100vh;
		overflow: hidden;
	}
	.content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-block: 8px;
		padding-inline: 4px 8px;
	}
	.file-tabs {
		padding-top: 4px;
	}
	.toolbar {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.toolbar__gap {
		flex: 1;
	}
	/* While it spins, a run button keeps the width it had with its text. */
	.toolbar :global(.toolbar__run) {
		min-width: 67px;
	}
	/* The spinner takes the button's text colour (it is blue by default — invisible on blue). */
	.toolbar :global(.toolbar__run .hb-loader) {
		color: inherit;
	}
	.workspace {
		flex: 1;
		min-height: 0;
		display: flex;
	}
	.editor {
		flex: none;
		display: flex;
	}
	.side {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	/* Auth context keeps 200px; the result takes the rest. */
	.side__context {
		flex: none;
		height: 200px;
		display: flex;
	}
	.side__line {
		flex: none;
		height: 2px;
		background: var(--uncolorful-grey-border);
	}
	/* Short messages: bottom centre, above everything. */
	.toast {
		position: fixed;
		bottom: 16px;
		left: 50%;
		z-index: 90;
		transform: translateX(-50%);
	}
</style>
