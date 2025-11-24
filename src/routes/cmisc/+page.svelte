<script lang="ts">
	import Header from '$lib/components/public/Header.svelte';
	import Menu from '$lib/components/public/Menu.svelte';
	import Footer from '$lib/components/public/Footer.svelte';
	import WhatsAppFloat from '$lib/components/public/WhatsAppFloat.svelte';
	import ContactForm from '$lib/components/public/ContactForm.svelte';
	import ContactInfo from '$lib/components/public/ContactInfo.svelte';
	import AsistenteFloat from '$lib/components/public/AsistenteFloat.svelte';
	import ContactSection from '$lib/components/public/ContactSection.svelte';
</script>

<svelte:head>
	<title>SPS Salud - CMISC</title>
	<meta name="description" content="SPS Salud - CMISC" />
	<link rel="StyleSheet" href="/css/estilos.css" type="text/css" />
	<link href="/css/menu_slide.css" type="text/css" rel="stylesheet" />
	<link href="/css/popup.css" rel="stylesheet" type="text/css" />
</svelte:head>

<div id="page">
	<Header />
	<Menu />

	<div class="background_banner">
		<img src="/images/sc.jpg" width="100%" alt="Centro de Medicina Integral Santa Clara" class="shadow-[0_8px_16px_rgba(0,0,0,0.3),0_8px_8px_rgba(0,0,0,0.2)]" />
	</div>

	<div class="block bg-[url('/images/gris_esf.jpg')] bg-repeat-x bg-top">
		<div class="max-w-[1200px] mx-auto pt-[15px] text-center block font-['titular2']">
			<div class="text-[#4c4c4c] p-[30px] text-left w-auto text-base overflow-auto">
				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">CENTRO DE MEDICINA INTEGRAL</div>
				<p class="mb-4">Consulta médica para afiliados de SPS Salud.</p>
				<p class="mb-8">Oficinas de Atención al público exclusivo para afiliados de SPS Salud.</p>

				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">ESPECIALIDADES:</div>
				<div class="flex flex-wrap gap-2 mb-4">
					<span class="font-bold inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">Guardia Médica</span>
					<span class="font-bold inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">Ginecología</span>
					<span class="font-bold inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">Pediatría</span>
					<span class="font-bold inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">Clínica Médica</span>
					<span class="font-bold inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">Traumatología</span>
					<span class="font-bold inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">Laboratorio</span>
					<span class="font-bold inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">Enfermería</span>
				</div>
				<div class="bg-cyan-100 rounded-lg p-4 mt-[5px] mb-6 space-y-1 w-fit">
					<p class="text-cyan-900">Curaciones - Control de Temperatura - Saturometría</p>
					<p class="text-cyan-900">Colocación de Inyectables - Nebulizaciones</p>
					<p class="text-cyan-900">Control de Presión Arterial - Control de Glucemia</p>
				</div>
				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">HORARIO DE ATENCIÓN:</div>
				<p class="mb-8">LUNES A VIERNES de 8 a 20 hs.</p>
				<!--<strong>SÁBADOS Guardia Médica de 8 a 20 hs. </strong> <br /> -->

				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">CONTACTO:</div>
				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full bg-[#006b70] flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
							</svg>
						</div>
						<span class="text-gray-800">379 4105088</span>
					</div>
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full bg-[#006b70] flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
							</svg>
						</div>
						<span class="text-gray-800">379 070135</span>
					</div>
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full bg-[#006b70] flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
							</svg>
						</div>
						<span class="text-gray-800">info@cmisantaclara.com.ar</span>
					</div>
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full bg-[#006b70] flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
						</div>
						<span class="text-gray-800">San Martín 1472, Corrientes Capital.</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<ContactSection />
	<Footer />
	<WhatsAppFloat />
	<AsistenteFloat />
</div>


