<script>
	import Header from '$lib/components/public/Header.svelte';
	import Menu from '$lib/components/public/Menu.svelte';
	import Footer from '$lib/components/public/Footer.svelte';
	import ContactSection from '$lib/components/public/ContactSection.svelte';
	import WhatsAppFloat from '$lib/components/public/WhatsAppFloat.svelte';
	import AsistenteFloat from '$lib/components/public/AsistenteFloat.svelte';
</script>

<svelte:head>
	<title>SPS Salud - Afiliarse</title>
	<meta name="description" content="SPS Salud - Afiliarse" />
	<link rel="StyleSheet" href="/css/estilos.css" type="text/css" />
	<link href="/css/menu_slide.css" type="text/css" rel="stylesheet" />
	<link href="/css/popup.css" rel="stylesheet" type="text/css" />
</svelte:head>

<div id="page">
	<Header />
	<Menu />

	<div class="background_banner">
		<img src="/images/portadas_afiliarse.jpg" width="100%" alt="Cómo Afiliarse" class="shadow-[0_8px_16px_rgba(0,0,0,0.3),0_8px_8px_rgba(0,0,0,0.2)]" />
	</div>

	<div class="block bg-[url('/images/gris_esf.jpg')] bg-repeat-x bg-top">
		<div class="max-w-[1200px] mx-auto pt-[15px] text-center block font-['titular2']">
			<div class="text-[#4c4c4c] p-[30px] text-left w-auto text-base overflow-auto">
				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">¿Cómo Afiliarse?</div>
				<div class="font-bold mt-[15px]">REQUISITOS PARA LA AFILIACIÓN</div>

				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">Dependientes</div>
				<div class="font-bold">Titular soltero</div>
				<div class="block my-[5px]">Fotocopia de DNI (1 y 2 hoja).</div>
				<div class="block my-[5px]">Fotocopia del Último Recibo de Sueldo.</div>
				<div class="mt-[15px]"></div>

				<div class="font-bold">Titular Con Grupo Familiar</div>
				<div class="block my-[5px]">Fotocopias de DNI (1 y 2 hoja de todo el grupo familiar).</div>
				<div class="block my-[5px]">Copia del Certificado de Matrimonio.</div>
				<div class="block my-[5px]"
					>Certificado de Convivencia, <span class="font-bold"
						>Información Sumaria del Registro Civil.</span
					></div
				>
				<div class="block my-[5px]">Copias del Certificado o Partida de Nacimiento (solo hijos).</div>
				<div class="block my-[5px]">Constancias de CUIL.</div>

				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">Monotributistas</div>
				<div class="font-bold">Titular soltero</div>
				<div class="block my-[5px]">Fotocopia de DNI (1 y 2 hoja).</div>
				<div class="block my-[5px]">Copia del Formulario 184 del Monotributo.</div>
				<div class="block my-[5px]">Copia del Formulario 152 del Monotributo (Credencial de Pago).</div>
				<div class="block my-[5px]">Copia de los 2 últimos Cupones de Pago de AFIP.</div>
				<div class="mt-[15px]"></div>

				<div class="font-bold">Titular Con Grupo Familiar</div>
				<div class="block my-[5px]">Fotocopias de DNI (1 y 2 hoja de todo el grupo familiar).</div>
				<div class="block my-[5px]"
					>Copia del Certificado de Matrimonio y/o <span class="font-bold"
						>Información Sumaria del Registro Civil.</span
					></div
				>
				<div class="block my-[5px]">Copias del Certificado o Partida de Nacimiento (solo hijos).</div>
				<div class="block my-[5px]">Constancias de CUIL.</div>

				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px]">Prepagos</div>
				<div class="font-bold">Titular soltero</div>
				<div class="block my-[5px]">Fotocopia de DNI (1 y 2 hoja).</div>
				<div class="block my-[5px]"
					>Historia Clínica (se realiza con una orden de consulta que la OS. Le provee al momento de
					presentar los papeles).</div
				>
				<div class="block my-[5px]"><em>Sujeto a Auditoría Médica.</em></div>
				<div class="mt-[15px]"></div>

				<div class="font-bold">Titular Con Grupo Familiar</div>
				<div class="block my-[5px]">Fotocopias de DNI (1 y 2 hoja de todo el grupo familiar).</div>
				<div class="block my-[5px]">Certificado de Matrimonio.</div>
				<div class="block my-[5px]"
					>Certificado de Convivencia, <span class="font-bold"
						>Información Sumaria del Registro Civil</span
					>
					(si tienen hijos en común que certifique los hijos).</div
				>
				<div class="block my-[5px]">Partida de Nacimiento (solo hijos).</div>
			</div>
		</div>
	</div>

	<ContactSection />
	<Footer />
	<WhatsAppFloat />
	<AsistenteFloat />
</div>

