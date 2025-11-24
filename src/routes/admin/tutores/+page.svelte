<script lang="ts">
  import { page } from '$app/stores'; // Para obtener los parámetros de la URL
  import { goto, replaceState } from '$app/navigation';
  import { tick } from 'svelte';
  import DownloadCsv from "$lib/components/DownloadCSV.svelte";
  import SearchInput from "$lib/components/dashboard/SearchInput.svelte";
	import Toast from '$lib/components/ui/Toast.svelte';
  import { enhance } from '$app/forms';
	import DeleteConfirmationModal from '$lib/components/ui/DeleteConfirmationModal.svelte';
  import Pagination from '$lib/components/Pagination.svelte';

  import { Button, Modal } from 'flowbite-svelte';
  import DataTable from '$lib/components/dashboard/DataTable.svelte';

  let sending = false;
  let errorMessage = '';
  let identifierToDelete = '';
  let confirmDelete = false;
  export let data;  let addNewTutor = false;
  let newNombre = '';
  let newApellido = '';
  let newDni = '';
  let newNumeroTramite = '';  let editTutorModal = false;
  let editNombre = '';
  let editApellido = '';
  let editDni = '';
  let editNumeroTramite = '';
  let editId = '';
  let dataTable: DataTable;
  let successMessage: string = '';
    // Asegurarnos de que data.tutores existe, si no, usar un array vacío
  $: tutores = data?.tutores || [];
  $: meta = data?.meta || {};
    // Obtener la URL actual
  const currentUrl = $page.url.pathname;
  const searchParams = $page.url.searchParams;

  // Comprobar si hay parámetros adicionales en la URL
  const hasParams = searchParams.toString().length > 0;
  const handleCreateTutor = () => {
    sending = true;
    return async ({ result, update }: any) => {
      console.log(result)
      if (result.type === 'success' && result.data?.data.id) {
        // Redirigir a la página de alumnos del tutor recién creado y abrir el modal
        const tutorId = result.data.data.id;
        goto(`/admin/tutores/${tutorId}/alumnos?openModal=true`);
        return;
      }
      await update();
      if (result && result.type === 'success') {
        // Si no hay id, solo mostrar mensaje
        successMessage = result.data?.message || '¡Tutor creado exitosamente!';
        errorMessage = '';
        sending = false;
        addNewTutor = false;
        newNombre = '';
        newApellido = '';
        newDni = '';
        newNumeroTramite = '';
        replaceState(window.location.pathname, {});
        setTimeout(() => successMessage = '', 3000);
      } else {
        errorMessage = result?.data?.message || 'Error al crear el tutor';
        successMessage = '';
        sending = false;
      }
      await update({ invalidateAll: false, errorMessage, successMessage });
    };
  };
  const handleEditTutor = () => {
    sending = true;
    return async ({ result, update }: any) => {
      await update();
      // Éxito si: type === 'success', ok === true, tiene message sin error, o si es un objeto tutor (id y nombre)
      if (
        (result && result.type === 'success') ||
        result?.ok ||
        (result && result.message && !result.error) ||
        (result && result.id && result.nombre)
      ) {
        successMessage = result.data?.message || result?.message || '¡Tutor editado exitosamente!';
        errorMessage = '';
        sending = false;
        editTutorModal = false;
        editNombre = '';
        editApellido = '';
        editDni = '';
        editNumeroTramite = '';
        editId = '';
        replaceState(window.location.pathname, {});
        setTimeout(() => successMessage = '', 3000);
      } else {
        errorMessage = result?.data?.message || result?.message || 'Error al editar el tutor';
        successMessage = '';
        sending = false;
      }
      await update({ invalidateAll: false, errorMessage, successMessage });
    };
  };

 
  const handleBackButtonClick = () => {
    goto(`/admin`);
  };



    const handleDelete = async ({ detail }: any) => {
      identifierToDelete = detail.data.id;
      confirmDelete = true;
    };  function handleEdit(e: any) {
    // Soporta tanto { data: tutor } como tutor directa
    const tutor = e?.detail.data ?? e;

    if (!tutor) return;
    editId = tutor.id ?? '';
    editNombre = tutor.nombre ?? '';
    editApellido = tutor.apellido ?? '';
    editDni = tutor.dni ?? '';
    editNumeroTramite = tutor.numero_tramite ?? '';
    editTutorModal = true;
  }

  function handleView(e: any) {
    // Soporta tanto { data: tutor } como tutor directa
    const tutor = e?.detail.data ?? e;

    if (!tutor) return;
    
    // Navegar a la página de alumnos del tutor
    goto(`/admin/tutores/${tutor.id}/alumnos`);
  }
  function openEditModal(tutor:any) {
    editId = tutor.id;
    editNombre = tutor.nombre;
    editApellido = tutor.apellido;
    editDni = tutor.dni;
    editNumeroTramite = tutor.numero_tramite;
    editTutorModal = true;
  }



  const orderCols: string[] = ['title', 'texto'];
	const columns = [
		{
			label: 'Nombre',
			key: 'nombre'
		},
		{
			label: 'Apellido',
			key: 'apellido'
		},
    {
      label: 'DNI',
      key: 'dni'
    },
    {
      label: 'Número de trámite',
      key: 'numero_tramite'
    },
	];


  function renderColumn(column: string, obj: any) {
    if (column === 'nombre') {
      return obj.nombre;
    }
    if (column === 'apellido') {
      return obj.apellido;
    }
    if (column === 'dni') {
      return obj.dni;
    }
    if (column === 'numero_tramite') {
      return obj.numero_tramite;
    }
    return 'N/A';
  }

  console.log(data)
