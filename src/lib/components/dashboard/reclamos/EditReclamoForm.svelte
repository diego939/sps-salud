<script lang="ts">
	import { Button, Input, Label, Select } from 'flowbite-svelte';
	import { ciudadanoStore, reclamosStepsStore, reclamoStore } from '$lib/stores/reclamosStore';
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	import { data } from '$lib/sidebarLinks';

	let canalesData: any[] = getContext('canalesDataResponse');
	let zonasData: any[] = getContext('zonasDataResponse');
	let barriosData: any[] = getContext('barriosDataResponse');

	$: canalesData = canalesData.map((canal: any) => ({ value: canal.id, name: canal.descripcion }));

	export let modalEdit;
	export let successMessage;
	export let errorMessage;
	let sending = false;

	$: zonas = zonasData.map((zona: any) => ({
		value: zona.id,
		name: zona?.descripcion?.toUpperCase()
	}));
	$: barrios = barriosData.map((barrio: any) => ({
		value: barrio.id,
		name: barrio.descripcion?.toUpperCase()
	}));

	let selectedCanal = $reclamoStore.canal.id;
	let selectedZona = $reclamoStore.barrio.zona.id;
	let selectedBarrio = $reclamoStore.barrio.id;
	let selectedUbicacion = $reclamoStore.ubicacion;
	let selectedUbicacionDetalle = $reclamoStore.ubicacionDetalle;

	const handleZonaChange = () => {
		barrios = barriosData
			?.filter((barrio: any) => barrio.zonaId === Number(selectedZona))
			?.map((barrio: any) => ({ value: barrio.id, name: barrio.descripcion }));
	};

	const editReclamo = () => {
		sending = true;
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				successMessage = 'Reclamo editado exitosamente.';
				ciudadanoStore.update((store: any) => (store = null));
				reclamosStepsStore.update(
					(store) => (store = { ...$reclamosStepsStore, step1: true, step2: false, step3: false })
				);
				reclamoStore.update((store: any) => (store = null));
				modalEdit = false;
			}
			await update({ reset: false });
			sending = false;
		};
	};
</script>

<form class="space-y-4" action="?/editReclamo" method="post" use:enhance={editReclamo}>
	<h2 class="text-lg font-medium">
		Ciudadano: {$ciudadanoStore?.nombre + $ciudadanoStore?.apellido}
	</h2>
	<Input type="hidden" name="reclamoId" value={$reclamoStore?.id} />
	<Input type="hidden" name="ciudadanoId" value={$ciudadanoStore?.id} />
	<div>
		<Label class="space-y-2">Motivo<span class="text-red-500 text-lg">*</span></Label>
		<Input
			type="text"
			name="motivo"
			placeholder="Ingrese el motivo"
			value={$reclamoStore?.motivo}
			required
		/>
	</div>
	<div class="flex justify-between gap-1">
		<div class="w-full">
			<Label class="space-y-2">
				Zona<span class="text-red-500 text-lg">*</span>
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
				Barrio<span class="text-red-500 text-lg">*</span>
				<Select
					name="barrioId"
					bind:value={selectedBarrio}
					items={barrios}
					placeholder="Selecciona un barrio"
					disabled={selectedZona ? false : true}
					class="hover:bg-gray-900 hover:text-white hover:cursor-pointer p-3 border-gray-900"
					required
				/>
			</Label>
		</div>
	</div>
	<div class="flex justify-between gap-1">
		<div class="w-full">
			<Label class="space-y-2">
				<span>Ubicación</span>
				<Input
					type="text"
					name="ubicacion"
					bind:value={selectedUbicacion}
					placeholder="Ingrese la ubicación"
				/>
			</Label>
		</div>
		<div class="w-full">
			<Label class="space-y-2">
				<span>Detalle de la ubicación</span>
				<Input
					type="text"
					name="ubicacionDetalle"
					bind:value={selectedUbicacionDetalle}
					placeholder="Describa la ubicación"
				/>
			</Label>
		</div>
	</div>
	<div>
		<Label class="space-y-2">Canal<span class="text-red-500 text-lg">*</span></Label>
		<Select
			type="text"
			items={canalesData}
			name="canal"
			placeholder="Ingrese el canal"
			bind:value={selectedCanal}
		/>
	</div>
	<Button class="w-full" type="submit" disabled={sending}>Guardar cambios</Button>
</form>

