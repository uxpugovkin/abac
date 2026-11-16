<!-- DOCS: Tag, Badge, Marker, Notification, Tooltip, Skeleton, Avatar. -->
<script>
	import { Tag, Badge, Marker, Notification, Tooltip, Skeleton, Avatar, Button } from '#lib';
	import Demo from '../Demo.svelte';
	import { content } from '../content.js';
	import { pick } from '../examples.svelte.js';

	const t = pick(content.status); // the example texts, in the current language

	const colours = ['error', 'warning', 'success', 'progress', 'neutral'];
	const accents = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `accent-${n}`);

	let showNotification = $state(true);
</script>

<Demo title="Tag" figma="tag" about="A small label for a status. 5 colours × 3 sizes." column>
	<div class="row">
		{#each colours as colour}<Tag {colour} icon="warning">{t.colours[colour]}</Tag>{/each}
		<Tag colour="success" disabled>{t.disabled}</Tag>
	</div>
	<div class="row">
		{#each colours as colour}<Tag {colour} size="s">{t.colours[colour]}</Tag>{/each}
	</div>
	<div class="row">
		{#each colours as colour}<Tag {colour} size="xs">{t.colours[colour]}</Tag>{/each}
		{#each colours as colour}<Tag {colour} size="xs" shape="circle">{t.colours[colour]}</Tag>{/each}
		{#each colours as colour}<Tag {colour} size="xs" shape="circle" outline>{t.colours[colour]}</Tag
			>{/each}
	</div>
</Demo>

<Demo title="Badge" figma="badge" about="A small round counter.">
	{#each colours as colour}<Badge {colour}>3</Badge>{/each}
	{#each accents as colour}<Badge {colour}>12</Badge>{/each}
	{#each colours as colour}<Badge {colour} size="s">3</Badge>{/each}
</Demo>

<Demo title="Marker" figma="marker" about="A tiny coloured dot or square for legends and lists.">
	{#each [...colours, ...accents] as colour}<Marker {colour} />{/each}
	{#each colours as colour}<Marker {colour} shape="circle" />{/each}
	{#each colours as colour}<Marker {colour} outline />{/each}
	{#each colours as colour}<Marker {colour} size="s" />{/each}
	{#each colours as colour}<Marker {colour} size="xs" />{/each}
</Demo>

<Demo title="Notification" figma="notification" about="Tells the person what just happened." column>
	<Notification type="success">{t.userAdded}</Notification>
	<Notification type="info">{t.syncStarted}</Notification>
	<Notification type="warning">{t.noValue}</Notification>
	{#if showNotification}
		<Notification type="error" onclose={() => (showNotification = false)}
			>{t.couldNotSave}</Notification
		>
	{/if}
	<Notification type="neutral">{t.nothingChanged}</Notification>
</Demo>

<Demo title="Tooltip" figma="tooltip" about="A hint on hover. Put the mouse over the buttons.">
	<Tooltip text={t.downloadJson}><Button icon="download" label={t.download} /></Tooltip>
	<Tooltip title={t.lastSync} text="12.08.2026, 14:30" placement="bottom"
		><Tag colour="neutral">{t.lastSyncDate}</Tag></Tooltip
	>
</Demo>

<Demo
	title="Skeleton"
	figma="skeleton"
	about="Stands in for text while the real content loads."
	column
>
	<Skeleton width={200} />
	<Skeleton width="60%" />
	<Skeleton />
</Demo>

<Demo
	title="Avatar"
	figma="avatar"
	about="A round picture of a person, with a placeholder when there is no photo."
>
	<Avatar name={t.tatiana} />
	<Avatar name={t.brenda} size="s" />
	<Avatar name={t.jane} size="xs" />
	<div class="hb-avatar-stack" style="--uncolorful-grey-background: var(--uncolorful-grey-surface)">
		<Avatar name={t.anna} />
		<Avatar name={t.boris} />
		<Avatar name={t.clara} />
	</div>
</Demo>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}
</style>
