<!--
	SWITCH
	Turns one setting on or off, right away (no "Save" needed).

	Figma:  habibi-library → page "switch" (switch + switch-and-text)

	Use:
		<Switch bind:checked={darkMode}>Dark mode</Switch>
		<Switch bind:checked={on} label="Notifications" />     ← no visible text
		<Switch big bind:checked={on}>Big one</Switch>

	Props:
		checked    true = on. Use bind:checked to read it
		big        true = taller version (Figma "compact = False"). Default false
		label      needed when there is no visible text: says what it switches (screen readers)
		disabled   true = cannot be changed
		…anything else (name, onchange, …) is passed straight to the <input>

	Text: put it between the tags (optional).
-->
<script>
	import './switch.css';

	let {
		checked = $bindable(false),
		big = false,
		label = '',
		disabled = false,
		children,
		class: extraClass = '',
		...rest
	} = $props();
</script>

<label class="hb-switch-row {extraClass}">
	<input
		class="hb-switch"
		class:hb-switch--big={big}
		type="checkbox"
		role="switch"
		bind:checked
		{disabled}
		aria-label={label || undefined}
		{...rest}
	/>
	{#if children}<span>{@render children()}</span>{/if}
</label>
