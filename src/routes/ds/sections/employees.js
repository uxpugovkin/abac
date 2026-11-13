// Made-up people for the table examples on the docs page.
// Same data as the examples in Figma (habibi-library → Tables Guide).

export const employees = [
	{
		lastName: 'Cooper',
		firstName: 'Jane',
		status: 'Active',
		skills: ['Go', 'API', 'SQL'],
		department: 'Engineering',
		office: 'Berlin',
		score: 20312632728
	},
	{
		lastName: 'Warren',
		firstName: 'Wade',
		status: 'Active',
		skills: ['UX', 'UI', 'Web'],
		department: 'Design',
		office: 'Lisbon',
		score: 2256632728
	},
	{
		lastName: 'Howard',
		firstName: 'Esther',
		status: 'On leave',
		skills: ['Go', 'Rust', 'Ops'],
		department: 'Engineering',
		office: 'Berlin',
		score: 2256632728
	},
	{
		lastName: 'Williamson',
		firstName: 'Cameron',
		status: 'Active',
		skills: ['SQL', 'BI', 'ML'],
		department: 'Analytics',
		office: 'Dubai',
		score: 96632728
	},
	{
		lastName: 'Simmons',
		firstName: 'Brooklyn',
		status: 'Active',
		skills: ['Java', 'Go', 'SQL'],
		department: 'Engineering',
		office: 'Berlin',
		score: 96632728
	},
	{
		lastName: 'Alexander',
		firstName: 'Leslie',
		status: 'Blocked',
		skills: ['Ops', 'API', 'QA'],
		department: 'Security',
		office: 'Lisbon',
		score: 8632728
	},
	{
		lastName: 'Wilson',
		firstName: 'Jenny',
		status: 'Active',
		skills: ['Go', 'API', 'Web'],
		department: 'Engineering',
		office: 'Dubai',
		score: 8632728
	},
	{
		lastName: 'Hawkins',
		firstName: 'Guy',
		status: 'On leave',
		skills: ['Go', 'Ops', 'API'],
		department: 'Engineering',
		office: 'Berlin',
		score: 632728
	},
	{
		lastName: 'Fox',
		firstName: 'Robert',
		status: 'Active',
		skills: ['UI', 'iOS', 'Web'],
		department: 'Design',
		office: 'Berlin',
		score: 632728
	},
	{
		lastName: 'Jones',
		firstName: 'Jacob',
		status: 'Active',
		skills: ['Data', 'ML', 'SQL'],
		department: 'Analytics',
		office: 'Lisbon',
		score: 24728
	},
	{
		lastName: 'Watson',
		firstName: 'Kristin',
		status: 'Active',
		skills: ['QA', 'Go', 'API'],
		department: 'Engineering',
		office: 'Berlin',
		score: 24728
	},
	{
		lastName: 'Fisher',
		firstName: 'Cody',
		status: 'Blocked',
		skills: ['Ops', 'API', 'Go'],
		department: 'Security',
		office: 'Dubai',
		score: 2728
	},
	{
		lastName: 'Montgomery-Featherstonehaugh',
		firstName: 'Alexandria Josephine',
		status: 'Active',
		skills: ['Web', 'UI'],
		department: 'Design',
		office: 'Lisbon',
		score: 1728
	},
	{
		lastName: 'Lane',
		firstName: 'Devon',
		status: 'Active',
		skills: ['SQL', 'BI'],
		department: 'Analytics',
		office: 'Berlin',
		score: 728
	}
]
	// Add what every row needs: a unique `id` (the table tells rows apart by it) and the full name.
	.map((person, index) => ({
		...person,
		id: index + 1,
		fullName: `${person.firstName} ${person.lastName}`
	}));

// Which Tag colour each status gets.
export const statusColour = { Active: 'success', 'On leave': 'warning', Blocked: 'error' };

// 20312632728 → "20,312,632,728.00"
export function formatScore(number) {
	return number.toLocaleString('en-US', { minimumFractionDigits: 2 });
}
