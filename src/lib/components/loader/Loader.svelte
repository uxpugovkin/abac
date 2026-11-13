<!--
	LOADER
	A small spinning circle that says "please wait".

	Figma:  habibi-library → page "icons" → "loader"

	Use:
		<Loader />
		<Loader size={16} label="Loading users" />

	Props:
		size    width and height in px. Default 24
		label   what is loading, for screen readers. Default "Loading"
-->
<script>
	import Icon from '../icon/Icon.svelte';
	import './loader.css';

	let { size = 24, label = 'Loading' } = $props();
</script>

<span class="hb-loader" role="status" aria-label={label}>
	<Icon name="loader-0" {size} />
</span>
