<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Input, Label, Select, Helper, Fileupload, Textarea } from 'flowbite-svelte';
	import { FileCirclePlusSolid } from 'flowbite-svelte-icons';
	import { ciudadanoStore, formModal, reclamosStepsStore } from '$lib/stores/reclamosStore';
	import { getContext } from 'svelte';
	import type { Area } from '$lib/interfaces/area.interface';
	import type { Agente } from '$lib/interfaces/agente.interface';
	import SearchableSelect from './SearchableSelect.svelte';
	import SerchableSelectAgentes from './SerchableSelectAgentes.svelte';
	let selectedAgente = '';
	let selectedZona = '';
	let selectedBarrio = '';
	let selectedCanal = '';
	let selectedArea = '';
	let selectedAgenteBtn = '';
	let motivo = '';
	let descripcion = '';
	let files: File[] = [];
	let searchTerm = '';
	export let canales: any[];
	export let errorMessage = '';
	export let successMessage = '';
	let agentesData: Agente[] = getContext('agentesDataResponse');
	let areasData: Area[] = getContext('areasDataResponse');
	let zonasData: any[] = getContext('zonasDataResponse');
	let barriosData: any[] = getContext('barriosDataResponse');
	let searchTermAgente = '';
	let textareaprops = {
		id: 'descripcion',
		name: 'descripcion',
		rows: 4,
		placeholder: 'Ingrese una descripción'
	};

	$: canales = canales.map((canal: any) => ({ value: canal.id, name: canal.descripcion }));
	$: areas = areasData.map((area: any) => ({
		value: area.id,
		name: area?.descripcion?.toUpperCase()
	}));
	$: zonas = zonasData.map((zona: any) => ({
		value: zona.id,
		name: zona?.descripcion?.toUpperCase()
	}));
	$: barrios = barriosData.map((barrio: any) => ({
		value: barrio.id,
		name: barrio.descripcion?.toUpperCase()
	}));

	export let agentes: any[] = agentesData?.map((agente: any) => ({
		value: agente.id,
		name: `${agente?.usuario?.nombre} ${agente?.usuario?.apellido}`
	}));
	let descripcionValidated: boolean = true;

	const handleZonaChange = () => {
		barrios = barriosData
			?.filter((barrio: any) => barrio.zonaId === Number(selectedZona))
			?.map((barrio: any) => ({ value: barrio.id, name: barrio.descripcion }));
	};

	let sending = false;
	const addReclamo = ({}) => {
		sending = true;
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				successMessage = result.data.message;
				sending = false;
				formModal.update((store) => (store = false));
				reclamosStepsStore.update(
					(store) => (store = { ...$reclamosStepsStore, step1: true, step2: false, step3: false })
				);
				ciudadanoStore.update((store: any) => (store = null));
			} else {
				errorMessage = result.data.message;
				sending = false;
			}
			await update({ reset: false });
		};
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
</script>

<form
	class="flex flex-col space-y-4"
	method="post"
	action="?/addReclamo"
	use:enhance={addReclamo}
	enctype="multipart/form-data"
>
	<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Agregar reclamo</h3>

	<p class="text-lg font-medium">
		Ciudadano: {$ciudadanoStore?.nombre + ' ' + $ciudadanoStore?.apellido}
	</p>
	<Input name="ciudadanoId" type="hidden" value={$ciudadanoStore?.id} />
	<Label class="space-y-2">
		<p>Motivo<span class="text-red-500 text-lg">*</span></p>
		<Input type="text" name="motivo" placeholder="Ingrese el motivo" bind:value={motivo} required />
	</Label>

	<Label class="space-y-2 mb-2">
		<p>Descripción<span class="text-red-500 text-lg">*</span></p>
		<Textarea
			{...textareaprops}
			color={descripcionValidated ? 'base' : 'red'}
			bind:value={descripcion}
			required
		/>
	</Label>

	<div class="flex justify-between gap-1">
		<div class="w-full">
			<Label class="space-y-2">
				<p>Zona<span class="text-red-500 text-lg">*</span></p>
				<Select
					bind:value={selectedZona}
					items={zonas}
					on:change={handleZonaChange}
					placeholder="Selecciona una zona"
					class="hover:bg-gray-900 hover:text-white hover:cursor-pointer p-3 border-gray-900"
					required
				/>
			</Label>
		</div>
		<div class="w-full">
			<Label class="space-y-2">
				<p class="text-black" class:text-gray-300={!selectedZona}>
					Barrio<span class="text-red-500 text-lg">*</span>
				</p>
				<Select
					name="barrioId"
					bind:value={selectedBarrio}
					items={barrios}
					placeholder="Selecciona un barrio"
					class="hover:bg-gray-900 hover:text-white hover:cursor-pointer p-3 border-gray-900"
					disabled={!selectedZona}
					required
				/>
			</Label>
		</div>
	</div>

	<div class="flex justify-between gap-1">
		<div class="w-full">
			<Label class="space-y-2">
				<p>Ubicación<span class="text-red-500 text-lg">*</span></p>
				<Input type="text" name="ubicacion" placeholder="Ingrese la ubicación" required />
			</Label>
		</div>
		<div class="w-full m-2">
			<Label class="space-y-2">
				<span>Detalle de la ubicación<span class="text-red-500 text-lg">*</span></span>
				<Input type="text" name="ubicacionDetalle" placeholder="Describa la ubicación" required />
			</Label>
		</div>
	</div>

	<div class="flex justify-between gap-1">
		<div class="w-full">
			<Label class="space-y-2 mb-2">Área<span class="text-red-500 text-lg">*</span></Label>
			<SearchableSelect
				{areas}
				bind:agentes
				bind:selectedArea
				{agentesData}
				bind:searchTerm
				bind:searchTermAgente
				bind:selectedAgenteBtn
			/>
			<input type="hidden" name="areaId" bind:value={selectedArea} />
		</div>
		<div class="w-full">
			<Label class="space-y-2 mb-2 mt-2">Agente</Label>
			<!-- <Select name="agenteId" bind:value={selectedAgente} items={agentes}  placeholder="Selecciona un agente" disabled={selectedArea ? false : true} /> -->
			<SerchableSelectAgentes
				bind:agentes
				bind:selectedAgente
				bind:searchTermAgente
				bind:selectedArea
				bind:selectedAgenteBtn
			/>
			<input type="hidden" name="agenteId" bind:value={selectedAgente} />
		</div>
	</div>

	<Label>
		Canal<span class="text-red-500 text-lg">*</span>
		<Select
			class="mt-2"
			name="canal"
			items={canales}
			bind:value={selectedCanal}
			placeholder="Seleccione un canal"
			required
		/>
	</Label>

	<div class="my-4">
		<Label for="files" class="mb-2">Subir archivos</Label>
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
				<div class="block w-full">
					<div class="group relative">
						<div class="rounded-lg bg-white shadow-md p-2 mt-2">
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
								><path
									d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
								/></svg
							>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<Button type="submit" class="w-full1" disabled={sending}>
		<FileCirclePlusSolid class="w-5 h-5 me-2" />
		{sending ? 'Creando reclamo ... ' : 'Crear reclamo'}
	</Button>
</form>
