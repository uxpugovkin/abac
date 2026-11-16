/*
	MADE-UP DATA of the ABAC prototype: the users of one domain, the attributes
	on a user page and the JSON of a user. Names and numbers follow the Figma
	file (sbertech-habibi → page "abac-r5"); nothing here comes from a server.
*/

/*
	One line per user:
	  login, full name, UID, status, domain attributes, base attributes, last sync
	  status      "active" | "inactive" | "blocked" | null (not known yet)
	  attributes  "filled" | "empty" | null
	  last sync   "YYYY-MM-DD hh:mm:ss", or "stale" (no sync for 72 hours), or null
*/
const list = [
	['amelia.brooks', 'Tatiana Saris', '816886', 'active', 'filled', 'filled', '2026-08-15 22:36:46'],
	[
		'brandon.fisher',
		'Makenna Rosser',
		'659852',
		'active',
		'filled',
		'filled',
		'2026-08-15 21:13:06'
	],
	[
		'carmen.ortiz',
		'Jordyn Septimus',
		'764308',
		'active',
		'filled',
		'filled',
		'2026-08-15 16:32:25'
	],
	['dominic.reyes', 'Brenda Gray Cooper', '370673', 'active', 'empty', 'filled', 'stale'],
	['elena.novak', 'Maren Dias', '436004', 'active', 'filled', 'filled', '2026-08-15 13:39:29'],
	['felix.grant', null, null, null, null, 'empty', null],
	['gabriela.mendez', 'Erin Curtis', '341440', 'active', 'filled', 'filled', '2026-08-15 13:31:43'],
	['harold.pierce', 'Jaxson George', '213293', 'active', 'filled', 'filled', '2026-08-15 13:19:31'],
	[
		'isabel.romero',
		'Madelyn Lipshutz',
		'551626',
		'blocked',
		'filled',
		'filled',
		'2026-08-15 11:54:30'
	],
	['julian.forbes', 'Marley Bator', '282580', 'active', 'filled', 'filled', '2026-08-15 11:41:31'],
	['karina.blake', 'Marcus Botosh', '531401', 'active', 'filled', 'filled', '2026-08-15 09:02:09'],
	[
		'leonard.hughes',
		'Allison Carder',
		'590819',
		'active',
		'filled',
		'filled',
		'2026-08-15 08:22:21'
	],
	[
		'monica.salazar',
		'Wilson Baptista',
		'341441',
		'inactive',
		'filled',
		'filled',
		'2026-08-15 06:31:14'
	],
	[
		'nathan.crawford',
		'Madelyn Lipshutz',
		'738972',
		'active',
		'filled',
		'filled',
		'2026-08-15 06:03:23'
	],
	['olivia.bennett', 'Lydia Dias', '127148', 'active', 'filled', 'filled', '2026-08-15 04:13:08'],
	[
		'patrick.donovan',
		'Marilyn Dorwart',
		'889431',
		'active',
		'filled',
		'filled',
		'2026-08-15 04:10:32'
	],
	[
		'quentin.reid',
		'Ty Puckett Horne',
		'764309',
		'active',
		'filled',
		'filled',
		'2026-08-14 23:48:10'
	],
	[
		'rosa.delgado',
		'Fatima Berg Rodriquez',
		'836052',
		'inactive',
		'filled',
		'filled',
		'2026-08-14 19:05:57'
	],
	[
		'samuel.ortega',
		'Elias Lawson Tyson',
		'370674',
		'active',
		'filled',
		'filled',
		'2026-08-14 12:27:40'
	],
	[
		'tessa.lindqvist',
		'Myla Faulkner Anderson',
		'551627',
		'blocked',
		'filled',
		'empty',
		'2026-08-14 08:14:02'
	]
];

/** The users as table rows. `id` is the login: the Table tells rows apart by it. */
export const users = list.map(([name, fullName, uid, status, domainAttrs, baseAttrs, sync]) => ({
	id: name,
	login: `${name}@acme.com`,
	fullName,
	uid,
	status,
	domainAttrs,
	baseAttrs,
	stale: sync === 'stale',
	lastSync: sync === 'stale' ? null : sync
}));

/** How each status is written and which Tag colour it gets. */
export const statuses = {
	active: { label: 'Active', colour: 'success' },
	inactive: { label: 'Inactive', colour: 'neutral' },
	blocked: { label: 'Blocked', colour: 'error' }
};

/** "2026-08-15 22:36:46" → "15.08.2026 22:36:46".  With `dateOnly` → "15.08.2026". */
export function formatSync(text, dateOnly = false) {
	const [date, time] = text.split(' ');
	const [year, month, day] = date.split('-');
	return dateOnly ? `${day}.${month}.${year}` : `${day}.${month}.${year} ${time}`;
}

/** true = this user needs attention (the "Warnings only" switch shows only these). */
export function hasWarning(user) {
	return (
		user.stale ||
		user.status === 'blocked' ||
		user.domainAttrs !== 'filled' ||
		user.baseAttrs !== 'filled'
	);
}

/**
 * Sorts rows by one field. Rows without a value always go to the end.
 * @param {object[]} rows
 * @param {string} key        the field to sort by
 * @param {string} direction  "asc" | "desc"
 */
