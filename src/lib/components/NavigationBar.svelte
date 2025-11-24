<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	
	// Variable para controlar el menú móvil
	let menuAbierto = false;
	
	// Función para navegar
	function navigateTo(path: string) {
		goto(path);
		// Cerrar menú móvil después de navegar
		menuAbierto = false;
	}
	
	// Función para volver atrás
	function volverAtras() {
		window.history.back();
	}
	
	// Función para toggle del menú móvil
	function toggleMenu() {
		menuAbierto = !menuAbierto;
	}
	
	// Determinar si estamos en la página actual
	function isActivePage(currentPath: string): boolean {
		return $page.url.pathname === currentPath;
	}
</script>

<!-- Barra de navegación superior con imagen de fondo -->
<div class="relative w-full h-20 sm:h-24">
	<!-- Imagen de fondo para la barra de navegación -->
	<div class="absolute inset-0">
		<!-- Imagen de fondo para pantallas grandes -->
		<img 
			src="/images/Imagen de fondo.png" 
			alt="Balón de baloncesto" 
			class="w-full h-full object-cover hidden sm:block"
		/>
		<!-- Imagen de fondo para móviles -->
		<img 
			src="/images/fondo-mobile.png" 
			alt="Fondo móvil" 
			class="w-full h-full object-cover sm:hidden"
		/>
	</div>

	<!-- Contenido de la barra de navegación -->
	<div class="relative z-10 h-full flex items-center justify-between px-4 sm:px-6">
		<!-- Espacio izquierdo (para balancear) - Solo en desktop -->
		<div class="hidden md:block w-20 sm:w-24"></div>

		<!-- Enlaces de navegación centrados - Solo visible en desktop -->
		<div class="hidden md:flex items-center space-x-4 sm:space-x-6">
			<!-- Enlace Inicio -->
			<button 
				class="text-white hover:text-gray-200 transition-colors text-sm sm:text-base font-medium px-3 py-1 rounded-full {isActivePage('/') ? 'bg-white/20 border border-white' : ''}"
				on:click={() => navigateTo('/')}
			>
				Inicio
			</button>
			
			<!-- Enlace Contactos -->
			<button 
				class="text-white hover:text-gray-200 transition-colors text-sm sm:text-base font-medium px-3 py-1 rounded-full {isActivePage('/contactos') ? 'bg-white/20 border border-white' : ''}"
			>
				Contactos
			</button>
			
			<!-- Enlace Socios -->
			<button 
				class="text-white hover:text-gray-200 transition-colors text-sm sm:text-base font-medium px-3 py-1 rounded-full {isActivePage('/socios') ? 'bg-white/20 border border-white' : ''}"
				on:click={() => navigateTo('/socios')}
			>
				Socios
			</button>
			
			<!-- Enlace Cuotas -->
			<button 
				class="text-white hover:text-gray-200 transition-colors text-sm sm:text-base font-medium px-3 py-1 rounded-full {isActivePage('/cuotas') ? 'bg-white/20 border border-white' : ''}"
			>
				Cuotas
			</button>
		</div>

		<!-- Logo (siempre visible) -->
		<div class="flex items-center">
			<img 
				src="/images/Logo.png" 
				alt="Logo Club Deportivo Colón" 
				class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain"
			/>
		</div>

		<!-- Botón hamburguesa - Solo visible en móvil -->
		<button 
			type="button" 
			class="md:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
			on:click={toggleMenu}
			aria-controls="navbar-mobile"
			aria-expanded={menuAbierto}
		>
			<span class="sr-only">Abrir menú principal</span>
			<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
			</svg>
		</button>
	</div>

	<!-- Menú móvil colapsable -->
	<div class="md:hidden {menuAbierto ? 'block' : 'hidden'}" id="navbar-mobile">
		<div class="px-2 pt-2 pb-3 space-y-1 bg-[#71005D]/95 backdrop-blur-sm">
			<!-- Enlace Inicio -->
			<button 
				class="block w-full text-left py-2 px-3 text-white hover:bg-white/10 rounded-lg transition-colors {isActivePage('/') ? 'bg-white/20' : ''}"
				on:click={() => navigateTo('/')}
			>
				Inicio
			</button>
			
			<!-- Enlace Contactos -->
			<button 
				class="block w-full text-left py-2 px-3 text-white hover:bg-white/10 rounded-lg transition-colors {isActivePage('/contactos') ? 'bg-white/20' : ''}"
			>
				Contactos
			</button>
			
			<!-- Enlace Socios -->
			<button 
				class="block w-full text-left py-2 px-3 text-white hover:bg-white/10 rounded-lg transition-colors {isActivePage('/socios') ? 'bg-white/20' : ''}"
				on:click={() => navigateTo('/socios')}
			>
				Socios
			</button>
			
			<!-- Enlace Cuotas -->
			<button 
				class="block w-full text-left py-2 px-3 text-white hover:bg-white/10 rounded-lg transition-colors {isActivePage('/cuotas') ? 'bg-white/20' : ''}"
			>
				Cuotas
			</button>
		</div>
	</div>
</div>
