<script lang="ts">
	import { enhance } from '$app/forms';
	import { Dropdown, DropdownItem, Avatar } from 'flowbite-svelte';
	import { openSidebar } from './store';
	import { onMount } from 'svelte';
	import type { User } from '$lib/interfaces/user.interface';
	import { redirect } from '@sveltejs/kit';
	import { page } from '$app/stores';

	export let user: User | undefined;
	export let title: string = '';

	let form: HTMLFormElement;

	let screenWidth: number;

	onMount(() => {
		screenWidth = window.innerWidth;
		window.addEventListener('resize', () => (screenWidth = window.innerWidth));
	});


		// Función reactiva para obtener el título dinámico
	$: pageTitle = (() => {
		const pathname = $page.url.pathname;
		const searchParams = $page.url.searchParams;
		
		// Lógica específica para la página de alumnos de un tutor
		if (pathname.includes('/alumnos') && pathname.includes('/tutores/')) {
			const tutorData = $page.data?.tutor;
			if (tutorData) {
				return `VER ALUMNOS - ${tutorData.nombre} ${tutorData.apellido}/${tutorData.dni}`;
			}
			return 'VER ALUMNOS';
		}
		
		// Lógica específica para la página de tutores
		if (pathname === '/admin/tutores/[tutorId]/alumnos') {
			let title = 'Alumnos';

			// Solo mostrar departamento si hay query parameter departamento
			const departamentoId = searchParams.get('departamento');
			if (departamentoId) {
				// Obtener departamento desde los datos de la página
				const escuelas = $page.data?.escuelas;
				if (escuelas && escuelas.length > 0) {
					const departamento = escuelas[0]?.departamento;
					if (departamento) {
						// Capitalizar departamento
						const departamentoCapitalizado = departamento
							.split(' ')
							.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
							.join(' ');
						title = `Escuelas de ${departamentoCapitalizado}`;
					}
				}
			}
			
			return title;
		}
		
		
		return '';
	})();

	// Función reactiva para mostrar fecha y hora solo en detalle de alertas
	$: showDateTime = $page.url.pathname.startsWith('/dashboard/alertas/') && $page.url.pathname !== '/dashboard/alertas';
	$: alertaData = $page.data?.alerta;

    function logout() {
        // Enviar directamente un POST para eliminar la cookie en el servidor
        fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        }).finally(() => {
            // Recargar completamente la página, ignorando la caché
            window.location.replace('/?t=' + Date.now());
        });
    }
</script>

<header class="bg-white h-16 items-center relative shadow w-full z-10 md:h-20">
	<div class="flex flex-center flex-col h-full justify-center mx-auto px-3 relative">
		<div class="flex items-center pl-1 relative w-full sm:ml-0 sm:pr-2 lg:max-w-68">
			<div class="flex left-0 relative w-3/4">
				<div class="flex group h-full items-center relative w-12">
					<button
						type="button"
						aria-expanded="false"
						aria-label="Toggle sidenav"
						on:click={openSidebar}
						class="text-4xl  ${screenWidth < 1024 ? 'text-white' : 'text-black'} text-black focus:outline-none flex items-center gap-2"
					>
						&#8801;
					</button>
				</div>

				<!-- Título de la sección -->
				{#if pageTitle || title}
					<span
						class="ml-4 flex items-center gap-2 uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[70vw] md:max-w-none"
						class:text-white={screenWidth < 1024}
						class:text-[#393D48]={screenWidth >= 1024}
					>
						<span class:text-sm={screenWidth < 1024} class:text-2xl={screenWidth >= 1024}>
							{pageTitle || title}
						</span>
					</span>
				{/if}
			</div>
			<!-- iconos right -->
			<div class="flex items-center justify-end gap-3 p-1 relative w-full sm:mr-0 sm:right-auto">
				<div>
					<Avatar class="acs cursor-pointer" src="/images/logo.svg" />
					<Dropdown triggeredBy=".acs">
						<div slot="header" class="px-4 py-2">
							<p class="block truncate text-sm text-center font-medium">
								{user?.roles[0]?.descripcion
									? user?.roles[0]?.descripcion.charAt(0).toUpperCase() +
										user?.roles[0]?.descripcion.slice(1)
									: ''}
							</p>
							<p class="block truncate text-sm text-center font-medium">{user?.apellido}, {user?.nombre}</p>
							<hr class="my-1">
							<p class="block truncate text-sm text-center font-medium">
								{user?.agente?.area?.descripcion}
							</p>
						</div>
						<DropdownItem><a href="/dashboard/perfil">Perfil</a></DropdownItem>
						<DropdownItem slot="footer" on:click={logout}>Salir</DropdownItem>
					</Dropdown>
					<form
						method="POST"
						bind:this={form}
						class="hidden"
						action="/dashboard/logout"
						use:enhance
					></form>
				</div>
			</div>
		</div>
	</div>
</header>
