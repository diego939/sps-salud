<script>
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import 'nprogress/nprogress.css';
	import '../app.css';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	NProgress.configure({
		// Full list:
		minimum: 0.16
	});

	$: {
		if (browser && $navigating) {
			NProgress.start();
		} else NProgress.done();
	}

	// Determinar si estamos en una página que necesita el layout de administración
	$: isAdminPage = $page.url.pathname.startsWith('/admin') || $page.url.pathname.startsWith('/login');
</script>

{#if isAdminPage}
	<!-- Layout para páginas de administración -->
	<div class="app">
		<main>
			<slot />
		</main>
	</div>
{:else}
	<!-- Layout para páginas públicas (homepage y asociación) -->
	<div class="min-h-screen">
		<slot />
	</div>
{/if}

