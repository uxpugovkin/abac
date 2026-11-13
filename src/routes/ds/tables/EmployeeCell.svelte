<!--
	EMPLOYEE CELL — guide only.
	How one cell of the "Employees" example table is drawn: a photo next to the
	name, a coloured tag for the status, a row of tags for the skills.

	Use, inside a <Table>:
		{#snippet cell(row, column)}<EmployeeCell {row} {column} />{/snippet}
-->
<script>
	import { Tag, Avatar } from '#lib';
	import { statusColour, formatScore } from '../employees.js';

	let { row, column } = $props();
</script>

{#if column.key === 'fullName'}
	<div class="hb-table__person">
		<Avatar src={row.photo} name={row.fullName} size="xs" />
		<span>{row.fullName}</span>
	</div>
{:else if column.key === 'status'}
	<Tag colour={statusColour[row.status]} size="s">{row.status}</Tag>
{:else if column.key === 'skills'}
	<div class="hb-table__tags">
		{#each row.skills as skill}<Tag>{skill}</Tag>{/each}
	</div>
{:else if column.key === 'score'}
	{formatScore(row.score)}
{:else}
	{row[column.key]}
{/if}
