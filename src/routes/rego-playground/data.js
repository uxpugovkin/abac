/*
	DATA — everything the playground shows. All made up; nothing is fetched or run.

	files          the folders and files of the file tree (shape: see Tree in #lib)
	openFiles      the file tabs above the editor
	policy         the text of policy.rego, shown in the editor
	fixtures       the names in "Add from fixtures"
	fixtureInput   the input a fixture puts into "Auth context" (the same one for every fixture)
	contextData    what the "Data" tab shows
	results        what "Run" answers: results.allow or results.deny
	tests          the 12 tests of a test run
	expectedEffect what a failed test expected (shown in its details)
	problems       what a failed test run reports, grouped by test

	Figma:  sbertech-habibi → page "rego-playground"
*/

// ---------- The file tree ----------
// Folders show no icon; JSON files show {} (as in Figma). Only some folders have something inside.

const closed = (name) => ({ id: name, label: name, icon: '', children: [] });

export const files = [
	closed('AccessGovernance'),
	closed('BundleName'),
	closed('COSMOS'),
	closed('DemoA'),
	closed('Example'),
	closed('FailingTests'),
	closed('InfiniteLoop'),
	closed('LintWarnings'),
	{
		id: 'Minimal',
		label: 'Minimal',
		icon: '',
		open: true,
		children: [
			{
				id: 'Minimal/projects',
				label: 'projects',
				icon: '',
				open: true,
				children: [
					{ id: 'Minimal/projects/policy-meta', label: 'policy-meta.paps.json', icon: 'brackets' },
					{ id: 'Minimal/projects/policy', label: 'policy.rego' },
					{ id: 'Minimal/projects/policy_test', label: 'policy_test.rego' }
				]
			},
			{ id: 'Minimal/manifest', label: 'manifest.paps.json', icon: 'brackets' }
		]
	},
	closed('QuickStart'),
	closed('QuickStart2'),
	closed('RecursionError'),
	{
		id: 'SAP_Dimension',
		label: 'SAP_Dimension',
		icon: '',
		open: true,
		children: [
			{ id: 'SAP_Dimension/policy-meta', label: 'policy-meta.json', icon: 'brackets' },
			{ id: 'SAP_Dimension/policy', label: 'policy.rego' },
			{
				id: 'SAP_Dimension/resource-attributes',
				label: 'resource-attributes.json',
				icon: 'brackets'
			}
		]
	},
	closed('SAP_Report'),
	closed('SAP_Table'),
	closed('SyntaxError'),
	closed('bRun'),
	closed('grpc_test'),
	closed('project'),
	closed('test')
];

// ---------- The file tabs ----------

export const openFiles = [
	{ id: 'policy', label: 'policy.rego', icon: 'close' },
	{ id: 'policy_test', label: 'policy_test.rego', icon: 'close' },
	{ id: 'policy-meta', label: 'policy-meta.paps.json', icon: 'close' }
];

// ---------- policy.rego ----------

export const policy = `package authz.abac

import rego.v1

# ---------------------------------------------------------
# Synthetic ABAC policy
#
# Decisions are derived purely from attributes of:
#   subject     - who is asking (input.subject)
#   resource    - what they are touching (input.resource)
#   action      - what they want to do (input.action)
#   context     - environmental facts (input.context)
# ---------------------------------------------------------

default allow := false

# Ordered sensitivity ladder. Higher number == more sensitive.
clearance_rank := {
	"public": 0,
	"internal": 1,
	"confidential": 2,
	"secret": 3,
}

# Which actions count as mutations.
write_actions := {"create", "update", "delete", "approve"}

# Actions that always require a second factor, regardless of resource.
mfa_required_actions := {"delete", "approve", "export"}

trusted_networks := {"10.20.0.0/16", "192.168.50.0/24"}

# ---------------------------------------------------------------------------
# Main decision
# ---------------------------------------------------------------------------

allow if {
	count(violations) == 0
	some rule in grants
	rule
}

decision := {
	"allow": allow,
	"violations": violations,
	"subject": input.subject.id,
	"resource": input.resource.id,
	"action": input.action,
}

# ---------------------------------------------------------------------------
# Grants: at least one must hold
# ---------------------------------------------------------------------------

grants contains "owner" if {
	input.resource.owner == input.subject.id
}

grants contains "same_department_read" if {
	input.action == "read"
	input.resource.department == input.subject.department
	clearance_rank[input.resource.classification] <= clearance_rank[input.subject.clearance]
}

grants contains "delegated" if {
	some d in input.subject.delegations
	d.resource == input.resource.id
	input.action in d.actions
}`;

