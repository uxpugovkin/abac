<!--
	NOTIFICATION
	A short message that tells the person what just happened
	("Saved", "Could not connect").

	Figma:  habibi-library → page "notification"

	Use:
		<Notification type="success">User was added</Notification>
		<Notification type="error" onclose={() => (show = false)}>Could not save</Notification>

	Props:
		type      "success" (green) | "info" (blue) | "warning" (orange) | "error" (red) | "neutral" (grey).  Default "info"
		icon      icon name. By default each type has its own icon
		onclose   called when × is clicked. Leave it out to hide the ×

	Text: put it between the tags.

	Notification only draws the message. Where it appears on the screen and
	when it goes away is up to the page.
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import Button from '../button/Button.svelte';
	import './notification.css';

	// The default icon of each type.
	const icons = {
		success: 'check',
		info: 'info',
		warning: 'warning',
		error: 'wrong',
		neutral: 'info'
	};

	let { type = 'info', icon = '', onclose, children, class: extraClass = '' } = $props();
</script>

<!-- role="status" makes screen readers read the message out when it appears. -->
<div class="hb-notification hb-notification--{type} {extraClass}" role="status">
	<Icon name={icon || icons[type]} />
	<span class="hb-notification__text">{@render children?.()}</span>
	{#if onclose}
		<Button mode="ghost" size="m" icon="close" label="Close" onclick={onclose} />
	{/if}
</div>
