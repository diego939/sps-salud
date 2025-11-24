<script lang="ts">
	import { goto } from '$app/navigation';
    import { Button, Label, Modal, Helper, Popover, Card, Select } from 'flowbite-svelte';
    import { UserAddOutline, CirclePlusOutline } from 'flowbite-svelte-icons';
    import Toast from '$lib/components/ui/Toast.svelte';
    import { enhance } from '$app/forms';
    export let data;
/*     let user = data.user;
 */
    let sending = false;
    let errorMessage = '';
	  let successMessage = '';
    let formModal = false;
    let currentProjectId = '';
    let selectedLotId = '';
    let numeroCuotas = 1;
    let litrosPorCuota = 1;
    let lotesProyecto = [];

</script>
<svelte:head>
	<title>Inicio</title>
</svelte:head>
<div class="w-full max-w-screen-4xl rounded-lg mx-auto bg-transparent dark:bg-gray-800 px-6 py-8">
  <div class="w-full">
			<h1 class="font-bold text-xl text-gray-500 dark:text-white">¡Bienvenido Administrador! </h1>
      <h2 class="font-bold text-xl text-gray-500 dark:text-white">Estás en el Backoffice de la Aplicación Padres del Ministerio de Educación de Corrientes. </h2>

		</div>
  <div class="flex justify-center gap-4 p-4 sm:flex-row flex-col">
  </div>
</div>

{#if successMessage.length > 0}
		<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}
