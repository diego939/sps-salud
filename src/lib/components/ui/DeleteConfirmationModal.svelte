<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Input, Modal, Spinner } from 'flowbite-svelte';
	import Toast from './Toast.svelte';

	export let actionUrl = '';
	export let open = false;
	export let identifier = '';
	export let dataNameToDelete = 'este registro';
	export let enhanceHandler: (() => ({ result, update }: any) => Promise<void>) | null = null; // Handler externo opcional
	let sending = false;
	let successMessage = '';	const handleDelete = () => {
		sending = true;

		return async ({ result, update }: any) => {
			sending = false;
			if (result.type === 'success') {
				successMessage = result.data.message;
				open = false;
			}
			await update({ invalidateAll: true, successMessage });
		};
	};

	// Usar el handler externo si está disponible, sino usar el interno
	$: currentHandler = enhanceHandler || handleDelete;
</script>

<Modal bind:open size="md" autoclose={false} on:close={() => (open = false)} class="w-full">
	<form class="flex flex-col space-y-4" method="post" action={actionUrl} use:enhance={currentHandler}>
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white text-center">
			¿Está seguro de que desea eliminar {dataNameToDelete}?
		</h3>

		<Input type="hidden" name="identifier" value={identifier} />

		<div class="flex items-center gap-2 max-w-[300px] mx-auto">
			<Button type="submit" class="w-full bg-red-600 hover:bg-red-700">
				Eliminar
				{#if sending}
					<Spinner color="white" size="sm" />
				{/if}
			</Button>
			<Button
				type="button"
				on:click={() => (open = false)}
				class="w-full bg-gray-100 hover:bg-gray-200 hover:text-gray-700 text-gray-600"
			>
				Cancelar
			</Button>
		</div>
	</form>
</Modal>

{#if successMessage}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}
