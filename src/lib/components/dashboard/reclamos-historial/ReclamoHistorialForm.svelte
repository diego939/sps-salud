<script lang="ts">
	import { Button, Input, Label, Helper, Fileupload, Textarea } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import type { Agente } from '$lib/interfaces/agente.interface.js';
	import SearchableSelect from '../reclamos/SearchableSelect.svelte';
	import SerchableSelectAgentes from '../reclamos/SerchableSelectAgentes.svelte';
	export let agentes: any;
	export let agentesData;
	$: agentes = agentesData
		.filter((agente: Agente) => agente.areaId === Number(selectedArea))
		?.map((agente: Agente) => ({
			value: agente.id,
			name: `${agente?.usuario?.nombre} ${agente?.usuario?.apellido}`
		}));
	export let reiteracion;
	export let areas;
	export let reclamoId;
	export let handleAreaChange;
	export let formModal;
	export let historiaReclamo;
	export let selectedArea = '';
	export let selectedAgenteBtn = "";
	let searchTerm = historiaReclamo?.area?.descripcion;
	let nombreAgente = historiaReclamo?.agente?.usuario?.nombre
		? historiaReclamo?.agente?.usuario?.nombre + ' ' + historiaReclamo?.agente?.usuario?.apellido
		: '';
	let searchTermAgente = nombreAgente;
	//TODO: revisar si no se puede editar es porque no hay agente y da problemas de undefined
	let selectedAgente = agentes?.find(
		(agente: any) =>
			agente?.name?.toLowerCase() === historiaReclamo?.agente?.nombre?.toLocaleLowerCase()
	)?.value;
	export let errorMessage = '';
	export let successMessage = '';
	let sending = false;
	let files: File[] = historiaReclamo?.archivos || [];
	let textareapropsObservasion = {
		id: 'observacion',
		name: 'observacion',
		rows: 4,
		placeholder: 'Ingrese observación que desee hacer',
	};
	let textareapropsDescripcion = {
		id: 'descripcion',
		name: 'descripcion',
		rows: 4,
		placeholder: 'Ingrese una descripción'
	};
	function handleFilesChange(event: any) {
		files = Array.from(event.target.files);
	}
	function removeFile(index: number) {
		files = [...files.slice(0, index), ...files.slice(index + 1)];

		// Crear un nuevo objeto FileList
		const dt = new DataTransfer();
		files.forEach((file) => dt.items.add(file));
		document.getElementById('files').files = dt.files;
	}
	const addReclamoHistorial = ({}) => {
		sending = true;
		return async ({ result, update }: any) => {
			sending = false;
			if (result.type === 'success') {
				successMessage = result.data.message;
				formModal = false;
			} else {
				errorMessage = result.data.message;
			}

			await update({ invalidateAll: true, errorMessage, successMessage });
		};
	};

	const editReclamoHistorial = ({}) => {
		sending = true;
		return async ({ result, update }: any) => {
			sending = false;
			if (result.type === 'success') {
				successMessage = result.data.message;
				errorMessage = '';
				formModal = false;
			} else {
				errorMessage = result.data.message;
			}

			await update({ invalidateAll: true, errorMessage, successMessage });
		};
	};
	function chooseAction() {
		if (reiteracion) return '?/reiterarReclamoHistorial';
		if (historiaReclamo.id) return '?/editReclamoHistorial';
		return '?/addReclamoHistorial';
	}
</script>

<form
	class="flex flex-col space-y-4"
	method="post"
	action={chooseAction()}
	use:enhance={historiaReclamo.id ? editReclamoHistorial : addReclamoHistorial}
	enctype="multipart/form-data"
>
	<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">
		{historiaReclamo.id ? 'Editar la actualización' : 'Actualizar el reclamo'}
	</h3>

	<div>
		<Label class="space-y-2 mb-1">Descripción<span class="text-red-500 text-lg">*</span></Label>
		<Textarea
			{...textareapropsDescripcion}
			value={historiaReclamo.id ? historiaReclamo.descripcion : ''}
			required
		/>
	</div>

	<div>
		<Label class="space-y-2 mb-1">Observación<span class="text-red-500 text-lg">*</span></Label>
		<Textarea
			{...textareapropsObservasion}
			value={historiaReclamo.id ? historiaReclamo.observacion : ''}
			required
		/>
	</div>

	<div class="flex flex-row gap-2 flex-wrap">
		<div>
			<Label class="space-y-2 mb-1">Área<span class="text-red-500 text-lg">*</span></Label>
			<SearchableSelect {areas} bind:agentes bind:selectedArea {agentesData} bind:searchTerm  bind:selectedAgenteBtn/>
			<input type="hidden" name="areaId" bind:value={selectedArea} />
		</div>

		<div>
			<Label class="space-y-2 mb-1 mt-2">Agente</Label>
			<SerchableSelectAgentes bind:agentes bind:selectedAgente bind:searchTermAgente bind:selectedArea bind:selectedAgenteBtn/>
			<input type="hidden" name="agenteId" bind:value={selectedAgente} />
		</div>
	</div>

	{#if !historiaReclamo.id}
		<div class="my-4">
			<Label for="files" class="mb-1">Subir archivos</Label>
			<Fileupload
				type="files"
				id="files"
				name="files"
				multiple={true}
				class="mb-2"
				on:change={handleFilesChange}
			/>

			<div class=" flex gap-2 flex-wrap">
				{#each files as file, index}
					<div class="block w-24">
						<div class="group relative">
							<div class="rounded-lg bg-white shadow-md">
								{#if file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/webp'}
									<img
										src={URL.createObjectURL(file)}
										alt={file.name}
										class="h-auto w-16 rounded-lg object-cover"
									/>
								{/if}
								<p>{file.name}</p>
							</div>
							<button
								type="button"
								class="absolute right-0 top-0 m-2"
								on:click={() => removeFile(index)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="14"
									width="14"
									viewBox="0 0 512 512"
									class="fill-red-500"
								>
									<path
										d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
									/>
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	<div>
		<Input type="hidden" name="reclamoId" value={reclamoId} />
		<Input type="hidden" name="id" value={historiaReclamo.id || ''} />
	</div>

	<Helper class="h-5 text-md text-center font-semibold" color="red">
		{#if errorMessage?.length > 0}
			{errorMessage}
		{/if}
	</Helper>
	<Button disabled={sending} type="submit" class="w-full">
		{historiaReclamo.id ? 'Editar' : 'Agregar al historial'}
	</Button>
</form>