export function sortRows(rows, key, direction) {
	const sign = direction === 'desc' ? -1 : 1;
	return [...rows].sort((a, b) => {
		if (a[key] == null) return 1;
		if (b[key] == null) return -1;
		return String(a[key]).localeCompare(String(b[key])) * sign;
	});
}

/* ---------- The user page ---------- */

/** The domain attributes of a user, in groups. The same for every user of the prototype. */
export const attributeGroups = [
	{
		title: 'Employment',
		rows: [
			['Job title', 'Senior Machine Learning Engineer'],
			['Job level / Grade', 'L5 · Senior (IC track)'],
			['Job family', 'Software Engineering — Machine Learning'],
			['Department', 'AI & Machine Learning — Ranking & Recommendations'],
			['Reporting manager', 'Priyanka Venkataraman — Senior Engineering Manager, AIML'],
			['Employment type', 'Full-time · Regular'],
			['Work mode', 'Hybrid — 3 days on-site'],
			['Primary office', 'Mountain View, CA — Building 1965 (MTV-42) · Desk 4C-118'],
			['Hire date', '15 Mar 2021 · 4.5 yrs tenure'],
			['Cost center', 'CC-2041 · AIML-RANK']
		]
	},
	{
		title: 'Skills',
		rows: [
			['Programming', 'Python, C++, Go, CUDA'],
			['ML frameworks', 'PyTorch, JAX, TensorFlow, XGBoost'],
			['Distributed systems', 'Kubernetes, Ray, Apache Spark, Apache Beam'],
			['Serving & MLOps', 'Triton Inference Server, TensorFlow Serving, MLflow, Kubeflow'],
			['Specializations', 'Large-scale recommender systems, learning-to-rank, embedding retrieval'],
			['Proficiency', 'Expert — calibrated 2025 H1 review cycle']
		]
	},
	{
		title: 'Experience',
		rows: [
			['Total experience', '11 years'],
			['Previous employer', 'Northwind Retail — Staff Data Scientist'],
			['Clearance', 'Internal · Level 2']
		]
	},
	{
		title: 'Education',
		rows: [
			['Degree', 'MSc, Computer Science'],
			['Institution', 'ETH Zürich'],
			['Graduated', '2014']
		]
	},
	{
		title: 'Hobbies',
		rows: [
			['Interests', 'Table tennis, trail running, analogue photography'],
			['Communities', 'ML reading group, Women in Tech mentoring']
		]
	}
];

/** The roles of a user (the "Roles and privileges" tab). */
export const roles = [
	{
		id: 1,
		role: 'viewer',
		scope: 'dom_finance',
		grantedBy: 'Tatiana Pirog',
		validUntil: '31.12.2026'
	},
	{
		id: 2,
		role: 'approver',
		scope: 'dom_finance',
		grantedBy: 'Tatiana Pirog',
		validUntil: '31.12.2026'
	},
	{
		id: 3,
		role: 'editor',
		scope: 'dom_procurement',
		grantedBy: 'Policy: aiml-default',
		validUntil: 'No end date'
	}
];

/* ---------- The JSON of a user ---------- */

/** The three JSON views of the "JSON" panel, for one user. */
export function jsonOf(user) {
	const domains = [
		{
			id: 'dom_finance',
			name: 'Finance',
			roles: ['viewer', 'approver'],
			attributes: { costCenter: 'CC-4821', spendLimit: 50000, delegatedApproval: true }
		},
		{
			id: 'dom_procurement',
			name: 'Procurement',
			roles: ['editor'],
			attributes: { costCenter: 'CC-2041', spendLimit: 12000, delegatedApproval: false }
		}
	];

	return {
		effective: {
			id: 'usr_8f3a21c7',
			login: user.login,
			fullName: user.fullName,
			status: user.status,
			tenant: {
				id: 'tnt_04',
				name: 'Northwind Retail',
				region: 'eu-central',
				attributes: { tier: 'enterprise', dataResidency: 'EU', complianceZones: ['GDPR', 'SOC2'] }
			},
			domains
		},
		domain: Object.fromEntries(
			attributeGroups.map((group) => [group.title.toLowerCase(), Object.fromEntries(group.rows)])
		),
		roles: {
			roles: roles.map(({ role, scope, validUntil }) => ({ role, scope, validUntil })),
			privileges: ['finance.reports.read', 'finance.payments.approve', 'procurement.orders.write']
		}
	};
}

/**
 * Turns a value into pretty JSON, cut into lines and coloured pieces:
 *   [ [ { text: '  ', kind: 'space' }, { text: '"id"', kind: 'key' }, … ], …next line ]
 * kind:  "key" | "string" | "value" (numbers, true, false, null) | "mark" ({ } [ ] , :) | "space"
 */
export function jsonLines(value) {
	const piece = /("(?:[^"\\]|\\.)*")(\s*:)?|true|false|null|-?\d+(?:\.\d+)?|[{}[\],:]|\s+/g;

	return JSON.stringify(value, null, 2)
		.split('\n')
		.map((line) =>
			[...line.matchAll(piece)].flatMap(([text, quoted, colon]) => {
				if (colon)
					return [
						{ text: quoted, kind: 'key' },
						{ text: colon, kind: 'mark' }
					];
				if (quoted) return [{ text, kind: 'string' }];
				if (/^\s+$/.test(text)) return [{ text, kind: 'space' }];
				return [{ text, kind: /^[{}[\],:]$/.test(text) ? 'mark' : 'value' }];
			})
		);
}
