/*
	The columns of the "Employees" table that all examples on the guidelines page share.
	(Guide only — a real page simply writes its own `columns` list.)
	The column names are in ../content.js.
*/

import { content } from '../content.js';
import { pick } from '../examples.svelte.js';

/*
	Column widths, by column key.
	  normal     shares of the table width, close to Figma (260 of 1184px = 22%…).
	             The table fills the example box. Skills has no width: it takes what is left.
	  longTexts  the "wrap and cut" example: a slimmer first column, so its long texts wrap
	  wide       px, exactly as in Figma: wider than the box, so the table scrolls sideways
*/
export const columnWidths = {
	normal: { fullName: '22%', status: '10%', department: '14%', office: '12%', score: '18%' },
	longTexts: { fullName: '19%', status: '11%', department: '13%', office: '15%', score: '22%' },
	wide: { fullName: 260, status: 130, skills: 300, department: 240, office: 240, score: 260 }
};

/* The columns, named in the current examples language, with one set of widths filled in. */
export function columnsWith(widths) {
	const names = pick(content.tables.columns);
	return [
		{ key: 'fullName', label: names.fullName, sortable: true },
		{ key: 'status', label: names.status, sortable: true },
		{ key: 'skills', label: names.skills },
		{ key: 'department', label: names.department, sortable: true },
		{ key: 'office', label: names.office, sortable: true },
		{ key: 'score', label: names.score, sortable: true, align: 'end' }
	].map((column) => ({ ...column, width: widths[column.key] }));
}
