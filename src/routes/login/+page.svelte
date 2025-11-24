<script lang="ts">
	import { enhance } from '$app/forms';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { Label, Input, Card, Helper, Spinner, Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	let sending = false;
	let successMessage = '';
	let errorMessage = '';

	// Función para volver atrás
	function volverAtras() {
		goto('/');
	}

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			if (result.type === 'redirect') {
				successMessage = 'Inicio de sesión exitoso';
				sending = false;
				errorMessage = '';
			} else {
				sending = false;
				errorMessage = result?.data?.error;
				console.log('error', errorMessage);
			}
			await update({});
		};
	};
</script>

<svelte:head>
	<title>Iniciar Sesión - SPS Salud</title>
	<meta name="description" content="Acceso administrativo a SPS Salud" />
</svelte:head>

<!-- Fondo principal con imagen responsiva -->
<div class="min-h-screen relative overflow-hidden">

	<!-- Contenido principal -->
	<div class="relative z-10 min-h-screen flex items-center justify-center p-4">
		<!-- Botón Atrás -->
		<button 
			class="shadow-md shadow-gray-900 absolute top-4 left-4 z-20 bg-transparent border border-white text-gray-800 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-white/10 transition-colors"
			on:click={volverAtras}
		>
			<svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
			</svg>
			<span>Volver al inicio</span>
		</button>

		<div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
			<!-- Logo del Club -->
			<div class="flex justify-center items-center mb-8">
				<img 
					src="/images/Logo.png" 
					alt="Logo Club Deportivo Colón" 
					class="w-24 h-24 sm:w-32 sm:h-32 object-contain"
				/>
			</div>
			
			<!-- Título -->
			<div class="text-center mb-6">
				<h1 class="text-2xl sm:text-3xl font-bold text-[#349392] mb-2">
					SPS Salud
				</h1>
				<p class="text-gray-600 text-sm">
					Panel de Administración
				</p>
			</div>
			<!-- Formulario de login -->
			<form use:enhance={handleSubmit} method="post" action="?/login" class="space-y-6">
				<div>
					<Label for="email" class="mb-2 text-gray-800 font-semibold">Email</Label>
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="Ingresa tu email"
						required
						class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none"
					/>
				</div>
				
				<div>
					<Label for="password" class="mb-2 text-gray-800 font-semibold">Contraseña</Label>
					<Input
						type="password"
						name="password"
						id="password"
						placeholder="Ingresa tu contraseña"
						required
						class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none"
					/>
				</div>

				<!-- Mensaje de error -->
				{#if errorMessage?.length > 0}
					<div class="bg-red-50 border border-red-200 rounded-lg p-3">
						<p class="text-red-600 text-sm text-center">{errorMessage}</p>
					</div>
				{/if}

				<!-- Botón de login -->
				<button
					type="submit"
					disabled={sending}
					class="w-full bg-[#349392] hover:bg-[#349392] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
				>
					{#if sending}
						<Spinner class="w-5 h-5" />
						<span>Iniciando sesión...</span>
					{:else}
						<span>Iniciar Sesión</span>
					{/if}
				</button>
			</form>
			
			<!-- Footer -->
			<div class="mt-8 text-center">
				<p class="text-xs text-gray-500">
					© SPS Salud - Corrientes
				</p>
			</div>
		</div>
	</div>
</div>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}
