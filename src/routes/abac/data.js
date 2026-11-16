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
 * Cuts one line of JSON into coloured pieces:
 *   [ { text: '  ', kind: 'space' }, { text: '"id"', kind: 'key' }, … ]
 * kind:  "key" | "string" | "value" (numbers, true, false, null) | "mark" ({ } [ ] , :) | "space"
 */
export function colourLine(line) {
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
		return [{ text, kind: /^(true|false|null|-?[\d.]+)$/.test(text) ? 'value' : 'string' }];
	});
}

/** Turns a value into pretty JSON, as a list of text lines. */
export function jsonLines(value) {
	return JSON.stringify(value, null, 2).split('\n');
}

/* ---------- Comparison (mocked) ----------
	The prototype does not really compare anything: it always shows the SAME result,
	written by hand below after the Figma screens. Which outcome is shown — differences,
	no differences, nothing to compare — is picked in the state panel (`proto.compare`).

	A result is a list of rows. Each row is one of:
	  { same: 'text' }                              a line that is the same on both sides
	  { change: 'text before', a: 'old', b: 'new', end: ',' }   a value that differs
	  { a: 'text' }                                 a line only side A has
	  { b: 'text' }                                 a line only side B has
	  { skip: ['line', 'line'], about: 'what' }     unchanged lines, folded into one grey row
*/

/** The mocked difference between two users (Figma "3-7-compare-json-result"). */
export function userDiff(userA, userB) {
	return [
		{ same: '{' },
		{ change: '  "id": ', a: '"usr_8f3a21c7"', b: '"usr_2b7c90f1"', end: ',' },
		{ change: '  "login": ', a: `"${userA.login}"`, b: `"${userB.login}"`, end: ',' },
		{
			skip: ['  "tenantId": "tnt_04",', '  "region": "eu-central",', '  "type": "employee",'],
			about: 'tenant.id, region, type'
		},
		{ change: '  "status": ', a: '"active"', b: '"suspended"', end: ',' },
		{ same: '  "department": {' },
		{
			change: '    "name": ',
			a: '"Enterprise AI Platform"',
			b: '"Security Engineering"',
			end: ','
		},
		{ change: '    "grade": ', a: '"L5"', b: '"L6"' },
		{ same: '  },' },
		{
			skip: ['  "manager": "p.venkataraman",', '  "costCenter": "CC-2041",'],
			about: 'manager, costCenter'
		},
		{ same: '  "roles": [' },
		{ same: '    "ml-engineer",' },
		{ a: '    "prod-deploy",' },
		{ b: '    "security-reviewer",' },
		{ same: '    "reader"' },
		{ same: '  ],' },
		{ change: '  "riskScore": ', a: '0.12', b: '0.64', end: ',' },
		{ same: '  "mfa": {' },
		{ change: '    "status": ', a: '"ok"', b: '"review"', end: ',' },
		{ b: '    "passkey": true' },
		{ same: '  },' },
		{ same: '  "metadata": {' },
		{ change: '    "tags": ', a: '["contractor"]', b: '["full-time","on-call"]', end: ',' },
		{ b: '    "reviewedBy": "security-team",' },
		{ change: '    "notes": ', a: 'null', b: '"Access elevated"' },
		{ same: '  }' },
		{ same: '}' }
	];
}

