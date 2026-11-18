<!--
	CODE — a text shown as code: numbered lines and colours. Read only.
	Used by the editor, the side panels and the test details.

	Figma:  sbertech-habibi → page "rego-playground" → "Code" (Gutter + Code-Area)
	Local to the playground.

	Use:
		<Code text={policy} language="rego" />
		<Code text="" placeholder="### Enter content" />  ← nothing yet: one line in the value colour

	Props:
		text          the code
		language      "rego" | "json".  Default "json"
		placeholder   shown on line 01 while `text` is empty

	The colours, as in Figma:
		rego   keywords red · comments grey · numbers, true, false purple ·
		       input.… and built-ins blue · names dark grey · brackets and commas grey
		json   keys orange · strings dark · numbers, true, false, null purple · brackets grey.
		       A line that starts with a letter is a title (e.g. "Obligations (obligations)"): grey
-->
<script>
	let { text = '', language = 'json', placeholder = '' } = $props();

	let lines = $derived(text ? text.split('\n') : [placeholder]);
	// ---------- Colours: one line → pieces of { text, kind } ----------

	const keywords = [
		'package',
		'import',
		'default',
		'if',
		'some',
		'in',
		'contains',
		'every',
		'not',
		'with',
		'as',
		'else'
	];
	const builtIns = ['count', 'sum', 'max', 'min', 'startswith', 'endswith'];

	function colour(line) {
		return language === 'rego' ? colourRego(line) : colourJson(line);
	}

	function colourRego(line) {
		// comment | string | spaces | bracket or comma | word (may have dots) | any other sign
		const piece = /(#.*)|("(?:[^"\\]|\\.)*")|(\s+)|([{}()[\],])|([\w.]+)|(\S)/g;

		return [...line.matchAll(piece)].map(([text, comment, string, space, mark, word]) => {
			if (comment) return { text, kind: 'comment' };
			if (string) return { text, kind: 'string' };
			if (space) return { text, kind: 'space' };
			if (mark) return { text, kind: 'mark' };
			if (word && keywords.includes(word)) return { text, kind: 'keyword' };
			if (word && /^(true|false|null|\d+)$/.test(word)) return { text, kind: 'value' };
			if (word && (word.startsWith('input.') || builtIns.includes(word)))
				return { text, kind: 'ref' };
			return { text, kind: 'name' };
		});
	}

	function colourJson(line) {
		if (/^[A-Za-z]/.test(line)) return [{ text: line, kind: 'comment' }];

		// "key": | "string" | true, false, null, numbers | bracket, comma, colon | spaces | anything else
		const piece =
			/("(?:[^"\\]|\\.)*")(\s*:)?|true|false|null|-?\d+(?:\.\d+)?|[{}[\],:]|\s+|[^\s"{}[\],:]+/g;

		return [...line.matchAll(piece)].flatMap(([text, quoted, colon]) => {
			if (colon)
				return [
					{ text: quoted, kind: 'key' },
					{ text: colon, kind: 'mark' }
				];
			if (quoted) return [{ text, kind: 'string' }];
			if (/^\s+$/.test(text)) return [{ text, kind: 'space' }];
			if (/^[{}[\],:]$/.test(text)) return [{ text, kind: 'mark' }];
			return [{ text, kind: 'value' }];
		});
	}
</script>

<!-- Code always reads left to right, also on a right-to-left page. -->
<ol class="code hb-text-code-s" dir="ltr">
	{#each lines as line, index (index)}
		<li>
			{#if text}
				{#each colour(line) as piece}<span class="c-{piece.kind}">{piece.text}</span>{/each}
			{:else}
				<span class="c-value">{line}</span>
			{/if}
		</li>
	{/each}
</ol>

<style>
	/* Numbered lines; a long line scrolls sideways with the whole panel. */
	.code {
		margin: 0;
		padding: 8px 0;
		list-style: none;
		counter-reset: line;
		color: var(--uncolorful-grey-primary);
	}
	.code li {
		min-width: max-content;
		min-height: 20px;
		padding-inline-end: 12px;
		white-space: pre;
		tab-size: 2;
	}
	/* The gutter: 40px, the number right-aligned, 12px of room on both sides. */
	.code li::before {
		counter-increment: line;
		content: counter(line, decimal-leading-zero);
		display: inline-block;
		width: 40px;
		padding: 0 12px;
		margin-inline-end: 12px;
		box-sizing: border-box;
		text-align: end;
		color: var(--uncolorful-grey-tertiary);
	}

	.c-keyword {
		color: var(--traffic-light-red-50);
	}
	.c-comment,
	.c-mark {
		color: var(--uncolorful-grey-tertiary);
	}
	.c-value {
		color: var(--uncreative-green-50);
	}
	.c-ref {
		color: var(--boring-blue-50);
	}
	.c-name {
		color: var(--uncolorful-grey-secondary);
	}
	.c-key {
		color: var(--shitpile-orange-50);
	}
</style>
