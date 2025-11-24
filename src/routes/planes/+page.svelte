<script>
	import Header from '$lib/components/public/Header.svelte';
	import Menu from '$lib/components/public/Menu.svelte';
	import Footer from '$lib/components/public/Footer.svelte';
	import ContactSection from '$lib/components/public/ContactSection.svelte';
	import WhatsAppFloat from '$lib/components/public/WhatsAppFloat.svelte';
	import AsistenteFloat from '$lib/components/public/AsistenteFloat.svelte';
</script>

<svelte:head>
	<title>SPS Salud - Planes</title>
	<meta name="description" content="SPS Salud - Planes" />
	<link rel="StyleSheet" href="/css/estilos.css" type="text/css" />
	<link href="/css/menu_slide.css" type="text/css" rel="stylesheet" />
	<link href="/css/popup.css" rel="stylesheet" type="text/css" />
</svelte:head>

<div id="page">
	<Header />
	<Menu />

	<div class="background_banner">
		<img src="/images/portadas_planes.jpg" width="100%" alt="Planes" class="shadow-[0_8px_16px_rgba(0,0,0,0.3),0_8px_8px_rgba(0,0,0,0.2)]" />
	</div>

	<div class="block bg-[url('/images/gris_esf.jpg')] bg-repeat-x bg-top">
		<div class="max-w-[1200px] mx-auto pt-[15px] px-4 md:px-0 text-center block font-['titular2']">
			<div class="flex flex-wrap md:flex-nowrap justify-center gap-6 my-10 px-4 md:px-0">
				<!-- Plan Oro -->
				<div class="w-full md:w-[320px] flex-shrink-0 my-10 md:my-0 mx-2 md:mx-0 align-top">
					<div class="block bg-transparent w-full border-0">
						<a href="/planes"><img src="/images/plan_oro.png" alt="Plan Oro" class="align-middle text-center w-full max-w-full relative border border-[#ccc]" /></a>
					</div>
					<div class="text-[#C7941E] font-['titular2'] text-lg text-left block my-[15px] font-bold leading-[27px]">PLAN ORO</div>
					<div class="font-['titular2'] text-sm block text-left text-[#706F6F] leading-[17px] py-[10px] pb-[35px]">
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>Atención Ambulatoria</div
						>
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>Servicios de diagnóstico</div
						>
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>Estudios de alta complejidad</div
						>
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>Internación cobertura 100%</div
						>
						<div class="block my-[5px] pl-[35px]">(Habitación Individual)</div>
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>Terapia intensiva</div
						>
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>Odontología</div
						>
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>Kinesiología</div
						>
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>Prótesis</div
						>
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>50% de descuento en farmacias</div
						>
						<div class="block my-[5px]"
							><span class="text-[#C7941E] text-[30px] align-middle">•</span
							>Acceso prioritario a la APP de SPS Salud</div
						>
					</div>
					<div class="font-['titular2'] text-sm block text-right text-[#6FB39D] h-4 leading-3 right-0 w-full bg-[#bbbcc0]">
						<a
							href="https://spssalud.com.ar/planes_files/plan_oro.pdf"
							target="_blank"
							download="plan_oro.pdf"
							class="no-underline text-[#C7941E] font-bold bg-white pl-5 w-full transition-all duration-200 ease-in-out hover:pl-20"
							><span class="text-[#C7941E]">MÁS INFO</span></a
						>
					</div>
				</div>

				<!-- Plan Plata Especial -->
				<div class="w-full md:w-[320px] flex-shrink-0 my-10 md:my-0 mx-2 md:mx-0 align-top">
					<div class="block bg-transparent w-full border-0">
						<a href="/planes"><img src="/images/plan_plataespecial.png" alt="Plan Plata Especial" class="align-middle text-center w-full max-w-full relative border border-[#ccc]" /></a>
					</div>
					<div class="text-[#999999] font-['titular2'] text-lg text-left block my-[15px] font-bold leading-[27px]">PLAN PLATA ESPECIAL</div>
					<div class="font-['titular2'] text-sm block text-left text-[#706F6F] leading-[17px] py-[10px] pb-[35px]">
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>Atención Ambulatoria</div
						>
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>Servicios de diagnóstico</div
						>
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>Estudios de alta complejidad</div
						>
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>Internación cobertura 100%</div
						>
						<div class="block my-[5px] pl-[35px]">(Habitación compartida)</div>
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>Terapia intensiva</div
						>
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>Odontología</div
						>
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>Kinesiología</div
						>
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>Prótesis</div
						>
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>40% de descuento en farmacias</div
						>
						<div class="block my-[5px]"
							><span class="text-[#999999] text-[30px] align-middle">•</span
							>Acceso prioritario a la APP de SPS Salud</div
						>
					</div>
					<div class="font-['titular2'] text-sm block text-right text-[#6FB39D] h-4 leading-3 right-0 w-full bg-[#bbbcc0]">
						<a
							href="https://spssalud.com.ar/planes_files/plan_plata.pdf"
							target="_blank"
							download="plan_plata.pdf"
							class="no-underline text-[#999999] font-bold bg-white pl-5 w-full transition-all duration-200 ease-in-out hover:pl-20"
							><span class="text-[#999999]">MÁS INFO</span></a
						>
					</div>
				</div>

				<!-- Plan Joven -->
				<div class="w-full md:w-[320px] flex-shrink-0 my-10 md:my-0 mx-2 md:mx-0 align-top">
					<div class="block bg-transparent w-full border-0">
						<a href="/planes"><img src="/images/plan_joven.png" alt="Plan Joven" class="align-middle text-center w-full max-w-full relative border border-[#ccc]" /></a>
					</div>
					<div class="text-[#349392] font-['titular2'] text-lg text-left block my-[15px] font-bold leading-[27px]">PLAN JOVEN</div>
					<div class="font-['titular2'] text-sm block text-left text-[#706F6F] leading-[17px] py-[10px] pb-[35px]">
						<div class="block my-[5px]"
							><span class="text-[#349392] text-[30px] align-middle">•</span
							>Si sos menor de 30 y no tenés hijos, ¡éste es tu plan!</div
						>
					</div>
					<div class="font-['titular2'] text-sm block text-right text-[#6FB39D] h-4 leading-3 right-0 w-full bg-[#bbbcc0]">
						<a
							href="https://spssalud.com.ar/planes_files/plan_oro.pdf"
							target="_blank"
							download="plan_oro.pdf"
							class="no-underline text-[#349392] font-bold bg-white pl-5 w-full transition-all duration-200 ease-in-out hover:pl-20"
							><span class="text-[#349392]">MÁS INFO</span></a
						>
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

