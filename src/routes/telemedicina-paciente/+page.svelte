<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { tick } from 'svelte';

	// Datos del médico
	let doctorData = {
		name: 'Dr. Roberto Fernandez',
		specialty: 'Medicina General'
	};

	// Datos de la consulta
	let consultationData = {
		number: '555275',
		doctor: 'Dr. Roberto Fernandez',
		status: 'Conectado',
		date: new Date().toLocaleDateString('es-AR', { 
			weekday: 'long', 
			day: 'numeric', 
			month: 'long', 
			year: 'numeric' 
		}),
		time: new Date().toLocaleTimeString('es-AR', { 
			hour: '2-digit', 
			minute: '2-digit',
			hour12: true 
		})
	};

	// Estados de los controles de video
	let videoEnabled = true;
	let audioEnabled = true;
	let showEndCallModal = false;

	// Referencias a elementos de video
	let userVideoElement: HTMLVideoElement; // Vista previa del paciente (cuadro pequeño)
	let doctorVideoElement: HTMLVideoElement; // Video del doctor (cuadro grande - principal)

	// Streams de media
	let userStream: MediaStream | null = null;
	let doctorStream: MediaStream | null = null;
	let isLoadingCamera = false;

	// Función para iniciar la cámara del usuario (vista previa)
	async function startUserCamera() {
		if (isLoadingCamera) return;
		
		try {
			isLoadingCamera = true;
			// Solicitar acceso a cámara y micrófono
			userStream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
					facingMode: 'user' // Cámara frontal
				},
				audio: audioEnabled
			});

			// Esperar a que el DOM se actualice
			await tick();

			// Asignar el stream al elemento de video (vista previa)
			if (userVideoElement) {
				userVideoElement.srcObject = userStream;
				// Forzar reproducción del video
				try {
					await userVideoElement.play();
					console.log('Vista previa iniciada correctamente');
				} catch (err) {
					console.error('Error al reproducir video:', err);
					// Intentar reproducir sin muted si falla
					userVideoElement.muted = false;
					await userVideoElement.play();
				}
			}
			videoEnabled = true;
		} catch (error) {
			console.error('Error al acceder a la cámara:', error);
			alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
			videoEnabled = false;
			userStream = null;
		} finally {
			isLoadingCamera = false;
		}
	}

	// Función para detener la cámara del usuario
	function stopUserCamera() {
		if (userStream) {
			userStream.getTracks().forEach(track => {
				track.stop();
			});
			userStream = null;
		}
		if (userVideoElement) {
			userVideoElement.srcObject = null;
		}
	}

	// Función para actualizar el audio sin reiniciar el video
	function updateAudioTrack() {
		if (userStream) {
			userStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
				track.enabled = audioEnabled;
			});
		}
	}

	// Intentar obtener datos de query params si vienen desde ChatModal
	onMount(async () => {
		const params = $page.url.searchParams;
		if (params.get('doctor')) {
			doctorData.name = decodeURIComponent(params.get('doctor') || doctorData.name);
			consultationData.doctor = doctorData.name;
		}
		if (params.get('consultationNumber')) {
			consultationData.number = params.get('consultationNumber') || consultationData.number;
		}

		// Iniciar la cámara automáticamente al cargar la página
		if (videoEnabled) {
			await startUserCamera();
		}
	});

	// Limpiar streams al desmontar el componente
	onDestroy(() => {
		stopUserCamera();
		// Limpiar stream del doctor si existe en el futuro
		// Nota: doctorStream se implementará cuando se agregue WebRTC para el doctor
	});

	async function toggleVideo() {
		if (isLoadingCamera) return; // Evitar múltiples clics mientras se carga
		
		if (videoEnabled && userStream) {
			// Desactivar video
			stopUserCamera();
			videoEnabled = false;
		} else {
			// Activar video
			videoEnabled = true; // Establecer el estado primero para que el botón se actualice
			await startUserCamera();
		}
	}

	function toggleAudio() {
		audioEnabled = !audioEnabled;
		// Si ya hay un stream activo, actualizar el audio
		if (userStream) {
			updateAudioTrack();
		} else if (audioEnabled && videoEnabled) {
			// Si el video está activo pero no hay stream, reiniciar con audio
			startUserCamera();
		}
	}

	function openEndCallModal() {
		showEndCallModal = true;
	}

	function closeEndCallModal() {
		showEndCallModal = false;
	}

	function confirmEndCall() {
		stopUserCamera();
		closeEndCallModal();
		window.history.back();
	}
</script>

<svelte:head>
	<title>Telemedicina - Paciente - SPS Salud</title>
	<meta name="description" content="Consulta de telemedicina - Vista del paciente - SPS Salud" />
</svelte:head>

