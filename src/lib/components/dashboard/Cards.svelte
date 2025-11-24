<script lang="ts">
	import {
		CaretRightSolid,
		EditSolid,
		PaperClipOutline,
		TrashBinSolid
	} from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	export let user: any;
	export let columns: Record<string, string>[] = [];
	export let data: any;
	export let render: (key: string, obj: any) => any;
	export let actions: any = [];
	export let defaultActions: string[] = ['edit', 'delete'];

	const dispatch = createEventDispatcher();

	$: headers = columns?.map((col: any) => col.label);
	$: keys = columns?.map((col: any) => col.key);
	$: showActions = defaultActions?.length + actions?.length > 0;
</script>

<div class="flex flex-col gap-4 ellipsis">
	{#each data as obj}
		<div
			class="text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-3xl py-7 overflow-hidden bg-odd"
			class:bg-even={headers.length % 2 === 0}
		>
			{#each headers as header, i}
				<div
					class="grid grid-cols-2 odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 px-2 py-1 [&>*:col-span-1] text-wrap"
				>
					<p class="font-popMedium ellipsis capitalize">{header}</p>
					<p style="word-break: break-all;">{@html render(keys[i], obj)}</p>
				</div>
			{/each}
			{#if showActions}
				<div
					class:dark:bg-gray-900={headers.length % 2 === 0}
					class:bg-white={headers.length % 2 === 0}
					class="grid grid-cols-2 items-center px-2 py-1 [&>*:col-span-1] bg-gray-50"
				>
					<p>Acciones</p>
					<div class="flex items-center gap-6">
						<div class="flex gap-3">
							{#each actions as action}
								<svelte:component
									this={action.component}
									on:click={() => dispatch(action.event, { data: obj })}
									{...action.props}
								/>
							{/each}
							{#if defaultActions.includes('goToArea')}
								<button on:click={() => dispatch('goToArea', { data: obj })}>
									<CaretRightSolid color="blue" size="lg" />
								</button>
							{/if}
							{#if defaultActions.includes('viewFiles')}
								<button on:click={() => dispatch('files', { data: obj })}>
									<PaperClipOutline color="purple" size="lg" />
								</button>
							{/if}
							{#if defaultActions.includes('edit') && (obj.estado?.descripcion !== 'resuelto' || user?.roles[0].descripcion === 'superadmin')}
								<button on:click={() => dispatch('edit', { data: obj })}>
									<EditSolid color="#75b625" size="lg" />
								</button>
							{/if}
							{#if defaultActions.includes('delete') && user?.roles[0].descripcion === 'superadmin' && user?.agente?.usuarioId !== obj.id}
								<button on:click={() => dispatch('delete', { data: obj })}>
									<TrashBinSolid color="red" size="lg" />
								</button>
							{/if}
							{#if defaultActions.includes('ver-historial')}
								<button
									class="text-primary-900 hover:underline"
									on:click={() => dispatch('ver-historial', { data: obj })}
								>
									Ver historial
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.bg-odd {
		background: linear-gradient(to bottom, #f9fafb 50%, white 50%);
	}
	.bg-even {
		background: #f9fafb;
	}
</style>
