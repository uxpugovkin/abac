// Made-up people for the table examples on the docs pages.
// The same data as the examples in Figma (habibi-library → Tables Guide).

const people = [
	['Jane', 'Cooper', 'Active', ['Go', 'API', 'SQL'], 'Engineering', 'Berlin', 20312632728],
	['Wade', 'Warren', 'Active', ['UX', 'UI', 'Web'], 'Design', 'Lisbon', 2256632728],
	['Esther', 'Howard', 'Active', ['Go', 'Rust', 'Ops'], 'Engineering', 'Berlin', 2256632728],
	['Cameron', 'Williamson', 'Active', ['SQL', 'BI', 'ML'], 'Analytics', 'Dubai', 96632728],
	['Brooklyn', 'Simmons', 'Active', ['Java', 'Go', 'SQL'], 'Engineering', 'Berlin', 96632728],
	['Leslie', 'Alexander', 'Active', ['Ops', 'API', 'QA'], 'Security', 'Lisbon', 8632728],
	['Jenny', 'Wilson', 'Active', ['Go', 'API', 'Web'], 'Engineering', 'Dubai', 8632728],
	['Guy', 'Hawkins', 'Active', ['Go', 'Ops', 'API'], 'Engineering', 'Berlin', 632728],
	['Robert', 'Fox', 'Active', ['UI', 'iOS', 'Web'], 'Design', 'Berlin', 632728],
	['Jacob', 'Jones', 'Active', ['Data', 'ML', 'SQL'], 'Analytics', 'Lisbon', 24728],
	['Kristin', 'Watson', 'Active', ['QA', 'Go', 'API'], 'Engineering', 'Berlin', 24728],
	['Cody', 'Fisher', 'Active', ['Ops', 'API', 'Go'], 'Security', 'Dubai', 2728],
	['Savannah', 'Nguyen', 'Active', ['BI', 'Data', 'SQL'], 'Analytics', 'Berlin', 2728],
	['Devon', 'Lane', 'Active', ['SQL', 'BI'], 'Analytics', 'Berlin', 728]
];

// The photos: ./faces/staff-00.png … staff-14.png (from the Figma file), in the same
// order as the people above. `import.meta.glob` asks the build tool for their addresses.
const photoFiles = import.meta.glob('./faces/*.png', { eager: true, import: 'default' });
export const photos = Object.keys(photoFiles)
	.sort()
	.map((name) => photoFiles[name]);

// Turn each short line above into a row object.
// `id` must be unique: the Table tells rows apart by it.
export const employees = people.map(
	([firstName, lastName, status, skills, department, office, score], index) => ({
		id: index + 1,
		fullName: `${firstName} ${lastName}`,
		status,
		skills,
		department,
		office,
		score,
		photo: photos[index]
	})
);

// Which Tag colour each status gets.
export const statusColour = { Active: 'success', 'On leave': 'warning', Blocked: 'error' };

// 20312632728 → "20,312,632,728.00"
export function formatScore(number) {
	return number.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

/* ---------- Filtering and sorting (done by the page, never by the Table) ---------- */

// What each filter chip is set to when it is clicked in the examples.
// (A real product would open a list to choose from; the examples keep it short.)
export const filterPresets = {
	Status: 'Active',
	Skills: 'Go, API, SQL',
	Department: 'Engineering',
	Office: 'Berlin',
	'Tetris score': '> 20,000'
};

// Does one person pass one filter?
const filterChecks = {
	Status: (person, value) => person.status === value,
	Skills: (person, value) => value.split(', ').some((skill) => person.skills.includes(skill)),
	Department: (person, value) => person.department === value,
	Office: (person, value) => person.office === value,
	'Tetris score': (person) => person.score > 20000
};

/**
 * The rows that match the search text and every filter that has a value.
 * `filters` looks like { Status: 'Active', Office: '' } — empty means "not set".
 */
export function filterEmployees(rows, search, filters) {
	return rows.filter((person) => {
		const matchesSearch = person.fullName.toLowerCase().includes(search.trim().toLowerCase());
		const matchesFilters = Object.entries(filters).every(
			([name, value]) => !value || filterChecks[name](person, value)
		);
		return matchesSearch && matchesFilters;
	});
}

/** A sorted copy of the rows. Works for texts and for numbers. */
export function sortEmployees(rows, key, direction) {
	const flip = direction === 'desc' ? -1 : 1;
	return [...rows].sort((a, b) => {
		const result =
			typeof a[key] === 'number' ? a[key] - b[key] : String(a[key]).localeCompare(String(b[key]));
		return result * flip;
	});
}