// ---------- Auth context and Data ----------

export const fixtures = [
	'test2.fixture.paps.json',
	'test3.fixture.paps.json',
	'minimal-reader.fixture.json',
	'sap-dimension-admin.fixture.json',
	'mfa-delete-request.fixture.json'
];

export const fixtureInput = {
	id: 'usr_8f3a21c7',
	login: 'walker85@acme.corp',
	fullName: 'Desirae Levin',
	status: 'active',
	tenant: { id: 'tnt-04', name: 'acme-corp' },
	subject: {
		id: 'u-8812',
		role: 'reader',
		department: 'finance',
		clearance: 'internal',
		delegations: []
	},
	resource: {
		id: 'doc-4471',
		owner: 'u-1203',
		department: 'finance',
		classification: 'internal'
	},
	action: 'read',
	context: { network: '10.20.4.17', mfa: false }
};

export const contextData = {
	departments: ['finance', 'legal', 'hr', 'engineering'],
	regions: { finance: 'EU', legal: 'EU', hr: 'US', engineering: 'US' },
	retention_days: 90
};

// ---------- What "Run" answers ----------
// Each answer has a few sections. "Show as JSON" off shows them one by one, with a title;
// on, it shows all of them as one JSON.

const obligations = {
	rls: {
		operator: 'OR',
		conditions: [
			{ field: 'project_id', operator: '=', value: 'prj-4471' },
			{
				operator: 'AND',
				conditions: [
					{ field: 'clearance_rank', operator: '<=', value: 2 },
					{ field: 'region', operator: '=', value: 'EU' }
				]
			}
		]
	},
	mfa: { required: true, actions: ['approve', 'delete'] },
	masking: { fields: ['salary', 'passport_number'] },
	audit: { level: 'full', retention_days: 90 }
};

export const results = {
	allow: {
		ms: 9,
		sections: [{ label: 'Obligations', key: 'obligations', value: obligations }]
	},
	deny: {
		ms: 7,
		sections: [
			{ label: 'Obligations', key: 'obligations', value: {} },
			{
				label: 'Violations',
				key: 'violations',
				value: [
					{
						rule: 'mfa_required',
						action: 'delete',
						resource: 'doc-4471',
						message: 'action requires a second factor'
					},
					{ rule: 'clearance_rank', subject: 'u-8812', required: 'secret', actual: 'internal' }
				]
			}
		]
	}
};

export const opaVersion = '1.15.2';

/** Sections as text: each one is a title line, then its JSON. A blank line between them. */
export function sectionsText(sections) {
	return sections
		.map(
			(section) => `${section.label} (${section.key})\n${JSON.stringify(section.value, null, 2)}`
		)
		.join('\n\n');
}

/** Sections as one JSON: { obligations: …, violations: … }. */
export function sectionsJson(sections) {
	const all = {};
	for (const section of sections) all[section.key] = section.value;
	return JSON.stringify(all, null, 2);
}

// ---------- Testing ----------

const testFile = 'Minimal/projects/policy_test.rego';
export const testPackage = 'tenant_placeholder.Minimal.projects';

// status: "failed" | "passed" | "skipped".  line: where the test starts in the file.
export const tests = [
	{ name: 'test_project_read_denied_without_reader_role', status: 'failed', line: 14, ms: 3 },
	{ name: 'test_delete_requires_mfa', status: 'failed', line: 22, ms: 2 },
	{ name: 'test_obligations_include_rls_conditions', status: 'failed', line: 31, ms: 4 },
	{ name: 'test_masking_applies_to_salary_field', status: 'failed', line: 40, ms: 3 },
	{ name: 'test_project_read_allowed', status: 'passed', line: 6, ms: 1 },
	{ name: 'test_admin_all_bypasses_obligations', status: 'passed', line: 48, ms: 2 },
	{ name: 'test_default_decision_is_unknown', status: 'passed', line: 56, ms: 1 },
	{ name: 'test_audit_retention_is_90_days', status: 'passed', line: 63, ms: 2 },
	{ name: 'todo_test_sap_dimension_tuples', status: 'skipped', line: 104, ms: 0 },
	{ name: 'todo_test_recursive_roles', status: 'skipped', line: 110, ms: 0 },
	{ name: 'todo_test_cross_tenant_access', status: 'skipped', line: 116, ms: 0 },
	{ name: 'todo_test_fixture_mfa_delete_request', status: 'skipped', line: 122, ms: 0 }
].map((test) => ({ ...test, file: testFile }));

