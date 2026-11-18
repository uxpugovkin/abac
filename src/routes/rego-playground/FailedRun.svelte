<!--
	FAILED RUN — "Failed to execute the policy", how many problems of each kind,
	and a button to the Problems tab. Shown in the Result tab when a run fails,
	in both modes.

	Figma:  sbertech-habibi → page "rego-playground" → "execution-failed"
	        (screens 04-rego-playground-failed-run, 08-testing-7-failed-run)
	Local to the playground.

	Use:
		<FailedRun groups={problems} ongo={() => (tab = 'problems')} />

	Props:
		groups   the problems, grouped (see `problems` and `runProblems` in data.js)
		ongo     called when "Go to problems" is clicked
-->
<script>
	import { Button, Tag } from '#lib';
	import Message from './Message.svelte';

	let { groups = [], ongo } = $props();

	let items = $derived(groups.flatMap((group) => group.items));

	function count(kind) {
		return items.filter((item) => item.kind === kind).length;
	}
</script>

<Message text="Failed to execute the policy">
	<div class="tags">
		<Tag colour="error" icon="wrong">Compilation error — {count('compile')}</Tag>
		<Tag colour="error" icon="wrong">Linter error — {count('error')}</Tag>
		<Tag colour="warning" icon="warning">Linter warning — {count('warning')}</Tag>
	</div>
	<Button appearance="accent" mode="ghost" onclick={ongo}>Go to problems</Button>
</Message>

<style>
	.tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px;
		max-width: 360px;
	}
</style>