<div class="min-h-screen bg-gray-100">
	<!-- Header con Banner SPS -->
	<div class="w-full h-24 sm:h-28 md:h-32 bg-white border-b border-gray-200">
		<img 
			src="/images/banner sps.png" 
			alt="SPS Salud - Sistema de Prevención Social en Salud" 
			class="w-full h-full object-cover object-right sm:object-center"
		/>
	</div>

	<!-- Información de la consulta -->
	<div class="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
		<div class="max-w-7xl mx-auto">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
				<!-- Fecha y hora - Arriba en móvil, Derecha en desktop -->
				<p class="text-xs sm:text-sm text-gray-600 font-semibold order-1 sm:order-2">
					{consultationData.date} - {consultationData.time}
				</p>
				<!-- Consulta y doctor con estado - Abajo en móvil, Izquierda en desktop -->
				<div class="flex flex-col gap-1 order-2 sm:order-1">
					<h2 class="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
						Consulta #{consultationData.number} | {consultationData.doctor}
					</h2>
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 bg-green-500 rounded-full"></div>
						<span class="text-xs sm:text-sm text-gray-600">{consultationData.status}</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Contenedor principal de video -->
	<div class="w-full flex justify-center bg-gray-100">
		<div class="w-full lg:max-w-7xl lg:mx-auto h-[calc(100vh-10.75rem)] sm:h-[calc(100vh-11.75rem)] md:h-[calc(100vh-12.75rem)] lg:h-[calc(100vh-12rem)] bg-gray-900 relative overflow-hidden">

		<!-- Video del médico - grande en el centro (principal) -->
		<div class="w-full h-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
			{#if doctorStream}
				<!-- Video del médico -->
				<video
					bind:this={doctorVideoElement}
					autoplay
					playsinline
					class="w-full h-full object-cover"
				></video>
			{:else}
				<!-- Placeholder del médico -->
				<div class="w-full h-full flex items-center justify-center bg-gray-800">
					<div class="text-white text-center px-4">
						<svg class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						<p class="text-base sm:text-lg md:text-xl mb-1 sm:mb-2">{consultationData.doctor}</p>
						<p class="text-xs sm:text-sm text-gray-400">Esperando conexión...</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Vista previa del paciente - pequeño en esquina superior derecha -->
		<div class="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10 w-24 h-20 sm:w-32 sm:h-24 md:w-48 md:h-36 lg:w-64 lg:h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
			{#if userStream && videoEnabled}
				<!-- Vista previa del paciente -->
				<video
					bind:this={userVideoElement}
					autoplay
					playsinline
					muted={true}
					class="w-full h-full object-cover"
				></video>
			{:else if isLoadingCamera}
				<!-- Estado de carga -->
				<div class="w-full h-full flex items-center justify-center bg-gray-700">
					<div class="text-white text-center">
						<div class="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1 sm:mb-2"></div>
						<p class="text-[10px] sm:text-xs">Cargando...</p>
					</div>
				</div>
			{:else}
				<!-- Placeholder cuando el video está desactivado -->
				<div class="w-full h-full flex items-center justify-center bg-gray-700">
					<div class="text-white text-center px-1">
						<svg class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
						</svg>
						<p class="text-[10px] sm:text-xs">Video desactivado</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Controles de video -->
		<div class="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20">
			<div class="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3">
				<!-- Toggle Video -->
				<button
					on:click={toggleVideo}
					disabled={isLoadingCamera}
					class="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full {videoEnabled && userStream ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'} {isLoadingCamera ? 'opacity-50 cursor-not-allowed' : ''} text-white flex items-center justify-center transition-colors"
					aria-label={videoEnabled && userStream ? 'Desactivar video' : 'Activar video'}
				>
					{#if isLoadingCamera}
						<div class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
					{:else if videoEnabled && userStream}
						<svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>
					{:else}
						<svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
						</svg>
					{/if}
				</button>

				<!-- Toggle Audio -->
				<button
					on:click={toggleAudio}
					class="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full {audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'} text-white flex items-center justify-center transition-colors"
					aria-label={audioEnabled ? 'Silenciar audio' : 'Activar audio'}
				>
					{#if audioEnabled}
						<svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
						</svg>
					{:else}
						<svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
						</svg>
					{/if}
				</button>

				<!-- Finalizar llamada -->
				<button
					on:click={openEndCallModal}
					class="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
					aria-label="Finalizar llamada"
				>
					<svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rotate-[135deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
					</svg>
				</button>

				<!-- Más opciones -->
				<button
					class="hidden md:flex w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white items-center justify-center transition-colors"
					aria-label="Más opciones"
				>
					<svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
					</svg>
				</button>

				<!-- Adjuntar archivo -->
				<button
					class="hidden md:flex w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white items-center justify-center transition-colors"
					aria-label="Adjuntar archivo"
				>
					<svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
					</svg>
				</button>
			</div>
		</div>
	</div>
	</div>

	<!-- Modal de confirmación para finalizar llamada -->
	{#if showEndCallModal}
		<!-- Overlay -->
		<div
			class="fixed inset-0 bg-black bg-opacity-50 z-[3000] flex items-center justify-center p-4"
			role="button"
			tabindex="0"
			aria-label="Cerrar modal"
			on:click={closeEndCallModal}
			on:keydown={(e) => e.key === 'Escape' && closeEndCallModal()}
			on:keypress={(e) => e.key === 'Enter' && closeEndCallModal()}
		>
			<!-- Modal -->
			<div
				class="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
				role="dialog"
				aria-modal="true"
				aria-labelledby="end-call-modal-title"
				on:click|stopPropagation
				on:keydown|stopPropagation
			>
				<!-- Header -->
				<div class="flex items-center justify-between mb-4">
					<h3 id="end-call-modal-title" class="text-xl font-semibold text-gray-900">
						Finalizar llamada
					</h3>
					<button
						on:click={closeEndCallModal}
						class="text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Cerrar modal"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Contenido -->
				<div class="mb-6">
					<p class="text-gray-600">
						¿Estás seguro de que deseas finalizar la llamada? Esta acción no se puede deshacer.
					</p>
				</div>

				<!-- Botones -->
				<div class="flex gap-3 justify-end">
					<button
						on:click={closeEndCallModal}
						class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
					>
						Cancelar
					</button>
					<button
						on:click={confirmEndCall}
						class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
					>
						Finalizar llamada
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

