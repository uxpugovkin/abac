/*
	EXAMPLES LANGUAGE — docs pages only.

	The docs are written in English, left to right. Only the EXAMPLES (the boxes
	that show components) can switch to Arabic, right to left. The switch in the
	top bar changes `examples.lang`; every example box reads it.

	Use in a docs file:
		import { examples, directionOf, pick } from '../examples.svelte.js';
		import { content } from '../content.js';

		const t = pick(content.forms);      // the texts in the current language
		…
		<TextInput label={t.login} />

	The docs pages re-create all examples when the language changes (see the
	{#key} blocks), so reading the texts once at the start is enough.
*/

// The one shared setting. 'en' or 'ar'.
export const examples = $state({ lang: 'en' });

// Which way each language is written.
const directions = { en: 'ltr', ar: 'rtl' };

/** 'ltr' or 'rtl' for a language. */
export function directionOf(lang) {
	return directions[lang];
}

/**
 * Takes texts written as { en: '…', ar: '…' } (at any depth, in lists too)
 * and gives back the same shape with only the current language left.
 *
 *   pick({ save: { en: 'Save', ar: 'حفظ' } })   →   { save: 'Save' }   (or 'حفظ')
 */
export function pick(value, lang = examples.lang) {
	if (Array.isArray(value)) return value.map((item) => pick(item, lang));
	if (value && typeof value === 'object') {
		if ('en' in value) return value[lang] ?? value.en; // a text in both languages
		return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, pick(item, lang)]));
	}
	return value; // numbers, true/false, functions: the same in every language
}
