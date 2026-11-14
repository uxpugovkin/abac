// Made-up people for the table examples on the docs pages.
// The same data as the examples in Figma (habibi-library → Tables Guide).
//
// The data itself has no words, only ids ('jane', 'engineering', 'berlin'…):
// what they are called in English or Arabic is in content.js.
// That way search, filters and sorting work the same in both languages.

import { content } from './content.js';
import { pick } from './examples.svelte.js';

//  person      status    skills                  department     office    Tetris score
const people = [
	['jane', 'active', ['Go', 'API', 'SQL'], 'engineering', 'berlin', 20312632728],
	['wade', 'active', ['UX', 'UI', 'Web'], 'design', 'lisbon', 2256632728],
	['esther', 'active', ['Go', 'Rust', 'Ops'], 'engineering', 'berlin', 2256632728],
	['cameron', 'active', ['SQL', 'BI', 'ML'], 'analytics', 'dubai', 96632728],
	['brooklyn', 'active', ['Java', 'Go', 'SQL'], 'engineering', 'berlin', 96632728],
	['leslie', 'active', ['Ops', 'API', 'QA'], 'security', 'lisbon', 8632728],
	['jenny', 'active', ['Go', 'API', 'Web'], 'engineering', 'dubai', 8632728],
	['guy', 'active', ['Go', 'Ops', 'API'], 'engineering', 'berlin', 632728],
	['robert', 'active', ['UI', 'iOS', 'Web'], 'design', 'berlin', 632728],
	['jacob', 'active', ['Data', 'ML', 'SQL'], 'analytics', 'lisbon', 24728],
	['kristin', 'active', ['QA', 'Go', 'API'], 'engineering', 'berlin', 24728],
	['cody', 'active', ['Ops', 'API', 'Go'], 'security', 'dubai', 2728],
	['savannah', 'active', ['BI', 'Data', 'SQL'], 'analytics', 'berlin', 2728],
	['devon', 'active', ['SQL', 'BI'], 'analytics', 'berlin', 728]
];

// The photos: ./faces/staff-00.png … staff-14.png (from the Figma file), in the same
// order as the people above. `import.meta.glob` asks the build tool for their addresses.
const photoFiles = import.meta.glob('./faces/*.png', { eager: true, import: 'default' });
export const photos = Object.keys(photoFiles)
	.sort()
	.map((name) => photoFiles[name]);

/**
 * The people as table rows, with their words in the current examples language.
 * `id` must be unique: the Table tells rows apart by it.
 * The ids stay next to the words (`officeId`…), for the filters.
 */
export function getEmployees() {
	const names = pick(content.people);
	const departments = pick(content.departments);
	const offices = pick(content.offices);
	const statuses = pick(content.statuses);

	return people.map(([person, status, skills, department, office, score], index) => ({
		id: index + 1,
		fullName: names[person],
		status: statuses[status],
		statusId: status,
		skills,
		department: departments[department],
		departmentId: department,
		office: offices[office],
		officeId: office,
		score,
		photo: photos[index]
	}));
}

// Which Tag colour each status gets (by status id).
export const statusColour = { active: 'success', onLeave: 'warning', blocked: 'error' };

// 20312632728 → "20,312,632,728.00" (digits 0–9 in both languages)
export function formatScore(number) {
	return number.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

/* ---------- Filtering and sorting (done by the page, never by the Table) ----------
   In the examples each filter has one ready-made value: a click switches it on.
   (A real product would open a list to choose from; the examples keep it short.)
   What the filters are called, and what their value says, is in content.js. */

export const filterIds = ['status', 'skills', 'department', 'office', 'score'];

// Does one person pass one filter?
const filterChecks = {
	status: (person) => person.statusId === 'active',
	skills: (person) => ['Go', 'API', 'SQL'].some((skill) => person.skills.includes(skill)),
	department: (person) => person.departmentId === 'engineering',
	office: (person) => person.officeId === 'berlin',
	score: (person) => person.score > 20000
};

/**
 * The rows that match the search text and every filter that is on.
 * `filtersOn` is a list of filter ids, e.g. ['status', 'office'].
 */
export function filterEmployees(rows, search, filtersOn) {
	const text = search.trim().toLowerCase();
	return rows.filter(
		(person) =>
			person.fullName.toLowerCase().includes(text) &&
			filtersOn.every((filter) => filterChecks[filter](person))
	);
}

/** A sorted copy of the rows. Works for texts (in any language) and for numbers. */
export function sortEmployees(rows, key, direction) {
	const flip = direction === 'desc' ? -1 : 1;
	return [...rows].sort((a, b) => {
		const result =
			typeof a[key] === 'number' ? a[key] - b[key] : String(a[key]).localeCompare(String(b[key]));
		return result * flip;
	});
}
