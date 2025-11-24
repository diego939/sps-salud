<script lang="ts">
  import { page } from '$app/stores'; // Para obtener los parámetros de la URL
  import { goto, replaceState } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import { tick } from 'svelte';
  import DownloadCsv from "$lib/components/DownloadCSV.svelte";
  import SearchInput from "$lib/components/dashboard/SearchInput.svelte";
	import Toast from '$lib/components/ui/Toast.svelte';
  import { enhance } from '$app/forms';
	import DeleteConfirmationModal from '$lib/components/ui/DeleteConfirmationModal.svelte';

  import { Button, Modal } from 'flowbite-svelte';
  import DataTable from '$lib/components/dashboard/DataTable.svelte';

  let sending: boolean = false;
  let errorMessage: string = '';
  let identifierToDelete: string = '';
  let confirmDelete: boolean = false;
  export let data: any;
  let showModal: boolean = false;
  let newNombre: string = '';
  let newApellido: string = '';
  let newDni: string = '';
  let newNumeroTramite: string = '';

  // Variables para el sistema de búsqueda y selección de alumnos
  let searchTerm: string = '';
  let searchResults: any[] = [];
  let selectedAlumnos: any[] = []; // Array temporal para almacenar alumnos seleccionados
  let isSearching: boolean = false;
  
  // Variables para edición de alumno
  let editingAlumno: any = null;
  let editAlumnoNombre: string = '';
  let editAlumnoApellido: string = '';
  let editAlumnoDni: string = '';

  let editTutorModal: boolean = false;
  let editNombre: string = '';
  let editApellido: string = '';
  let editDni: string = '';
  let editNumeroTramite: string = '';
  let editId: string = '';
  
  let viewTutorModal: boolean = false;
  let viewNombre: string = '';
  let viewApellido: string = '';
  let viewDni: string = '';
  let viewNumeroTramite: string = '';
  let viewId: string = '';
  let viewCreatedAt: string = '';
  let dataTable: any;
  let successMessage: string = '';
    // Asegurarnos de que data.alumnos existe, si no, usar un array vacío
  $: alumnos = data?.alumno || [];
  $: meta = data?.meta || {};
    // Obtener la URL actual
  const currentUrl: string = $page.url.pathname;
  const searchParams: URLSearchParams = $page.url.searchParams;

  // Comprobar si hay parámetros adicionales en la URL
  const hasParams: boolean = searchParams.toString().length > 0;



  // Detectar si se debe abrir el modal automáticamente
  $: if ($page.url.searchParams.get('openModal') === 'true') {
    showModal = true;
    // Limpiar el parámetro de la URL
    goto($page.url.pathname, { replaceState: true });
  }

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
      goto(`/admin/tutores`);
    };
    const handleDelete = async ({ detail }: any) => {
      identifierToDelete = detail.data.id;
      confirmDelete = true;
    }; 
  const handleDeleteAlumno = () => {
    sending = true;
    return async ({ result, update }: any) => {
      if (result && result.type === 'success') {
        successMessage = result.data?.message || result?.message || '¡Alumno desasociado exitosamente!';
        errorMessage = '';
        sending = false;
        confirmDelete = false;
        identifierToDelete = '';
        setTimeout(() => successMessage = '', 3000);
      } else {
        errorMessage = result?.data?.message || result?.message || 'Error al desasociar el alumno';
        successMessage = '';
        sending = false;
        // Solo cerrar el modal si hay error crítico, no errores de validación
        if (result?.status >= 500) {
          confirmDelete = false;
          identifierToDelete = '';
        }
      }
      await update();
    };
  };

  function handleEdit(e: any) {
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
    viewId = tutor.id ?? '';
    viewNombre = tutor.nombre ?? '';
    viewApellido = tutor.apellido ?? '';
    viewDni = tutor.dni ?? '';
    viewNumeroTramite = tutor.numero_tramite ?? '';
    viewCreatedAt = tutor.created_at ? new Date(tutor.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '';
    viewTutorModal = true;
  }


  // Función para buscar alumnos
  async function searchAlumnos(): Promise<void> {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      searchResults = [];
      return;
    }

    isSearching = true;
    try {
      const response: Response = await fetch(`alumnos/api/search?term=${encodeURIComponent(searchTerm)}`);
      console.log(response)
      if (response.ok) {
        const data: any = await response.json();
        // Normaliza: si es objeto, conviértelo en array
        if (data.data) {
          searchResults = Array.isArray(data.data) ? data.data : [data.data];
        } else {
          searchResults = [];
        }
      } else {
        searchResults = [];
      }
    } catch (error: any) {
      console.error('Error buscando alumnos:', error);
      searchResults = [];
    } finally {
      isSearching = false;
    }
  }

  // Función para agregar alumno al array temporal
  function addAlumnoToSelection(alumno: any, isNew: boolean = false): void {
    console.log('🚀 Añadiendo alumno a selección:', alumno);
    
    // Si el backend ya creó el alumno automáticamente, siempre existsInLocalDB será true
    // Solo será false si hubo error en la creación automática
    const isActuallyNew = isNew || !alumno.existsInLocalDB;
    
    // Preparar datos para edición
    editingAlumno = {
      ...alumno,
      isNew: isActuallyNew,
      tempId: alumno.id || Date.now() // Usar el ID real si existe, sino temporal
    };
    editAlumnoNombre = alumno.nombre || alumno.nombres || '';
    editAlumnoApellido = alumno.apellido || alumno.apellidos || '';
    editAlumnoDni = alumno.nroDocumento || alumno.dni || '';
    
    console.log('🚀 Datos preparados para edición:', {
      existsInLocalDB: alumno.existsInLocalDB,
      isNew: isActuallyNew,
      id: alumno.id,
      personaId: alumno.personaId
    });
    
    // Limpiar búsqueda
    searchTerm = '';
    searchResults = [];
  }
  // Función para agregar alumno nuevo (que no existe en BD)
  function addNewAlumnoToSelection(): void {
    if (!searchTerm.trim()) return;

    const newAlumno: any = {
      nombre: '',
      apellido: '',
      dni: searchTerm,
      isNew: true,
      tempId: Date.now()
    };

    addAlumnoToSelection(newAlumno, true);
  }

  // Función para confirmar la adición/edición del alumno
  function confirmAlumnoSelection(): void {
    if (!editAlumnoNombre.trim()) {
      errorMessage = 'El nombre es requerido';
      return;
    }

    // Verificar si ya está en la selección (por DNI o nombre+apellido)
    const alreadySelected: any = selectedAlumnos.find((a: any) => 
      (editAlumnoDni && a.dni && a.dni === editAlumnoDni) ||
      (a.nombre === editAlumnoNombre && a.apellido === editAlumnoApellido)
    );

    if (alreadySelected) {
      errorMessage = 'Este alumno ya está en la selección';
      return;
    }

    const finalAlumno: any = {
      ...editingAlumno,
      nombre: editAlumnoNombre,
      apellido: editAlumnoApellido,
      dni: editAlumnoDni
    };

    selectedAlumnos = [...selectedAlumnos, finalAlumno];
    
    // Limpiar edición
    editingAlumno = null;
    editAlumnoNombre = '';
    editAlumnoApellido = '';
    editAlumnoDni = '';
    errorMessage = '';
  }

  // Función para cancelar la edición
  function cancelAlumnoSelection(): void {
    editingAlumno = null;
    editAlumnoNombre = '';
    editAlumnoApellido = '';
    editAlumnoDni = '';
    errorMessage = '';
  }

  // Función para editar un alumno ya seleccionado
  function editSelectedAlumno(alumno: any): void {
    // Remover de la lista de seleccionados para editarlo
    selectedAlumnos = selectedAlumnos.filter((a: any) => a.tempId !== alumno.tempId);
    
    // Preparar para edición
    editingAlumno = alumno;
    editAlumnoNombre = alumno.nombre || '';
    editAlumnoApellido = alumno.apellido || '';
    editAlumnoDni = alumno.nroDocumento || alumno.dni || '';
  }

  // Función para remover alumno del array temporal
  function removeAlumnoFromSelection(tempId: number): void {
    selectedAlumnos = selectedAlumnos.filter((a: any) => a.tempId !== tempId);
  }
  // Función para asociar alumnos al tutor
  async function associateAlumnosToTutor(): Promise<void> {
    console.log('🚀 INICIO associateAlumnosToTutor - selectedAlumnos:', selectedAlumnos);
    
    if (selectedAlumnos.length === 0) {
      errorMessage = 'No hay alumnos seleccionados para asociar';
      return;
    }

    sending = true;
    errorMessage = '';

    try {
      const tutorId: number = parseInt($page.params.tutorId);
      console.log('🚀 TutorId parseado:', tutorId);
      
      for (const alumno of selectedAlumnos) {
        console.log('🚀 Procesando alumno completo:', alumno);
        console.log('🚀 Propiedades del alumno:', {
          nombre: alumno.nombre,
          isNew: alumno.isNew,
          existsInLocalDB: alumno.existsInLocalDB,
          id: alumno.id,
          personaId: alumno.personaId,
          tempId: alumno.tempId
        });

        // Si el alumno no tiene ID, significa que necesitamos crearlo manualmente
        // (esto solo debería pasar si hubo error en la creación automática del backend)
        let alumnoId: number;
        
        if (!alumno.id && alumno.isNew) {
          console.log('🚀 Creando alumno usando action...');
          console.log('🚀 Datos para crear:', {
            nombre: alumno.nombre,
            apellido: alumno.apellido,
            dni: alumno.dni,
            personaId: alumno.personaId
          });
          
          // Crear FormData para la action
          const formData = new FormData();
          formData.append('nombre', alumno.nombre);
          formData.append('apellido', alumno.apellido || '');
          formData.append('dni', alumno.dni || '');
          if (alumno.personaId) {
            console.log('🚀 PersonaId existe, agregando:', alumno.personaId);
            formData.append('personaId', alumno.personaId.toString());
          }

          // Llamar a la action createAlumno          
          const createResponse = await fetch('?/createAlumno', {
            method: 'POST',
            body: formData
          });
            console.log('🚀 Respuesta createAlumno status:', createResponse.status);
          const createResult = await createResponse.json();
          console.log('🚀 Resultado completo createAlumno:', createResult);
          
          // Ahora la validación es más simple
          if (createResult.type !== 'success') {
            throw new Error(`Error creando alumno ${alumno.nombre}: ${createResult.data?.message || 'Error desconocido'}`);
          }
          
          // Parsear los datos serializados
          let parsedData;
          if (typeof createResult.data === 'string') {
            try {
              parsedData = JSON.parse(createResult.data);
              console.log('🚀 Datos parseados:', parsedData);
            } catch (e) {
              console.error('🚀 Error parseando datos:', e);
              throw new Error(`Error parseando respuesta del alumno ${alumno.nombre}`);
            }
          } else {
            parsedData = createResult.data;
          }
          
          // Buscar el alumnoId en los datos parseados
          let foundAlumnoId;
          if (Array.isArray(parsedData)) {
            // Si es array, buscar el número que representa el ID
            foundAlumnoId = parsedData.find(item => typeof item === 'number' && item > 0);
          } else if (parsedData && parsedData.alumnoId) {
            foundAlumnoId = parsedData.alumnoId;
          } else if (parsedData && parsedData.alumno && parsedData.alumno.id) {
            foundAlumnoId = parsedData.alumno.id;
          }
          
          console.log('🚀 AlumnoId encontrado:', foundAlumnoId);
          
          if (!foundAlumnoId) {
            throw new Error(`Error: No se pudo obtener el ID del alumno creado para ${alumno.nombre}`);
          }
          
          alumnoId = foundAlumnoId;
          console.log('🚀 Alumno creado con ID:', alumnoId, 'tipo:', typeof alumnoId);
        } else {
          alumnoId = alumno.id;
          console.log('🚀 Usando ID existente:', alumnoId, 'tipo:', typeof alumnoId);
        }

        // Validar que alumnoId sea válido antes de continuar
        console.log('🚀 Validando alumnoId antes de asociar:', {
          valor: alumnoId,
          tipo: typeof alumnoId,
          esUndefined: alumnoId === undefined,
          esNull: alumnoId === null,
          esNaN: isNaN(alumnoId)
        });

        if (!alumnoId || isNaN(alumnoId)) {
          console.error('🚀 ERROR: alumnoId inválido:', alumnoId);
          throw new Error(`ID de alumno inválido para ${alumno.nombre}: ${alumnoId}`);
        }

        // Asociar al tutor usando action
        console.log('🚀 Asociando alumno al tutor usando action...');
        console.log('🚀 Datos para asociar:', { tutorId, alumnoId });
        
        const associateFormData = new FormData();
        associateFormData.append('alumnoId', alumnoId.toString());
        console.log('🚀 FormData preparado con alumnoId:', alumnoId.toString());
          const associateResponse = await fetch('?/associateAlumno', {
          method: 'POST',
          body: associateFormData
        });
        
        console.log('🚀 Respuesta associateAlumno status:', associateResponse.status);
        const associateResult = await associateResponse.json();
        console.log('🚀 Resultado completo associateAlumno:', associateResult);
        
        if (associateResult.warning) {
          console.warn(`La asociación ya existe para alumno ${alumno.nombre}`);
          continue;
        }
        
        if (associateResult.type !== 'success') {
          throw new Error(`Error asociando alumno ${alumno.nombre}: ${associateResult.data?.message || 'Error desconocido'}`);
        }
        
        console.log('🚀 Alumno asociado exitosamente:', alumno.nombre);
      }

      // Cerrar modal y limpiar selección
      showModal = false;
      selectedAlumnos = [];
      searchTerm = '';
      searchResults = [];
      editingAlumno = null;
      successMessage = `${selectedAlumnos.length > 1 ? 'Alumnos asociados' : 'Alumno asociado'} exitosamente`;
      
      // Recargar los datos de la página
      await invalidateAll();
      
    } catch (error: any) {
      errorMessage = error.message || 'Error asociando alumnos';
      console.error('Error:', error);
    } finally {
      sending = false;
    }
  }

  // Reactivo para búsqueda automática
  $: if (searchTerm && searchTerm.length >= 2) {
    const timeoutId: number = setTimeout(searchAlumnos, 300);
  }

  const orderCols: string[] = ['nombre', 'apellido', 'dni'];
	const columns: any[] = [
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
	];


  function renderColumn(column: string, obj: any): string {
    if (column === 'nombre') {
      return obj.nombre;
    }
    if (column === 'apellido') {
      return obj.apellido;
    }
    if (column === 'dni') {
      return obj.dni;
    }
    return 'N/A';
  }

  //console.log(data)
