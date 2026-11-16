<!--
	ABAC PROTOTYPE, TO BE  —  /abac-to-be
	The "Users" part of the ABAC service, as we want it to become.
	It started as a copy of /abac-as-is. What is different here:
		- the user page has a "JSON" switch next to its search: the page shows its
		  content as code instead of cards
		- the "JSON" button is now "Compare": it opens only the comparison

	What it has: the list of a domain's users, the page
	of one user, their history, the JSON panel and the two comparisons
	(user against user, snapshot against snapshot).

	Figma:  sbertech-habibi → page "abac-r5"
	        https://www.figma.com/design/OKwPuNTKnQ3p99F03r9MyG/sbertech-habibi?node-id=0-1

	The pieces (all in this folder):
		Sidebar.svelte          the side menu of the service
		UsersList.svelte        the list of users (new design)
		UserPage.svelte         one user: attributes, roles, delegations
		HistoryPage.svelte      the history of one user (opened with "Audit log")
		JsonCode.svelte         a JSON as code over the whole page (the user page's "JSON" switch)
		CompareDrawer.svelte    compare the user with another user
		SnapshotsDrawer.svelte  compare two snapshots of the history
		CompareView.svelte      the result of a comparison (both panels use it)
		Drawer.svelte           the sliding panel itself
		JsonText.svelte         JSON with its colours
		Breadcrumbs.svelte      the "where am I" line above a title
		StatePanel.svelte       the tiny panel that switches states, designs and themes
		prototype.svelte.js     what that panel switches (`proto`)
		data.js                 the made-up users, attributes and JSON

	This page only decides WHICH screen is on, and puts the theme on <html>.
	Everything is built from the design system (#lib); nothing here fetches data.
-->
<script>
	import { Notification } from '#lib';
	import { users } from './data.js';
	import { proto } from './prototype.svelte.js';
	import Sidebar from './Sidebar.svelte';
	import UsersList from './UsersList.svelte';
	import UserPage from './UserPage.svelte';
	import HistoryPage from './HistoryPage.svelte';
	import CompareDrawer from './CompareDrawer.svelte';
	import SnapshotsDrawer from './SnapshotsDrawer.svelte';
	import StatePanel from './StatePanel.svelte';

	let openId = $state(''); // the id of the user whose page is open; '' = the list
	let history = $state(false); // true = the history of that user, instead of their page
	let json = $state(false); // true = the user page shows its content as JSON code
	let compareId = $state(''); // the id of the user whose compare panel is open; '' = closed
	let snapshotId = $state(''); // the id of the snapshot being compared with the current one; '' = closed

	let openUser = $derived(users.find((user) => user.id === openId));
	let compareUser = $derived(users.find((user) => user.id === compareId));

	// Opens a user's page; `asJson` = straight in the JSON view.
	function open(user, asJson = false) {
		openId = user.id;
		json = asJson;
	}

	function toList() {
		openId = '';
		history = false;
	}

	// Theme and direction go onto <html>, so every component follows (see the README).
	// When the person leaves the prototype, the site gets its own look back.
	$effect(() => {
		const html = document.documentElement;
		html.dataset.theme = proto.theme;
		html.dir = proto.rtl ? 'rtl' : 'ltr';
		return () => {
			delete html.dataset.theme;
			html.removeAttribute('dir');
		};
	});
</script>

<svelte:head>
	<title>ABAC · Users (to-be) — Habibi UI prototype</title>
</svelte:head>

<div class="app">
	<Sidebar />

	<main class="page hb-scroll">
		{#if openUser && history}
			<HistoryPage
				user={openUser}
				onback={toList}
				onuser={() => (history = false)}
				oncompare={(snapshot) => (snapshotId = snapshot.id)}
			/>
		{:else if openUser}
			<UserPage
				user={openUser}
				bind:json
				onback={toList}
				oncompare={() => (compareId = openId)}
				onhistory={() => (history = true)}
			/>
		{:else}
			<UsersList
				onopen={(user) => open(user)}
				onjson={(user) => open(user, true)}
				oncompare={(user) => (compareId = user.id)}
			/>
		{/if}
	</main>
</div>

{#if compareUser}
	<CompareDrawer user={compareUser} onclose={() => (compareId = '')} />
{/if}

{#if openUser && snapshotId}
	<SnapshotsDrawer user={openUser} {snapshotId} onclose={() => (snapshotId = '')} />
{/if}

{#if proto.toast}
	<div class="toast"><Notification type={proto.toast.type}>{proto.toast.text}</Notification></div>
{/if}

<StatePanel />

<style>
	/* The service fills the window: the side menu stays, the page next to it scrolls. */
	.app {
		display: flex;
		height: 100vh;
	}
	.page {
		flex: 1;
		min-width: 0;
		overflow: auto;
		/* Room for the up-down scrollbar is kept even when a filter leaves too few rows to
		   scroll — otherwise the whole page would jump sideways (same as the Window of the
		   table guide, src/routes/ds/tables/Window.svelte). */
		scrollbar-gutter: stable;
		/* That room is 20px (the design system's scrollbar), so the screens keep only 4px
		   of their own at the far side: 4 + 20 = the same 24px as at the start side. */
		--screen-end: 4px;
		--table-surface: var(--uncolorful-grey-surface);
	}
	/* Firefox draws a thin scrollbar of its own (about 12px), so more padding is kept there. */
	@supports not selector(::-webkit-scrollbar) {
		.page {
			--screen-end: 12px;
		}
	}
	/* Short messages: bottom centre, above everything. */
	.toast {
		position: fixed;
		bottom: 16px;
		left: 50%;
		z-index: 90;
		transform: translateX(-50%);
	}
</style>
