<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Tooltip
	} from 'flowbite-svelte';
	import {
		EditSolid,
		PaperClipOutline,
		TrashBinSolid,
		CaretRightSolid,
		UsersSolid,
		EyeOutline
	} from 'flowbite-svelte-icons';
	import SortBtn from '../SortBtn.svelte';

	export let user: any;
	export let columns: Record<string, string>[] = [];
	export let data: any;

	export let render: (key: string, obj: any) => any;
	export let actions: any = [];
	export let defaultActions: string[] = ['edit'];

	const dispatch = createEventDispatcher();

	export let orderCols: string[] = [];

	function syncScroll() {
		const tableContainer = document.querySelector('.overflow-x-auto.relative')!;
		const scrollContainer = document.getElementById('scrollContainer')!;
		tableContainer.scroll({ left: scrollContainer.scrollLeft });
	}

	function syncScroll2() {
		const tableContainer = document.querySelector('.overflow-x-auto.relative')!;
		const scrollContainer = document.getElementById('scrollContainer')!;
		scrollContainer.scroll({ left: tableContainer.scrollLeft });
	}

	onMount(() => {
		const mytable = document.querySelector('table')!;
		const tableContainer = document.querySelector('.overflow-x-auto.relative')!;
		const scroll = document.getElementById('scroll')!;
		const scrollContainer = document.getElementById('scrollContainer')!;
		scroll.style.width = mytable.clientWidth + 'px';
		scrollContainer.addEventListener('scroll', syncScroll);
		tableContainer.addEventListener('scroll', syncScroll2);
	});
	$: headers = columns?.map((col: any) => col.label);
	$: keys = columns?.map((col: any) => col.key);
	$: showActions = defaultActions?.length + actions?.length > 0;
</script>

<div id="scrollContainer" class="overflow-x-auto mt-4">
	<div id="scroll" class="h-1"></div>
	<!-- Content of the other element -->
</div>

<Table>	<TableHead>
		{#each headers as col, i}
			{#if col === 'ID'}
				<TableHeadCell class="p-1 bg-gray-200">
					{#if orderCols.includes(keys[i])}
						<SortBtn key={keys[i]} label={col} />
					{:else}
						{col}
					{/if}
				</TableHeadCell>			{:else}
				<TableHeadCell
					class="min-w-44 p-1 bg-gray-200"
				>
					{#if orderCols.includes(keys[i])}
						<SortBtn key={keys[i]} label={col} />
					{:else}
						{col}
					{/if}
				</TableHeadCell>
			{/if}
		{/each}
		{#if showActions}
			<TableHeadCell class="sticky right-0 bg-gray-200"
				>Acciones</TableHeadCell
			>
		{/if}
	</TableHead>	<TableBody>
		{#each data as obj}
			<TableBodyRow class="hover:bg-slate-300">
				{#each keys as key}
					{#if key === 'id'}
						<TableBodyCell tdClass="w-fit p-1">
							{render(key, obj)}
						</TableBodyCell>
					{:else}
						<TableBodyCell tdClass="min-w-44 p-1">
							{@html render(key, obj)}
						</TableBodyCell>
					{/if}
				{/each}				{#if showActions}
					<TableBodyCell
						class="sticky right-0 bg-gray-100 z-1 hover:bg-slate-300"
					>
						<div class="flex gap-3 justify-end">
							{#each actions as action}
								<svelte:component
									this={action.component}
									on:click={() => dispatch(action.event, { data: obj })}
									{...action.props}
								/>
							{/each}
							{#if $page.url.pathname === '/admin/tutores'}
								{#if defaultActions.includes('view')}
									<Button on:click={() => dispatch('view', { data: obj })} class="text-white text-xs px-2 h-8 py-1 hover:opacity-80" style="background-color: #8FB428; border-color: #8FB428;">
										<UsersSolid class="w-4 h-4 mr-1" />
										Ver Alumnos
									</Button>
									<Tooltip color="green">Ver alumnos del tutor</Tooltip>
								{/if}
								{#if defaultActions.includes('edit')}
									<button on:click={() => dispatch('edit', { data: obj })}>
										<EditSolid color="#75b625" size="lg" />
									</button>
									<Tooltip color="green">Editar tutor</Tooltip>
								{/if}
								{#if defaultActions.includes('delete')}
									<button on:click={() => dispatch('delete', { data: obj })}>
										<TrashBinSolid color="red" size="lg" />
									</button>
									<Tooltip color="red">Eliminar tutor</Tooltip>
								{/if}
							{/if}

							<!-- Acciones específicas para la página de noticias -->
							{#if $page.url.pathname === '/admin/noticias'}
								{#if defaultActions.includes('view')}
									<Button on:click={() => dispatch('view', { data: obj })} class="text-white text-xs px-2 py-1 hover:opacity-80" style="background-color: #8FB428; border-color: #8FB428;">
										<EyeOutline class="w-4 h-4 mr-1" />
										Ver Más
									</Button>
									<Tooltip color="green">Ver detalles de la noticia</Tooltip>
								{/if}
								{#if defaultActions.includes('edit')}
									<button on:click={() => dispatch('edit', { data: obj })}>
										<EditSolid color="#75b625" size="lg" />
									</button>
									<Tooltip color="green">Editar noticia</Tooltip>
								{/if}
								{#if defaultActions.includes('delete')}
									<button on:click={() => dispatch('delete', { data: obj })}>
										<TrashBinSolid color="red" size="lg" />
									</button>
									<Tooltip color="red">Eliminar noticia</Tooltip>
								{/if}
							{/if}

							<!-- Acciones específicas para la página de alumnos -->
							{#if $page.url.pathname.includes('/alumnos')}
								{#if defaultActions.includes('edit')}
									<button on:click={() => dispatch('edit', { data: obj })}>
										<EditSolid color="#75b625" size="lg" />
									</button>
									<Tooltip color="green">Editar alumno</Tooltip>
								{/if}
								{#if defaultActions.includes('delete')}
									<button on:click={() => dispatch('delete', { data: obj })}>
										<TrashBinSolid color="red" size="lg" />
									</button>
									<Tooltip color="red">Desasociar alumno</Tooltip>
								{/if}
							{/if}

							<!-- Acciones por defecto para otras páginas -->
							{#if !$page.url.pathname.includes('/admin/tutores') && !$page.url.pathname.includes('/admin/noticias') && !$page.url.pathname.includes('/alumnos')}
								{#if defaultActions.includes('view')}
									<Button on:click={() => dispatch('view', { data: obj })} class="text-white text-xs px-2 py-1 hover:opacity-80" style="background-color: #8FB428; border-color: #8FB428;">
										Ver Más
									</Button>
								{/if}
								{#if defaultActions.includes('edit')}
									<button on:click={() => dispatch('edit', { data: obj })}>
										<EditSolid color="#75b625" size="lg" />
									</button>
								{/if}
								{#if defaultActions.includes('delete')}
									<button on:click={() => dispatch('delete', { data: obj })}>
										<TrashBinSolid color="red" size="lg" />
									</button>
								{/if}
							{/if}
						</div>
					</TableBodyCell>
				{/if}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
{#if data.length === 0}
	<p class="p-4 text-center font-popLight uppercase">No se encontraron datos</p>
{/if}