// How each status looks: a Tag colour, its icon and its word.
export const statuses = {
	failed: { colour: 'error', icon: 'close', label: 'Failed' },
	passed: { colour: 'success', icon: 'check', label: 'Passed' },
	skipped: { colour: 'neutral', icon: 'minus', label: 'Skipped' }
};

// What every failed test expected (one made-up answer for all of them).
export const expectedEffect = { label: 'Obligations', key: 'obligations', value: obligations };

// ---------- A failed test run ----------
// kind: "compile" (the policy did not compile) | "error" (linter error) | "warning" (linter warning)

export const problems = [
	{
		test: 'test_project_read_allowed',
		file: 'Minimal/projects/policy_test.rego',
		open: true,
		items: [
			{
				kind: 'compile',
				text: 'rego_unsafe_var: var rule_name is unsafe in effect.obligations',
				at: '16:4'
			}
		]
	},
	{
		test: 'test_project_read_denied_without_reader_role',
		file: 'Minimal/projects/policy_test.rego',
		open: true,
		items: [
			{
				kind: 'error',
				text: 'FAIL: expected effect.decision == "DENY" for subject.role "viewer", got "ALLOW"',
				at: '16:4'
			},
			{
				kind: 'error',
				text: 'FAIL: allow.project_read is true, expected undefined when input.subject.role is missing',
				at: '04:8'
			},
			{
				kind: 'warning',
				text: 'regal/style/line-length: line is 132 characters long and exceeds the 120-character limit; split the obligation object across several lines to keep the test readable',
				at: '12:6'
			}
		]
	},
	{
		test: 'test_deny_when_subject_is_blocked',
		file: 'FailingTests/policy_test.rego',
		items: [
			{
				kind: 'error',
				text: 'FAIL: expected allow == false for subject.status "blocked", got true',
				at: '09:4'
			},
			{
				kind: 'error',
				text: 'FAIL: violations is empty, expected a "subject_blocked" violation',
				at: '11:4'
			},
			{
				kind: 'warning',
				text: 'regal/idiomatic/use-in-operator: use "in" instead of iterating with a wildcard',
				at: '07:2'
			},
			{
				kind: 'warning',
				text: 'regal/style/prefer-snake-case: prefer snake_case for names, got "blockedUser"',
				at: '03:1'
			}
		]
	},
	{
		test: 'test_unused_imports_reported',
		file: 'LintWarnings/policy_test.rego',
		items: [
			{
				kind: 'error',
				text: 'regal/imports/import-shadows-rule: import "data.helpers" shadows the rule "helpers"',
				at: '05:1'
			},
			{
				kind: 'warning',
				text: 'regal/imports/unused-import: import "future.keywords" is never used',
				at: '03:1'
			},
			{
				kind: 'warning',
				text: 'regal/imports/unused-import: import "data.roles" is never used',
				at: '04:1'
			},
			{
				kind: 'warning',
				text: 'regal/imports/redundant-alias: alias "roles" is the same as the last part of the path',
				at: '04:20'
			}
		]
	},
	{
		test: 'test_recursive_rule_detected',
		file: 'RecursionError/policy_test.rego',
		items: [
			{
				kind: 'compile',
				text: 'rego_recursion_error: rule data.authz.role_of is recursive',
				at: '18:1'
			},
			{
				kind: 'compile',
				text: 'rego_recursion_error: rule data.authz.parent_role is recursive: parent_role -> role_of -> parent_role',
				at: '24:1'
			},
			{
				kind: 'compile',
				text: 'rego_type_error: undefined function data.authz.inherits',
				at: '31:5'
			}
		]
	}
];
