<script lang="ts">
	import { enhance } from '$app/forms';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { ciudadanoStore, reclamosStepsStore } from '$lib/stores/reclamosStore';
	import { Button, Input, Label, Select, Modal } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let citizenFound: boolean;
	let formAction = '?/addCiudadano';
	let sending = false;
	let successMessage = '';
	let errorMessage = '';

	const selectUser = () => {
		sending = true;
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				ciudadanoStore.update((store: any) => (store = { ...result.data.ciudadano }));
				citizenFound = true;
				successMessage = result.data.message;
				sending = false;
				reclamosStepsStore.update((store) => (store = { ...$reclamosStepsStore, step3: true }));
			} else {
				// ciudadanoStore.update((store: any) => (store = { ...$ciudadanoStore, dni: dni }));
				errorMessage = result.data.message;
				citizenFound = false;
				sending = false;
			}
			await update({ reset: false });
		};
	};

	const closeModalUser = () => {
		ciudadanoStore.update((store: any) => (store = null));
		reclamosStepsStore.update(
			(store) => (store = { ...$reclamosStepsStore, step1: true, step2: false })
		);
	};

	let { createdAt, deletedAt, updatedAt, ...ciudadanoAux } = $ciudadanoStore;

	onMount(() => {
		if ($ciudadanoStore?.id) {
			formAction = '?/editCiudadano';
		} else {
			formAction = '?/addCiudadano';
		}
	});
	let modalEditCiudadano = false;
	let formDataObject = {};

	const handleSubmit = (event) => {
		if ($ciudadanoStore?.id) {
			event.preventDefault();
			// modalEditCiudadano = true;
			// Capturar los valores del formulario
			const formData = new FormData(event.target);

			// Convertir FormData a un objeto simple
			formDataObject = Object.fromEntries(formData.entries());
			compareObjects(ciudadanoAux, formDataObject);
		}
	};
	let changes = [];
	function compareObjects(obj1, obj2) {
		if (errorMessage) return;
		// Obtener todas las claves únicas de ambos objetos
		const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

		keys.forEach((key) => {
			const val1 = obj1[key];
			const val2 = obj2[key];

			// Si los valores son diferentes, agregar al array de cambios
			if (val1 != val2) {
				changes.push(`Se cambió de '${val1}' a '${val2}'`);
			}
		});

		// Devolver los cambios o un mensaje si no hay diferencias
		//changes.length > 0 ? console.log(changes)  : console.log('Los objetos son iguales');
		return changes.length > 0 ? changes : 'Los objetos son iguales';
	}
</script>

<form
	class="flex flex-col space-y-4"
	method="post"
	action={formAction}
	on:submit={handleSubmit}
	use:enhance={selectUser}
>
	{#if !$ciudadanoStore?.id}
		<h3 class="text-center text-red-600 font-semibold">Ciudadano no encontrado. Crea uno nuevo.</h3>
	{/if}
	<Input type="hidden" name="id" value={$ciudadanoStore?.id} />
	<Label class="space-y-2">
		<p>Número de documento del ciudadano:</p>
		<Input
			type="text"
			name="dni"
			placeholder="Ingrese el número de documento"
			required
			value={$ciudadanoStore?.dni}
		/>
	</Label>
	<Label class="space-y-2">
		<p>Nombre/s <span class="text-red-500 text-lg">*</span></p>
		<Input
			type="text"
			name="nombre"
			placeholder="Ingrese el nombre del ciudadano"
			required
			value={$ciudadanoStore?.nombre}
		/>
	</Label>
	<Label class="space-y-2">
		<p>Apellido/s <span class="text-red-500 text-lg">*</span></p>
		<Input
			type="text"
			name="apellido"
			placeholder="Ingrese el apellido del ciudadano"
			required
			value={$ciudadanoStore?.apellido}
		/>
	</Label>

	<Label class="space-y-2">
		<p>Dirección <span class="text-red-500 text-lg">*</span></p>
		<Input
			type="text"
			name="direccion"
			placeholder="Ingrese dirección"
			required
			value={$ciudadanoStore?.direccion}
		/>
	</Label>
	<Label class="space-y-2">
		<span>Detalles de la dirección</span>
		<Input
			type="text"
			name="direccionDetalle"
			placeholder="Ingrese detalles de la dirección"
			value={$ciudadanoStore?.direccionDetalle}
		/>
	</Label>
	<div>
		<Label class="space-y-2 mb-2">Género <span class="text-red-500 text-lg">*</span></Label>
		<Select
			name="generoId"
			value={$ciudadanoStore?.genero?.id}
			items={[
				{ value: 9, name: 'Masculino' },
				{ value: 10, name: 'Femenino' },
				{ value: 11, name: 'X' }
			]}
			placeholder="Selecciona un género"
			required
		/>
	</div>
	<Label class="space-y-2">
		<p>Email</p>
		<Input type="text" name="email" placeholder="Ingrese el email" value={$ciudadanoStore?.email} />
	</Label>

	<div class="flex flex-row gap-4 w-full">
		<Label class="space-y-2 w-full">
			<p>Teléfono<span class="text-red-500 text-lg">*</span></p>
			<Input
				type="text"
				name="telefono"
				placeholder="Ingrese el teléfono"
				required
				value={$ciudadanoStore?.telefono}
			/>
		</Label>
	</div>
	<div class="flex flex-col">
		<Button type="submit" class="w-full" disabled={sending}>Confirmar ciudadano</Button>
	</div>
	<Button
		on:click={closeModalUser}
		class="bg-white text-primary-900 border border-primary-500 hover:bg-primary-500 hover:text-white"
		type="button">Cambiar ciudadano</Button
	>
</form>

<Modal bind:open={modalEditCiudadano} on:close={() => (changes = [])}>
	<form method="post" action="?/editCiudadano" use:enhance={selectUser}>
		<Input type="hidden" name="id" value={$ciudadanoStore?.id} />
		<Input type="hidden" name="dni" value={$ciudadanoStore?.dni} />
		<Input type="hidden" name="nombre" required value={$ciudadanoStore?.nombre} />
		<Input type="hidden" name="apellido" required value={$ciudadanoStore?.apellido} />
		<Input type="hidden" name="direccion" required value={$ciudadanoStore?.direccion} />
		<Input type="hidden" name="direccionDetalle" value={$ciudadanoStore?.direccionDetalle} />
		<Input type="hidden" name="generoId" value={$ciudadanoStore?.generoId} required />
		<Input type="hidden" name="email" required value={$ciudadanoStore?.email} />
		<Input type="hidden" name="telefono" required value={$ciudadanoStore?.telefono} />

		{#if changes.length > 0}
			<p>¿Esta seguro que desea editar los datos?</p>
			<div>
				{#each changes as change}
					<p>{change}</p>
				{/each}
			</div>
		{/if}
		{#if changes.length === 0}
			<p>¿Esta seguro que desea seleccionar el ciudadano?</p>
		{/if}

		<div class="flex flex-col">
			<Button type="submit" class="w-full" disabled={sending}
				>{changes.length > 0 ? 'Editar ciudadano' : 'Seleccionar ciudadano'}</Button
			>
		</div>
	</form>
</Modal>

{#if successMessage?.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}

{#if errorMessage?.length > 0}
	<Toast type="error" dismissible={true} showToast={true} bind:successMessage={errorMessage} />
{/if}
