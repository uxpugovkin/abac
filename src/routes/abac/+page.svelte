<!--
	ABAC PROTOTYPE  —  /abac
	The "Users" part of the ABAC service: the list of a domain's users, the page
	of one user, and the JSON panel.

	Figma:  sbertech-habibi → page "abac-r5"
	        https://www.figma.com/design/OKwPuNTKnQ3p99F03r9MyG/sbertech-habibi?node-id=0-1

	The pieces (all in this folder):
		Sidebar.svelte          the side menu of the service
		UsersList.svelte        the list of users (new design)
		UsersListOld.svelte     the same list in the old Q2 design (deprecated)
		UserPage.svelte         one user: attributes, roles, delegations
		JsonDrawer.svelte       the JSON panel
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
	import UsersListOld from './UsersListOld.svelte';
	import UserPage from './UserPage.svelte';
	import JsonDrawer from './JsonDrawer.svelte';
	import StatePanel from './StatePanel.svelte';

	let openId = $state(''); // the id of the user whose page is open; '' = the list
	let jsonId = $state(''); // the id of the user whose JSON panel is open; '' = closed

	let openUser = $derived(users.find((user) => user.id === openId));
	let jsonUser = $derived(users.find((user) => user.id === jsonId));

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
	<title>ABAC · Users — Habibi UI prototype</title>
</svelte:head>

<div class="app">
	<Sidebar />

	<main class="page hb-scroll">
		{#if openUser}
			<UserPage user={openUser} onback={() => (openId = '')} onjson={() => (jsonId = openId)} />
		{:else if proto.version === 'old'}
			<UsersListOld onopen={(user) => (openId = user.id)} />
		{:else}
			<UsersList onopen={(user) => (openId = user.id)} onjson={(user) => (jsonId = user.id)} />
		{/if}
	</main>
</div>

{#if jsonUser}
	<JsonDrawer user={jsonUser} onclose={() => (jsonId = '')} />
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
		--table-surface: var(--uncolorful-grey-surface);
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
