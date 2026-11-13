<!-- DOCS: TextInput, Select, Checkbox, Radio, Switch, Slider. -->
<script>
	import { TextInput, Select, Checkbox, Radio, Switch, Slider } from '#lib';
	import Demo from '../Demo.svelte';

	// Each example keeps its own value, so you can play with it.
	let name = $state('');
	let search = $state('');
	let login = $state('walker85');
	let comment = $state('Access elevated');
	let fullName = $state('Brenda Gray Cooper');
	let type = $state('');
	let compareWith = $state('constantinopolski.b.e@acme.corp');

	let agree = $state(true);
	let updates = $state(false);
	let plan = $state('pro');
	let dark = $state(true);
	let sync = $state(false);
	let volume = $state(30);
</script>

<Demo
	title="TextInput"
	figma="input → text-input"
	about="One line of text. States: hover, focus, error, disabled."
>
	<div class="grid">
		<TextInput label="Label" placeholder="Placeholder" bind:value={name} hint="A hint goes here" />
		<TextInput icon="search" placeholder="Search attributes" bind:value={search} />
		<TextInput label="Login" bind:value={login} error="This login is taken" />
		<TextInput label="Comment" bind:value={comment} maxlength={40} iconEnd="edit" />
		<TextInput label="Disabled" value="Cannot change this" disabled />
		<TextInput big label="Full name" bind:value={fullName} />
	</div>
</Demo>

<Demo title="Select" figma="input → select" about="Pick one option from a list.">
	<div class="grid">
		<Select
			label="Attributes type"
			placeholder="Choose…"
			options={['Domain attributes', 'Roles and privileges', 'Delegations']}
			bind:value={type}
		/>
		<Select
			label="With an error"
			placeholder="Choose…"
			options={['One', 'Two']}
			error="Please choose one"
		/>
		<Select label="Disabled" options={['Domain attributes']} value="Domain attributes" disabled />
		<Select
			big
			label="Compare with"
			options={['constantinopolski.b.e@acme.corp', 'walker85@acme.corp']}
			bind:value={compareWith}
		/>
	</div>
</Demo>

<Demo title="Checkbox" figma="checkbox" about="On or off. Several can be on at once.">
	<Checkbox bind:checked={agree}>Title</Checkbox>
	<Checkbox bind:checked={updates} subtitle="Subtitle">Title</Checkbox>
	<Checkbox indeterminate>Some selected</Checkbox>
	<Checkbox checked disabled>Disabled</Checkbox>
</Demo>

<Demo title="Radio" figma="radio-button" about="One choice out of a group.">
	<Radio bind:group={plan} value="free">Free</Radio>
	<Radio bind:group={plan} value="pro" subtitle="Billed yearly">Pro</Radio>
	<Radio bind:group={plan} value="team" disabled>Team</Radio>
</Demo>

<Demo title="Switch" figma="switch" about="Turns a setting on or off right away.">
	<Switch bind:checked={dark}>Dark mode</Switch>
	<Switch bind:checked={sync}>Auto sync</Switch>
	<Switch big bind:checked={dark} label="Big switch" />
	<Switch big bind:checked={sync} label="Big switch" />
	<Switch checked disabled>Disabled</Switch>
</Demo>

<Demo title="Slider" figma="slider" about="Pick a number by dragging.">
	<div class="slider"><Slider bind:value={volume} label="Volume" /></div>
	<span class="hb-text-body-c">{volume}</span>
	<div class="slider"><Slider value={60} disabled label="Disabled" /></div>
</Demo>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		align-items: start;
		gap: 16px;
		width: 100%;
	}
	.slider {
		width: 168px;
	}
</style>
