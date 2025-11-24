<script lang="ts">
	import 'tailwindcss/tailwind.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { derived } from 'svelte/store';

	import TopBar from './TopBar.svelte';
	import Overlay from './Overlay.svelte';
	import Sidebar from './sidebar/Sidebar.svelte';
	import { closeSidebar, sidebarOpen } from './store';

	$: user = $page.data.user;

	const style = {
		container: `bg-gray-100 h-screen overflow-hidden relative`,
		main: `h-screen overflow-auto pb-36 pt-4 px-2 md:pb-8 lg:px-4`,
		mainContainer: `flex flex-col h-screen pl-0 w-full lg:pl-24`
	};


		// Diccionario de rutas a títulos
	const routeTitles: Record<string, string> = {
		'/admin': 'Inicio',
		'/admin/proyectos': 'Proyectos',
		'/admin/clientes': 'Clientes',
		'/admin/documentos': 'Documentos',
		'/admin/lotes': 'Lotes',
		'/admin/expensas': 'Expensas',
		'/admin/configuracion': 'Configuración',
		// Agrega aquí más rutas y títulos según sea necesario
	};

	// Deriva el título según la ruta actual
	const title = derived(page, $page => {
		const path = $page.url.pathname;
		if (path.includes('/noticias')) return 'Noticias';
		if (path.includes('/tutores')) return 'Tutores';
		if (path.includes('/tutores/[tutorId]/alumnos')) return 'Alumnos';

		// Agrega más lógica para rutas dinámicas si es necesario
		return routeTitles[path] || '';
	});


	if (browser) {
		page.subscribe(() => {
			// close Sidebar on route changes when sidebar is open
			if ($sidebarOpen) {
				closeSidebar();
			}
		});
	}
</script>

<div class={style.container}>
	<div class="flex items-start">
		<Overlay />
		<Sidebar mobileOrientation="end" />
		<div class={style.mainContainer}>
			<TopBar 
			{user}
			title={$title}
 
			/>
			<main
				class={style.main}
				style="background-image: 
    );"
			>
				<slot />
			</main>
		</div>
	</div>
</div>
