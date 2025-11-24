<script lang="ts">
  import { page } from '$app/stores'; // Para obtener los parámetros de la URL
  import { goto, replaceState } from '$app/navigation';
  import { tick } from 'svelte';
  import DownloadCsv from "$lib/components/DownloadCSV.svelte";
  import SearchInput from "$lib/components/dashboard/SearchInput.svelte";
	import Toast from '$lib/components/ui/Toast.svelte';
  import { enhance } from '$app/forms';
  	import {
		EditSolid,
		PaperClipOutline,
		TrashBinSolid,
		CaretRightSolid,
		UsersSolid,
		EyeOutline
	} from 'flowbite-svelte-icons';
	import DeleteConfirmationModal from '$lib/components/ui/DeleteConfirmationModal.svelte';
  import Pagination from '$lib/components/Pagination.svelte';

  import { Button, Modal } from 'flowbite-svelte';
  import DataTable from '$lib/components/dashboard/DataTable.svelte';
  let sending = false;
  let errorMessage = '';
  let identifierToDelete = '';
  let confirmDelete = false;
  let identifierImageToDelete = '';
  let confirmDeleteImage = false;
  export let data;
  let addNewNoticia = false;
  let newTitulo = '';
  let newCopete = '';
  let newTexto = '';
  let editNoticiaModal = false;
  let editTitulo = '';
  let identifierToView = {} as any;
  let editCopete = '';
  let editTexto = '';
  let editId = '';
  let viewNoticiaModal = false;
  let viewTitulo = '';
  let viewCopete = '';
  let viewTexto = '';
  let viewId = '';
  let viewModal = false;

  let viewCreatedAt = '';
  let dataTable: DataTable;
  let successMessage: string = '';
    // Asegurarnos de que data.noticias existe, si no, usar un array vacío
  $: noticias = data?.noticias || [];
  $: meta = data?.meta || {};
    // Obtener la URL actual
  const currentUrl = $page.url.pathname;
  const searchParams = $page.url.searchParams;

  // Comprobar si hay parámetros adicionales en la URL
  const hasParams = searchParams.toString().length > 0;

  const handleCreateNoticia = () => {
    sending = true;
    return async ({ result, update }: any) => {
      await update();
      if (result && result.type === 'success') {
        successMessage = result.data?.message || '¡Noticia creada exitosamente!';
        errorMessage = '';
        sending = false;
        addNewNoticia = false;
        newTitulo = '';
        newTexto = '';
        replaceState(window.location.pathname, {});
        setTimeout(() => successMessage = '', 3000);
      } else {
        errorMessage = result?.data?.message || 'Error al crear la noticia';
        successMessage = '';
        sending = false;
      }
      await update({ invalidateAll: false, errorMessage, successMessage });
    };
  };

  const handleEditNoticia = () => {
    sending = true;
    return async ({ result, update }: any) => {
      await update();
      // Éxito si: type === 'success', ok === true, tiene message sin error, o si es un objeto noticia (id y titulo)
      if (
        (result && result.type === 'success') ||
        result?.ok ||
        (result && result.message && !result.error) ||
        (result && result.id && result.titulo)
      ) {
        successMessage = result.data?.message || result?.message || '¡Noticia editada exitosamente!';
        errorMessage = '';
        sending = false;
        editNoticiaModal = false;
        editTitulo = '';
        editCopete = '';
        editTexto = '';
        editId = '';
        replaceState(window.location.pathname, {});
        setTimeout(() => successMessage = '', 3000);
      } else {
        errorMessage = result?.data?.message || result?.message || 'Error al editar la noticia';
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
    // Soporta tanto { data: noticia } como noticia directa
    const noticia = e?.detail.data ?? e;

    if (!noticia) return;
    editId = noticia.id ?? '';
    editTitulo = noticia.titulo ?? '';
    editCopete = noticia.copete ?? '';
    editTexto = noticia.texto ?? '';
    editNoticiaModal = true;
  }

  

  function handleView(e: any) {
    // Soporta tanto { data: noticia } como noticia directa
    const noticia = e?.detail.data ?? e;

    if (!noticia) return;
    viewId = noticia.id ?? '';
    viewTitulo = noticia.titulo ?? '';
    viewCopete = noticia.copete ?? '';
    viewTexto = noticia.texto ?? '';
    viewCreatedAt = noticia.created_at ? new Date(noticia.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '';
    viewNoticiaModal = true;
  }

  function openEditModal(noticia:any) {
    editId = noticia.id;
    editTitulo = noticia.titulo;
    editTexto = noticia.texto;
    editNoticiaModal = true;
  }



  const orderCols: string[] = ['title', 'texto'];
	const columns = [
		{
			label: 'Titulo',
			key: 'titulo'
		},
		{
			label: 'Copete',
			key: 'copete'
		},
		{
			label: 'Texto',
			key: 'texto'
		},
    {
      label: 'Imagen',
      key: 'imagen',
    }
	];

  function renderColumn(column: string, obj: any) {
    if (column === 'titulo') {
      return obj.titulo;
    }
    if (column === 'texto') {
      const texto = obj.texto || '';
      return texto.length > 100 ? texto.substring(0, 100) + '...' : texto;
    }
    if (column === 'copete') {
      const copete = obj.copete || '';
      return copete.length > 100 ? copete.substring(0, 100) + '...' : copete;
    }    if (column === 'imagen') {
        if (obj.File && obj.File.length > 0 && obj.File[0].url) {
          // Botones para ver y eliminar la imagen
          return `
            <div class="flex gap-1">
              <button type='button' class='bg-lime-500 hover:bg-lime-700 text-white font-bold py-1 px-2 rounded text-xs' onclick='window.dispatchEvent(new CustomEvent("verImagenNoticia", { detail: { url: "${obj.File[0].url}", name: "${obj.titulo}" } }))'>Ver</button>
            </div>
          `;
        } else {
          return 'Sin imagen';
        }
    }
    return 'N/A';
  }
  // Escuchar el evento global para abrir el modal de imagen
  if (typeof window !== 'undefined') {
    window.addEventListener('verImagenNoticia', (e: any) => {
      identifierToView = { url: e.detail.url, name: e.detail.name };
      viewModal = true;
    });
    
    window.addEventListener('eliminarImagenNoticia', (e: any) => {
      identifierImageToDelete = e.detail.fileId;
      confirmDeleteImage = true;
    });
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
      <DownloadCsv data={data?.noticias || []} filename="noticias.csv" />
    </div>

    <div class="w-full lg:w-auto lg:flex-shrink-0">
      <Button
        on:click={() =>(
          addNewNoticia = true
        )}
      >Agregar Noticia</Button>
    </div>
    
  </div>
    <DataTable
      {orderCols}
      bind:this={dataTable}
      {columns}
      data={data?.noticias || []}
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
  <Modal bind:open={addNewNoticia} size="md" autoclose={false} class="w-full">
    <form method="POST" action="?/createNoticia" use:enhance={handleCreateNoticia} enctype="multipart/form-data" class="p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Crear - Noticia</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label for="noticia-titulo" class="text-sm font-medium text-gray-700 dark:text-gray-200">Título</label>
        <input id="noticia-titulo" name="titulo" type="text" bind:value={newTitulo} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Título de la noticia" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="noticia-copete" class="text-sm font-medium text-gray-700 dark:text-gray-200">Copete</label>
        <input id="noticia-copete" name="copete" type="text" bind:value={newCopete} required  class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Copete de la noticia" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="noticia-texto" class="text-sm font-medium text-gray-700 dark:text-gray-200">Texto</label>
        <textarea id="noticia-texto" name="texto" bind:value={newTexto} required rows="5" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Texto de la noticia"></textarea>
      </div>
      <div class="flex flex-col gap-2">
        <label for="noticia-foto" class="text-sm font-medium text-gray-700 dark:text-gray-200">Foto</label>
        <input id="noticia-foto" name="foto" type="file" accept="image/*" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" />
      </div>
      <div class="flex justify-between mt-4 gap-2">
        <Button type="button" class="bg-white-500 text-black" on:click={() => addNewNoticia = false}>Cerrar</Button>
        <Button type="submit" class="bg-green-500 text-white">Aceptar</Button>
      </div>

    </form>
  </Modal>
  <Modal bind:open={editNoticiaModal} size="md" autoclose={false} class="w-full">
    <form method="POST" action="?/editNoticia" use:enhance={handleEditNoticia} enctype="multipart/form-data" class="p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Editar - Noticia</h3>
      </div>
      <input type="hidden" name="id" value={editId} />
      <div class="flex flex-col gap-2">
        <label for="edit-titulo" class="text-sm font-medium text-gray-700 dark:text-gray-200">Título</label>
        <input id="edit-titulo" name="titulo" type="text" bind:value={editTitulo} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Título de la noticia" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="edit-titulo" class="text-sm font-medium text-gray-700 dark:text-gray-200">Título</label>
        <input id="edit-titulo" name="titulo" type="text" bind:value={editTitulo} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Título de la noticia" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="edit-copete" class="text-sm font-medium text-gray-700 dark:text-gray-200">Copete</label>
        <input id="edit-copete" name="copete" type="text" bind:value={editCopete} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Copete de la noticia" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="edit-texto" class="text-sm font-medium text-gray-700 dark:text-gray-200">Texto</label>
        <textarea id="edit-texto" name="texto" bind:value={editTexto} required rows="5" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Texto de la noticia"></textarea>
      </div>     
       <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Imagen actual</label>
        {#if editId && noticias && noticias.length > 0}
          {#each noticias.filter(n => n.id === editId) as noticia}
            {#if noticia.File && noticia.File.length > 0 && noticia.File[0].url}
              <div class="flex items-center gap-3">
                <img src={noticia.File[0].url} alt="Imagen actual" class="w-20 h-20 object-cover rounded border" />
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="delete-image" name="deleteImage" value="true" />
                  <label for="delete-image" class="text-sm text-red-600 font-medium">Eliminar imagen actual</label>
                </div>
              </div>
            {/if}
          {/each}
        {/if}
      </div>
      <div class="flex flex-col gap-2">
        <label for="edit-foto" class="text-sm font-medium text-gray-700 dark:text-gray-200">Subir nueva imagen</label>
        <input id="edit-foto" name="foto" type="file" accept="image/*" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" />
      </div>
      <div class="flex justify-between mt-4 gap-2">
        <Button type="button" class="bg-white-500 text-black" on:click={() => editNoticiaModal = false}>Cerrar</Button>
        <Button type="submit" class="bg-green-500 text-white">Aceptar</Button>
      </div>
      {#if errorMessage}
        <div class="text-red-600 mt-2">{errorMessage}</div>
      {/if}
    </form>
  </Modal>

  <Modal bind:open={viewNoticiaModal} size="md" autoclose={false} class="w-full">
    <div class="p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Ver - Noticia</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label for="view-titulo" class="text-sm font-medium text-gray-700 dark:text-gray-200">Título</label>
        <div id="view-titulo" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-50 text-gray-700">{viewTitulo}</div>
      </div>
      <div class="flex flex-col gap-2">
        <label for="view-copete" class="text-sm font-medium text-gray-700 dark:text-gray-200">Copete</label>
        <div id="view-copete" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-50 text-gray-700">{viewCopete}</div>
      </div>
      <div class="flex flex-col gap-2">
        <label for="view-texto" class="text-sm font-medium text-gray-700 dark:text-gray-200">Texto</label>
        <div id="view-texto" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-50 text-gray-700 min-h-[120px] whitespace-pre-wrap">{viewTexto}</div>
      </div>
       <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Imagen</label>
        {#if viewId && noticias && noticias.length > 0}
          {#each noticias.filter(n => n.id === viewId) as noticia}
            {#if noticia.File && noticia.File.length > 0 && noticia.File[0].url}
              <div class="flex items-center gap-3">
                <img src={noticia.File[0].url} alt="Imagen de la noticia" class="w-32 h-32 object-cover rounded border" />
              </div>
            {:else}
              <div class="text-gray-500 italic">Sin imagen</div>
            {/if}
          {/each}
        {:else}
          <div class="text-gray-500 italic">Sin imagen</div>
        {/if}
      </div>
      <div class="flex justify-end mt-4">
        <Button type="button" class="w-full text-white" style="background-color: #068B3E;" on:click={() => viewNoticiaModal = false}>Cerrar</Button>
      </div>
    </div>
  </Modal>
</div>

	<!-- Modal para ver documento -->
	<Modal
		bind:open={viewModal}
		size="xl"
		autoclose={false}
		class="w-full"
		on:close={() => {
			identifierToView = {};
		}}
	>
		<div class="flex flex-col space-y-4">
			<div class="modal-body" style="height: 70vh;">
				{#if identifierToView.url && identifierToView.url.toLowerCase().endsWith('.pdf')}
					<iframe
					src={`https://docs.google.com/gview?url=${identifierToView.url}&embedded=true`}
					style="width:100%; height:600px;"
					frameborder="0">
					</iframe>
				{:else if identifierToView.url && /\.(jpg|jpeg|png|gif)$/i.test(identifierToView.url)}
					<div class="flex items-center justify-center h-full">
						<img 
							src={identifierToView.url} 
							alt={identifierToView.name || 'Imagen'}
							class="max-w-full max-h-full object-contain"
							style="max-height: 600px;"
						/>
					</div>
				{:else if identifierToView.url}
					<div class="flex flex-col items-center justify-center h-full text-gray-600">
						<p class="text-lg font-semibold">Tipo de archivo: {identifierToView.url.split('.').pop()?.toUpperCase()}</p>
						<p class="text-md mt-2">Vista previa no disponible para este tipo de archivo.</p>
					</div>
				{/if}
			</div>
		</div>
	</Modal>


<DeleteConfirmationModal
	actionUrl="?/deleteNoticia"
	bind:open={confirmDelete}
	identifier={identifierToDelete}
	dataNameToDelete="la noticia"
/>

<DeleteConfirmationModal
	actionUrl="?/deleteImage"
	bind:open={confirmDeleteImage}
	identifier={identifierImageToDelete}
	dataNameToDelete="la imagen"
/>

{#if successMessage.length > 0}
		<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}