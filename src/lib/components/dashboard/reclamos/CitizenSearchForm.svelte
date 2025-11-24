<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Input, Label, Modal, Select, Helper } from 'flowbite-svelte';
	import { SearchSolid } from 'flowbite-svelte-icons';
	import { ciudadanoStore, reclamosStepsStore } from '$lib/stores/reclamosStore';
	export let citizenFound = false;

	let dni: string = '';
	let sending = false;
	let errorMessage = '';
	const getCiudadado = ({}) => {
		sending = true;
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				ciudadanoStore.update((store: any) => (store = { ...result.data.ciudadano }));
				citizenFound = true;
				sending = false;
				reclamosStepsStore.update((store) => (store = { ...$reclamosStepsStore, step2: true }));
				await update({ reset: false });
			} else {
				console.log('result', result);
				if (result?.data?.message !== 'DNI inválido.') {
					console.log();
					ciudadanoStore.update((store: any) => (store = { ...ciudadanoStore, dni: dni }));
					citizenFound = false;
					reclamosStepsStore.update((store) => (store = { ...$reclamosStepsStore, step2: true }));
					await update({ reset: false });
				} else {
					errorMessage = result?.data?.message;
				}
				sending = false;
			}
		};
	};
</script>

<form action="?/getCiudadano" method="post" use:enhance={getCiudadado}>
	<div>
		<Label class="space-y-2 mb-2"
			>Número de documento del ciudadano <span class="text-red-500 text-lg">*</span></Label
		>
		<Input
			type="text"
			name="dni"
			placeholder="Ingrese el número de documento"
			required
			bind:value={dni}
		/>
		<Helper helperClass={'h-2 font-semibold mb-0 text-center'} color="red">
			{errorMessage?.length > 0 ? errorMessage : ''}
		</Helper>
	</div>
	<div>
		<Label class="space-y-2 my-2">Género <span class="text-red-500 text-lg">*</span></Label>
		<Select
			name="generoId"
			items={[
				{ value: 9, name: 'Masculino' },
				{ value: 10, name: 'Femenino' },
				{ value: 11, name: 'X' }
			]}
			placeholder="Seleccione un género"
			required
		/>
	</div>

	<Button type="submit" class="w-full mt-4" disabled={sending}>
		<SearchSolid class="w-5 h-5 me-2" />
		{sending ? 'Buscando ciudadano...' : 'Buscar ciudadano'}
	</Button>
</form>
