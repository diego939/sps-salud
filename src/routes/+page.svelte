<script>
	import Header from '$lib/components/public/Header.svelte';
	import Menu from '$lib/components/public/Menu.svelte';
	import Footer from '$lib/components/public/Footer.svelte';
	import ContactSection from '$lib/components/public/ContactSection.svelte';
	import WhatsAppFloat from '$lib/components/public/WhatsAppFloat.svelte';
	import AsistenteFloat from '$lib/components/public/AsistenteFloat.svelte';
</script>

<svelte:head>
	<title>SPS Salud</title>
	<meta name="description" content="SPS Salud - Inicio" />
	<link rel="StyleSheet" href="/css/estilos.css" type="text/css" />
	<link href="/css/menu_slide.css" type="text/css" rel="stylesheet" />
	<link href="/css/popup.css" rel="stylesheet" type="text/css" />
</svelte:head>

<div id="page">
	<Header />
	<Menu />

	<div class="background_banner">
		<img src="/images/Cabecera_SPS.jpeg" width="100%" alt="Banner SPS Salud" class="shadow-[0_8px_16px_rgba(0,0,0,0.3),0_8px_8px_rgba(0,0,0,0.2)]" />
	</div>

	<div class="block bg-[url('/images/gris_esf.jpg')] bg-repeat-x bg-top">
		<div class="max-w-[1200px] mx-auto pt-[15px] px-4 md:px-0 text-center block font-['titular2']">
			<div class="flex flex-wrap md:flex-nowrap justify-center gap-6 my-10 items-stretch px-2 md:px-0">
				<!-- Card 1: Planes -->
				<div class="w-full md:w-[320px] flex flex-col my-10 md:my-0 mx-2 md:mx-0">
					<div class="block bg-transparent w-full border-0 flex-shrink-0">
						<a href="/planes"><img src="/images/home_planes.png" alt="Planes" class="w-full h-auto relative border border-[#ccc]" /></a>
					</div>
					<div class="text-[#6FB39D] font-['titular2'] text-2xl text-left block my-[15px] font-bold leading-[27px]">PLANES SPS SALUD</div>
					<div class="font-['titular2'] text-lg block text-left text-[#706F6F] leading-[17px] py-[10px] pb-[35px] flex-1"
						>Desde su fundación SPS Salud se ha esmerado en ofrecer atención altamente especializada
						con el soporte de la mejor tecnología en el campo de la medicina.</div
					>
					<div class="font-['titular2'] text-sm block text-right text-[#6FB39D] h-4 leading-3 right-0 w-full bg-[#bbbcc0] flex-shrink-0">
						<a href="/planes" class="no-underline text-[#6FB39D] font-bold bg-white pl-5 w-full transition-all duration-200 ease-in-out hover:pl-20">Ver más info</a>
					</div>
				</div>

				<!-- Card 2: Cómo Afiliarse -->
				<div class="w-full md:w-[320px] flex flex-col my-10 md:my-0 mx-2 md:mx-0">
					<div class="block bg-transparent w-full border-0 flex-shrink-0">
						<a href="/afiliarse"><img src="/images/home_comoafiliarse.png" alt="Cómo afiliarse" class="w-full h-auto relative border border-[#ccc]" /></a>
					</div>
					<div class="text-[#6FB39D] font-['titular2'] text-2xl text-left block my-[15px] font-bold leading-[27px]">CÓMO AFILIARSE</div>
					<div class="font-['titular2'] text-lg block text-left text-[#706F6F] leading-[17px] py-[10px] pb-[35px] mt-[15px] flex-1"
						>En esta área podrá obtener la mejor información para afiliarse y disfrutar de SPS
						Salud</div
					>
					<div class="font-['titular2'] text-sm block text-right text-[#6FB39D] h-4 leading-3 right-0 w-full bg-[#bbbcc0] flex-shrink-0">
						<a href="/afiliarse" class="no-underline text-[#6FB39D] font-bold bg-white pl-5 w-full transition-all duration-200 ease-in-out hover:pl-20">Ver más info</a>
					</div>
				</div>

				<!-- Card 3: Institución Adherida -->
				<div class="w-full md:w-[320px] flex flex-col my-10 md:my-0 mx-2 md:mx-0">
					<div class="block bg-white w-full border-0 flex-shrink-0">
						<a href="/cmisc"
							><img src="/images/home_santaclara.png" alt="Institución Adherida" class="w-full h-auto relative border border-[#ccc]"
						/></a>
					</div>
					<div class="text-[#6FB39D] font-['titular2'] text-2xl text-left block my-[15px] font-bold leading-[27px]">INSTITUCIÓN ADHERIDA</div>
					<div class="font-['titular2'] text-lg block text-left text-[#706F6F] leading-[17px] py-[10px] pb-[35px] mt-[15px] flex-1"
						>Centro de Medicina Integral exclusiva para afiliados de SPS Salud</div
					>
					<div class="font-['titular2'] text-sm block text-right text-[#6FB39D] h-4 leading-3 right-0 w-full bg-[#bbbcc0] flex-shrink-0">
						<a href="/cmisc" class="no-underline text-[#6FB39D] font-bold bg-white pl-5 w-full transition-all duration-200 ease-in-out hover:pl-20">Ver más info</a>
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