</script>

<div class="w-full max-w-screen-4xl rounded-lg shadow mx-auto bg-white dark:bg-gray-800 px-6 py-8">
  <!-- Header responsive para licencias -->
  <div class="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
    
    <!-- Grupo 1: Flecha + Búsqueda (siempre juntos) -->
    <div class="flex items-center gap-4 flex-1 min-w-0">
      
      <div class="flex-1 max-w-30px">
        <SearchInput placeholder="Buscar..." />
      </div>
    </div>
    
    <!-- Grupo 2: Botón descarga -->
    <div class="w-full lg:w-auto lg:flex-shrink-0">
      <DownloadCsv data={data?.tutores || []} filename="tutores.csv" />
    </div>    <div class="w-full lg:w-auto lg:flex-shrink-0">
      <Button
        on:click={() =>(
          addNewTutor = true
        )}
      >Agregar Tutor</Button>
    </div>
    
  </div>
    <DataTable
      {orderCols}
      bind:this={dataTable}
      {columns}
      data={data?.tutores || []}
      render={renderColumn}
      defaultActions={['edit', 'delete', "view"]}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      handleView={handleView}
    />  
    
    {#if meta}
      <Pagination
      currentPage={meta.currentPage}
      lastPage={meta.lastPage}
      prev={meta.prev}
      next={meta.next}
      total={meta.total}
      perPage={meta.perPage}
      url={currentUrl}
      />
    {/if}
    
    
    <Modal bind:open={addNewTutor} size="md" autoclose={false} class="w-full">
    <form method="POST" action="?/createTutor" use:enhance={handleCreateTutor} class="p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Crear - Tutor</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label for="tutor-nombre" class="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
        <input id="tutor-nombre" name="nombre" type="text" bind:value={newNombre} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Nombre del tutor" />
      </div>      
      <div class="flex flex-col gap-2">
        <label for="tutor-apellido" class="text-sm font-medium text-gray-700 dark:text-gray-200">Apellido</label>
        <input id="tutor-apellido" name="apellido" type="text" bind:value={newApellido} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Apellido del tutor" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="tutor-dni" class="text-sm font-medium text-gray-700 dark:text-gray-200">DNI</label>
        <input id="tutor-dni" name="dni" type="text" bind:value={newDni} required maxlength="10" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="DNI del tutor" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="tutor-numero-tramite" class="text-sm font-medium text-gray-700 dark:text-gray-200">Número de Trámite</label>
        <input id="tutor-numero-tramite" name="numero_tramite" type="text" bind:value={newNumeroTramite} class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Número de trámite" />
      </div>
      <div class="flex justify-between mt-4 gap-2">
        <Button type="button" class="bg-white-500 text-black" on:click={() => addNewTutor = false}>Cerrar</Button>
        <Button type="submit" class="bg-green-500 text-white">Aceptar</Button>
      </div>
    </form>
  </Modal>  <Modal bind:open={editTutorModal} size="md" autoclose={false} class="w-full">
    <form method="POST" action="?/editTutor" use:enhance={handleEditTutor} class="p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Editar - Tutor</h3>
      </div>
      <input type="hidden" name="id" value={editId} />
      <div class="flex flex-col gap-2">
        <label for="edit-nombre" class="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
        <input id="edit-nombre" name="nombre" type="text" bind:value={editNombre} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Nombre del tutor" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="edit-apellido" class="text-sm font-medium text-gray-700 dark:text-gray-200">Apellido</label>
        <input id="edit-apellido" name="apellido" type="text" bind:value={editApellido} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Apellido del tutor" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="edit-dni" class="text-sm font-medium text-gray-700 dark:text-gray-200">DNI</label>
        <input id="edit-dni" name="dni" type="text" bind:value={editDni} required maxlength="10" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="DNI del tutor" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="edit-numero-tramite" class="text-sm font-medium text-gray-700 dark:text-gray-200">Número de Trámite</label>
        <input id="edit-numero-tramite" name="numero_tramite" type="text" bind:value={editNumeroTramite} class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Número de trámite" />
      </div>
      <div class="flex justify-between mt-4 gap-2">
        <Button type="button" class="bg-white-500 text-black" on:click={() => editTutorModal = false}>Cerrar</Button>
        <Button type="submit" class="bg-green-500 text-white">Aceptar</Button>
      </div>      
      {#if errorMessage}
        <div class="text-red-600 mt-2">{errorMessage}</div>
      {/if}
    </form>  </Modal>
</div>


<DeleteConfirmationModal
	actionUrl="?/deleteTutor"
	bind:open={confirmDelete}
	identifier={identifierToDelete}
	dataNameToDelete="el tutor"
/>

{#if successMessage.length > 0}
		<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}