/** The mocked difference between two snapshots of one user (Figma "4-2-history-comparison-result"). */
export function snapshotDiff(user) {
	return [
		{ same: '{' },
		{ same: '  "id": "usr_8f3a21c7",' },
		{ same: `  "login": "${user.login}",` },
		{
			skip: [
				`  "fullName": ${JSON.stringify(user.fullName)},`,
				'  "tenantId": "tnt_04",',
				'  "tenantName": "Northwind Retail",',
				'  "region": "eu-central",',
				'  "type": "employee",',
				'  "locale": "en-GB",'
			],
			about: 'fullName, tenant.id, region'
		},
		{ change: '  "status": ', a: '"active"', b: '"suspended"', end: ',' },
		{ same: '  "tenant": { "attributes": {' },
		{
			change: '    "complianceZones": ',
			a: '["GDPR","SOC2"]',
			b: '["GDPR","SOC2","ISO27001"]'
		},
		{ same: '  } },' },
		{ same: '  "domains": [ { "id": "dom_finance",' },
		{ change: '    "spendLimit": ', a: '50000', b: '75000', end: ',' },
		{ change: '    "delegatedApproval": ', a: 'true', b: 'false' },
		{ same: '  } ],' },
		{
			skip: ['  "mfa": {', '    "status": "ok",', '    "methods": [', '      "totp",'],
			about: 'mfa header, methods'
		},
		{ b: '      "passkey"' },
		{ same: '    ]' },
		{ same: '  },' },
		{ change: '  "riskScore": ', a: '0.12', b: '0.87', end: ',' },
		{ same: '  "sync": {' },
		{ change: '    "status": ', a: '"error"', b: '"ok"', end: ',' },
		{ a: '    "errors": [ { "code": "ATTR_MISSING", "field": "department" },' },
		{ a: '                { "code": "ATTR_MISSING", "field": "domains[0].costCenter" } ]' },
		{ same: '  },' },
		{ same: '  "metadata": {' },
		{
			change: '    "tags": ',
			a: '["contractor","external-audit-2026"]',
			b: '["external-audit-2026"]',
			end: ','
		},
		{ b: '    "reviewedBy": "security-team",' },
		{ change: '    "notes": ', a: 'null', b: '"Reviewed 07-30"' },
		{ same: '  }' },
		{ same: '}' }
	];
}

/**
 * The rows of a result, numbered for the "Difference" view:
 *   { kind: 'same' | 'change' | 'a' | 'b' | 'skip', a: line number on side A, b: on side B, text, … }
 */
export function diffLines(rows) {
	let a = 0;
	let b = 0;
	return rows.map((row) => {
		if (row.skip) {
			a += row.skip.length;
			b += row.skip.length;
			return { kind: 'skip', text: `···${row.skip.length} unchanged lines — ${row.about}` };
		}
		if ('same' in row) return { kind: 'same', a: ++a, b: ++b, text: row.same };
		if ('change' in row) {
			return {
				kind: 'change',
				a: ++a,
				b: ++b,
				text: row.change,
				old: row.a,
				now: row.b,
				end: row.end ?? ''
			};
		}
		if ('a' in row) return { kind: 'a', a: ++a, text: row.a };
		return { kind: 'b', b: ++b, text: row.b };
	});
}

/** The whole JSON of one side ("a" or "b") of a result, as text lines. */
export function sideLines(rows, side) {
	return rows.flatMap((row) => {
		if (row.skip) return row.skip;
		if ('same' in row) return [row.same];
		if ('change' in row) return [row.change + row[side] + (row.end ?? '')];
		return side in row ? [row[side]] : [];
	});
}

/* ---------- Domains ---------- */

/** The domain the prototype works in. */
export const currentDomain = 'res-domain-144';

/** All domains of the tenant. Only the current one can be picked in this prototype. */
export const domains = [
	'res-domain-101',
	'res-domain-102',
	'res-domain-117',
	'res-domain-120',
	'res-domain-128',
	'res-domain-131',
	'res-domain-139',
	'res-domain-144',
	'res-domain-145',
	'res-domain-151',
	'res-domain-163',
	'res-domain-170',
	'res-domain-188',
	'audit-logs',
	'billing-core',
	'customer-identity',
	'data-platform',
	'finance-reporting',
	'hr-directory',
	'payments-gateway',
	'procurement',
	'risk-engine',
	'security-operations',
	'support-desk'
];

/* ---------- The history of a user ---------- */

