<script lang="ts">
	import Cards from './Cards.svelte';
	import DataTable2 from './DataTable2.svelte';

	export let user: any = undefined;
	export let handleFiles: undefined | ((e: any) => void) = undefined;
	export let handleRedirect: undefined | ((e: any) => void) = undefined;
	export let handleDelete: (e: any) => void;
	export let handleEdit: (e: any) => void;
	export let handleView: (e: any) => void;

	export let columns: Record<string, string>[] = [];
	export let data: any;
	export let render: (key: string, obj: any) => any;
	export let actions: any = [];
	export let defaultActions: string[] = ['edit', 'delete'];
	export let orderCols: string[] = [];
	export let handleGoToArea: undefined | ((e: any) => void) = undefined;
</script>

<div class="md:hidden block">
	<Cards
		{user}
		{columns}
		{data}
		{render}
		{defaultActions}
		{actions}
		on:goToArea={handleGoToArea}
		on:files={handleFiles}
		on:ver-historial={handleRedirect}
		on:delete={handleDelete}
		on:edit={handleEdit}
	/>
</div>

<div class="md:block hidden">
	<DataTable2
		{user}
		{orderCols}
		{columns}
		{data}
		{render}
		{actions}
		{defaultActions}
		on:goToArea={handleGoToArea}
		on:files={handleFiles}
		on:view = {handleView}
		on:ver-historial={handleRedirect}
		on:delete={handleDelete}
		on:edit={handleEdit}
	/>
</div>