</script>

<div class="w-full max-w-screen-4xl rounded-lg shadow mx-auto bg-white dark:bg-gray-800 px-6 py-8">
  <!-- Header responsive para licencias -->
  <div class="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
    
    <!-- Grupo 1: Flecha + Búsqueda (siempre juntos) -->
    <div class="flex items-center gap-4 flex-1 min-w-0">
      <button 
        on:click={handleBackButtonClick}  
        class="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7 7l-7-7 7-7" />
        </svg>
      </button>
      
      <div class="flex-1 max-w-30px">
        <SearchInput placeholder="Buscar..." />
      </div>
    </div>
    
    <!-- Grupo 2: Botón descarga -->
<!--     <div class="w-full lg:w-auto lg:flex-shrink-0">
      <DownloadCsv data={data?.alumnos || []} filename="alumnos.csv" />
    </div> -->

    <div class="w-full lg:w-auto lg:flex-shrink-0">
      <Button
        on:click={() => (
          showModal = true
        )}
      >Agregar Alumno</Button>
    </div>
    
  </div>
    <DataTable
      {orderCols}
      bind:this={dataTable}
      {columns}
      data={alumnos || []}
      render={renderColumn}
      defaultActions={['edit', 'delete', "view"]}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      handleView={handleView}
    />
  <Modal bind:open={editTutorModal} size="md" autoclose={false} class="w-full">
    <form method="POST" action="?/editAlumno" use:enhance={handleEditTutor} class="p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Editar - Alumno</h3>
      </div>
      <input type="hidden" name="id" value={editId} />
      <div class="flex flex-col gap-2">
        <label for="edit-nombre" class="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
        <input id="edit-nombre" name="nombre" type="text" bind:value={editNombre} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Nombre del alumno" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="edit-apellido" class="text-sm font-medium text-gray-700 dark:text-gray-200">Apellido</label>
        <input id="edit-apellido" name="apellido" type="text" bind:value={editApellido} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="Apellido del alumno" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="edit-dni" class="text-sm font-medium text-gray-700 dark:text-gray-200">DNI</label>
        <input id="edit-dni" name="dni" type="text" bind:value={editDni} required class="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-700" placeholder="DNI del alumno" />
      </div>

      <div class="flex justify-between mt-4 gap-2">
        <Button type="button" class="bg-white-500 text-black" on:click={() => editTutorModal = false}>Cerrar</Button>
        <Button type="submit" class="bg-green-500 text-white" disabled={sending}>
          {#if sending}Guardando...{:else}Aceptar{/if}
        </Button>
      </div>
      {#if errorMessage}
        <div class="text-red-600 mt-2">{errorMessage}</div>
      {/if}
    </form>
  </Modal>

  <Modal bind:open={viewTutorModal} size="md" autoclose={false} class="w-full">
    <div class="p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Ver - Alumno</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label for="view-nombre" class="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
        <div id="view-nombre" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-50 text-gray-700">{viewNombre}</div>
      </div>
      <div class="flex flex-col gap-2">
        <label for="view-apellido" class="text-sm font-medium text-gray-700 dark:text-gray-200">Apellido</label>
        <div id="view-apellido" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-50 text-gray-700">{viewApellido}</div>
      </div>
      <div class="flex flex-col gap-2">
        <label for="view-dni" class="text-sm font-medium text-gray-700 dark:text-gray-200">DNI</label>
        <div id="view-dni" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-50 text-gray-700">{viewDni}</div>
      </div>
      {#if viewCreatedAt}
        <div class="flex flex-col gap-2">
          <label for="view-created-at" class="text-sm font-medium text-gray-700 dark:text-gray-200">Fecha de Creación</label>
          <div id="view-created-at" class="w-full rounded-lg border border-gray-300 p-2 bg-gray-50 text-gray-700">{viewCreatedAt}</div>
        </div>
      {/if}
      <div class="flex justify-end mt-4">
        <Button type="button" class="w-full text-white" style="background-color: #068B3E;" on:click={() => viewTutorModal = false}>Cerrar</Button>
      </div>
    </div>
  </Modal>

  <!-- Modal para buscar y asociar alumnos -->
  <Modal bind:open={showModal} size="lg" autoclose={false} class="w-full">
    <div class="p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Buscar y Asociar Alumnos</h3>
      </div>

      <!-- Campo de búsqueda -->
      <div class="flex flex-col gap-2">
        <label for="search-alumno" class="text-sm font-medium text-gray-700 dark:text-gray-200">
          Buscar alumno por DNI
        </label>
        <div class="relative">
          <input 
            id="search-alumno" 
            type="text" 
            bind:value={searchTerm}
            disabled={editingAlumno !== null}
            placeholder="Escribe el DNI del alumno..."
            class="w-full rounded-lg border border-gray-300 p-3 bg-gray-100 text-gray-700 pr-10 {editingAlumno ? 'opacity-50 cursor-not-allowed' : ''}"
          />
          {#if isSearching}
            <div class="absolute right-3 top-3">
              <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          {/if}
        </div>
      </div>

      <!-- Sección de edición de alumno -->
      {#if editingAlumno}
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
            {editingAlumno.isNew ? 'Crear nuevo alumno' : 'Editar datos del alumno'}
          </h4>
          
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label for="edit-nombre" class="text-sm font-medium text-gray-600">Nombre *</label>
              <input 
                id="edit-nombre"
                type="text" 
                bind:value={editAlumnoNombre}
                required
                class="w-full rounded-lg border border-gray-300 p-2 bg-white text-gray-700"
                placeholder="Nombre del alumno"
              />
            </div>
            
            <div class="flex flex-col gap-1">
              <label for="edit-apellido" class="text-sm font-medium text-gray-600">Apellido</label>
              <input 
                id="edit-apellido"
                type="text" 
                bind:value={editAlumnoApellido}
                class="w-full rounded-lg border border-gray-300 p-2 bg-white text-gray-700"
                placeholder="Apellido del alumno"
              />
            </div>
            
            <div class="flex flex-col gap-1">
              <label for="edit-dni" class="text-sm font-medium text-gray-600">DNI</label>
              <input 
                id="edit-dni"
                type="text" 
                bind:value={editAlumnoDni}
                class="w-full rounded-lg border border-gray-300 p-2 bg-white text-gray-700"
                placeholder="DNI del alumno"
              />
            </div>
          </div>
          
          <div class="flex gap-2 mt-3">
            <Button 
              type="button" 
              class="bg-green-500 text-white flex-1" 
              on:click={confirmAlumnoSelection}
            >
              {editingAlumno.isNew ? 'Agregar' : 'Confirmar'}
            </Button>
            <Button 
              type="button" 
              class="bg-gray-500 text-white flex-1" 
              on:click={cancelAlumnoSelection}
            >
              Cancelar
            </Button>
          </div>
        </div>
      {/if}

      <!-- Resultados de búsqueda -->
      {#if searchResults.length > 0 && !editingAlumno}
        <div class="flex flex-col gap-2">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-200">Resultados encontrados:</h4>
          <div class="max-h-32 overflow-y-auto border rounded-lg">
            {#each searchResults as alumno}
              <button
                type="button"
                on:click={() => addAlumnoToSelection(alumno, false)}
                class="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center justify-between"
              >
                <div>
                  <div class="font-medium text-gray-900">{alumno.nombre} {alumno.apellido}</div>
                  <div class="text-sm text-gray-500">DNI: {alumno.nroDocumento || alumno.dni}</div>
                </div>
                <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            {/each}
          </div>
        </div>
      {/if}      <!-- Opción para crear nuevo alumno -->
      {#if searchTerm && searchResults.length === 0 && !isSearching && !editingAlumno}
        <div class="flex flex-col gap-2">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-200">No se encontraron resultados</h4>
          <button
            type="button"
            on:click={addNewAlumnoToSelection}
            class="w-full text-left p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 flex items-center justify-between"
          >
            <div>
              <div class="font-medium text-gray-500">Crear nuevo alumno con DNI: "{searchTerm}"</div>
              <div class="text-sm text-gray-400">Este alumno será creado como nuevo</div>
            </div>
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
        </div>
      {/if}

      <!-- Lista de alumnos seleccionados -->
      {#if selectedAlumnos.length > 0}
        <div class="flex flex-col gap-2">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-200">
            Alumnos seleccionados ({selectedAlumnos.length}):
          </h4>
          <div class="max-h-40 overflow-y-auto border rounded-lg">
            {#each selectedAlumnos as alumno}
              <div class="p-3 border-b last:border-b-0 flex items-center justify-between {alumno.isNew ? 'bg-gray-50' : 'bg-white'}">
                <div class="{alumno.isNew ? 'text-gray-500' : 'text-gray-900'}">
                  <div class="font-medium">
                    {alumno.nombre} {alumno.apellido || '(sin apellido)'}
                    {#if alumno.isNew}
                      <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded ml-2">NUEVO</span>
                    {/if}
                  </div>
                  {#if alumno.dni}
                    <div class="text-sm {alumno.isNew ? 'text-gray-400' : 'text-gray-500'}">
                      DNI: {alumno.dni}
                    </div>
                  {/if}
                </div>
                <div class="flex gap-2">
                  <button
                    type="button"
                    on:click={() => editSelectedAlumno(alumno)}
                    class="text-blue-500 hover:text-blue-700"
                    title="Editar alumno"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    on:click={() => removeAlumnoFromSelection(alumno.tempId)}
                    class="text-red-500 hover:text-red-700"
                    title="Remover alumno"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Botones de acción -->
      <div class="flex justify-between mt-4 gap-2">
        <Button 
          type="button" 
          class="bg-white-500 text-black" 
          on:click={() => {
            showModal = false;
            selectedAlumnos = [];
            searchTerm = '';
            searchResults = [];
            editingAlumno = null;
            editAlumnoNombre = '';
            editAlumnoApellido = '';
            editAlumnoDni = '';
            errorMessage = '';
          }}
        >
          Cerrar
        </Button>
        <Button 
          type="button" 
          class="bg-green-500 text-white" 
          disabled={sending || selectedAlumnos.length === 0 || editingAlumno !== null}
          on:click={associateAlumnosToTutor}
        >
          {#if sending}
            Procesando...
          {:else}
            Asociar Alumnos ({selectedAlumnos.length})
          {/if}
        </Button>
      </div>

      {#if errorMessage}
        <div class="text-red-600 mt-2">{errorMessage}</div>
      {/if}
    </div>
  </Modal>
</div>


<DeleteConfirmationModal
  actionUrl="?/deleteAlumno"
  bind:open={confirmDelete}
  identifier={identifierToDelete}
  dataNameToDelete="el alumno"
  enhanceHandler={handleDeleteAlumno}
/>

{#if successMessage.length > 0}
		<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}