/*
	One line per snapshot, newest first:
	  time, operation, type, author, id
*/
const snapshotList = [
	[
		'2026-08-15 23:43:38',
		'update',
		'SYSTEM_OTT',
		'Chance Curtis',
		'e925cc2bdc642a0866a7dd5a95f1f9d220b5856e'
	],
	[
		'2026-08-15 23:43:29',
		'create',
		'SYSTEM_OTT',
		'paps_user_ba',
		'356a192b7913b04c54574d18c28d46e6395428ab'
	],
	[
		'2026-08-15 23:34:33',
		'delete',
		'SYSTEM_INNER',
		'Tatiana Rosser',
		'd583c3aa489ed954df3be71e71deae3a9895857e'
	],
	[
		'2026-08-15 22:59:49',
		'create',
		'USER_JWT',
		'paps_user_ba',
		'da4b9237bacccdf19c0760cab7aec4a8359010b0'
	],
	[
		'2026-08-15 18:53:19',
		'create',
		'USER_JWT',
		'Marilyn Lipshutz',
		'77de68daecd823babbb58edb1c8e14d7106e83bb'
	],
	[
		'2026-08-15 18:51:18',
		'update',
		'USER_JWT',
		'Hanna Dias',
		'1b6453892473a467d07372d45eb05abc2031647a'
	],
	[
		'2026-08-15 18:45:57',
		'update',
		'SYSTEM_OTT',
		'paps_user_ba',
		'ac3478d69a3c81fa62e60f5c3696165a4e5e6ac4'
	],
	[
		'2026-08-15 15:54:52',
		'delete',
		'SYSTEM_OTT',
		'paps_user_ba',
		'c1dfd96eea8cc2b62785275bca38ac261256e278'
	],
	[
		'2026-08-15 15:19:47',
		'delete',
		'SYSTEM_INNER',
		'Terry Saris',
		'902ba3cda1883801594b6e1b452790cc53948fda'
	],
	[
		'2026-08-15 15:02:33',
		'update',
		'SYSTEM_INNER',
		'Gretchen Dias',
		'fe5dbbcea5ce7e2988b8c69bcfdfde8904aabc1f'
	],
	[
		'2026-08-15 09:36:17',
		'update',
		'USER_JWT',
		'Miracle Calzoni',
		'0ade7c2cf97f75d009975f4d720d1fa6c19f4897'
	],
	[
		'2026-08-15 09:02:18',
		'delete',
		'USER_JWT',
		'Kaylynn Korsgaard',
		'b1d5781111d84f7b3fe45a0852e59758cd7a87e5'
	],
	[
		'2026-08-15 08:56:27',
		'update',
		'SYSTEM_OTT',
		'Maria Culhane',
		'17ba0791499db908433b80f37c5fbc89b870084b'
	],
	[
		'2026-08-15 07:37:47',
		'delete',
		'SYSTEM_OTT',
		'paps_user_ba',
		'7b52009b64fd0a2a49e6d8a939753077792b0554'
	],
	[
		'2026-08-15 00:52:58',
		'create',
		'SYSTEM_INNER',
		'Terry Workman',
		'bd307a3ec329e10a2cff8fb87480823da114f8f4'
	],
	[
		'2026-08-14 09:02:18',
		'create',
		'SYSTEM_INNER',
		'Martin Kenter',
		'fa35e192121eabf3dabf9f5ea6abdbcbc107ac3b'
	]
];

/*
	Older snapshots, made up in a loop so the history is long enough to scroll.
	Every 47 minutes back from 14.08.2026 07:30, cycling through operations, types and authors.
*/
const operationCycle = ['update', 'update', 'create', 'update', 'delete'];
const typeCycle = ['SYSTEM_OTT', 'USER_JWT', 'SYSTEM_INNER'];
const authorCycle = [
	'paps_user_ba',
	'Hanna Dias',
	'Terry Saris',
	'Chance Curtis',
	'Maria Culhane',
	'paps_user_ba',
	'Gretchen Dias'
];

/** A made-up 40-character snapshot id, always the same for the same number. */
function fakeId(seed) {
	// A tiny "random" sequence (Park–Miller); the numbers stay small enough to be exact.
	let value = seed * 7919 + 17;
	let id = '';
	while (id.length < 40) {
		value = (value * 48271) % 2147483647;
		id += (value % 16).toString(16);
	}
	return id;
}

const start = Date.UTC(2026, 7, 14, 7, 30, 0);
for (let index = 0; index < 34; index++) {
	const time = new Date(start - index * 47 * 60 * 1000 - (index % 7) * 13 * 1000);
	snapshotList.push([
		time.toISOString().slice(0, 19).replace('T', ' '),
		operationCycle[index % operationCycle.length],
		typeCycle[index % typeCycle.length],
		authorCycle[index % authorCycle.length],
		fakeId(index + 1)
	]);
}

/** The snapshots as table rows. The first one is the current state of the user. */
export const snapshots = snapshotList.map(([time, operation, type, author, id], index) => ({
	id,
	time,
	operation,
	type,
	author,
	current: index === 0
}));

/** How each operation is written and which Tag colour it gets. */
export const operations = {
	update: { label: 'Update', colour: 'progress' },
	create: { label: 'Create', colour: 'success' },
	delete: { label: 'Delete', colour: 'error' }
};
