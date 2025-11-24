<script>
	import Header from '$lib/components/public/Header.svelte';
	import Menu from '$lib/components/public/Menu.svelte';
	import Footer from '$lib/components/public/Footer.svelte';
	import ContactSection from '$lib/components/public/ContactSection.svelte';
	import WhatsAppFloat from '$lib/components/public/WhatsAppFloat.svelte';
	import AsistenteFloat from '$lib/components/public/AsistenteFloat.svelte';
</script>

<svelte:head>
	<title>SPS Salud - Empresa</title>
	<meta name="description" content="SPS Salud - Empresa" />
	<link rel="StyleSheet" href="/css/estilos.css" type="text/css" />
	<link href="/css/menu_slide.css" type="text/css" rel="stylesheet" />
	<link href="/css/popup.css" rel="stylesheet" type="text/css" />
</svelte:head>

<div id="page">
	<Header />
	<Menu />

	<div class="background_banner">
		<img src="/images/portadas_empresa.jpg" width="100%" alt="Empresa" class="shadow-[0_8px_16px_rgba(0,0,0,0.3),0_8px_8px_rgba(0,0,0,0.2)]" />
	</div>

	<div class="block bg-[url('/images/gris_esf.jpg')] bg-repeat-x bg-top">
		<div class="max-w-[1200px] mx-auto pt-[15px] text-center block font-['titular2']">
			<div class="text-[#4c4c4c] p-[30px] text-left w-auto text-base overflow-auto">
				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">Historia SPS Salud</div>
				<div class="font-bold">SPS Salud - CORSAL SA</div>
				es una empresa dedicada a la administración de fondos destinados a la salud. Un grupo
				empresario de la provincia de Corrientes, tuvo la visión de desarrollar un Sistema que
				permitiera administrar los fondos destinados a la salud en forma eficiente sin dejar de lado
				la atención personalizada de los afiliados y de los prestadores.
				<div class="mt-[15px]"></div>

				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">Objetivos de SPS Salud</div>
				Brindar atención personalizada a todos los afiliados, ya sean del sistema prepago o de aporte
				sindical.
			</div>
		</div>
	</div>

	<ContactSection />
	<Footer />
	<WhatsAppFloat />
	<AsistenteFloat />
</div>

