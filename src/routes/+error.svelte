<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	
	// Función para volver atrás
	function volverAtras() {
		window.history.back();
	}
	
	// Función para ir al inicio
	function irAlInicio() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Página no encontrada - Club Deportivo Colón</title>
	<meta name="description" content="La página que buscas no existe" />
</svelte:head>

<!-- Modal de pantalla completa -->
<div class="fixed inset-0 z-50 overflow-hidden">

	<!-- Contenido del modal -->
	<div class="relative z-10 h-screen flex items-center justify-center">
		<!-- Contenido principal -->
		<div class="bg-white shadow-2xl w-full max-w-md mx-4 rounded-2xl p-8 text-center">
			
			<!-- Icono de error -->
			<div class="flex justify-center mb-6">
				<div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
					<svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
					</svg>
				</div>
			</div>

			<!-- Mensaje de error -->
			<div class="mb-8">
				<h2 class="text-xl font-semibold text-gray-800 mb-2">
					Página no encontrada
				</h2>
				<p class="text-gray-600 mb-4">
					La página que buscas no existe
				</p>
				<p class="text-sm text-gray-500">
					Es posible que la página haya sido movida, eliminada o que hayas escrito mal la dirección.
				</p>
			</div>

			<!-- Botones de acción -->
			<div class="space-y-3">
				<!-- Botón volver atrás -->
				<button 
					class="w-full bg-[#349392] hover:bg-[#349392] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
					on:click={volverAtras}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
					</svg>
					<span>Volver atrás</span>
				</button>

				<!-- Botón ir al inicio -->
				<button 
					class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
					on:click={irAlInicio}
				>
					Ir al inicio
				</button>
			</div>

			<!-- Información adicional -->
			<div class="mt-8 pt-6 border-t border-gray-200">
				<p class="text-xs text-gray-500">
					Si crees que esto es un error, contacta con el administrador del sitio.
				</p>
			</div>
		</div>
	</div>
</div>
