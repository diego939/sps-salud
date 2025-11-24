<script>
	import Header from '$lib/components/public/Header.svelte';
	import Menu from '$lib/components/public/Menu.svelte';
	import Footer from '$lib/components/public/Footer.svelte';
	import ContactSection from '$lib/components/public/ContactSection.svelte';
	import WhatsAppFloat from '$lib/components/public/WhatsAppFloat.svelte';	
	import AsistenteFloat from '$lib/components/public/AsistenteFloat.svelte';

	const oficinas = [
		{
			ciudad: 'Corrientes, Capital',
			direccion: 'San Juan 656',
			telefono: '0379-4423800',
			celular: '0379-4267143',
			email: 'consultas@spssalud.com.ar'
		},
		{
			ciudad: 'Goya, Corrientes',
			direccion: 'Colon 112',
			encargado: 'JAQUELINE FERNANDEZ',
			celular: '03777-414589',
			codigoPostal: '3450',
			email: 'goya@spssalud.com.ar'
		},
		{
			ciudad: 'Concepción, Corrientes',
			direccion: '8 de Diciembre 769',
			encargada: 'CYNTHIA GHERARDI',
			codigoPostal: '3423',
			email: 'concepcion@spssalud.com.ar'
		},
		{
			ciudad: 'Curuzú Cuatiá, Corrientes',
			direccion: 'Caa Guazu 815',
			encargada: 'LUCRECIA IBARRA',
			telefono: '03774-423654',
			celular: '03774-15635084',
			codigoPostal: '3460',
			email: 'curuzu@spssalud.com.ar'
		},
		{
			ciudad: 'Esquina, Corrientes',
			direccion: 'AV. MITRE 727',
			encargada: 'SILVANA CALABRES',
			telefono: '03777-460020',
			celular: '03777-501607',
			codigoPostal: '3196',
			email: 'esquina@spssalud.com.ar'
		},
		{
			ciudad: 'Bella vista, Corrientes',
			direccion: 'Buenos Aires 499',
			encargada: 'SILVANA REGNET',
			celular: '03777-414590',
			codigoPostal: '3482',
			email: 'bellavista@spssalud.com.ar'
		},
		{
			ciudad: 'Empedrado, Corrientes',
			direccion: 'Piragine Niveyro 2027',
			encargado: 'RAMIRO RAZONGLES',
			celular: '379-4995656',
			codigoPostal: '3418',
			email: 'empedrado@spssalud.com.ar'
		},
		{
			ciudad: 'Ituzaingo, Corrientes',
			direccion: 'Parana 1811',
			encargada: 'VERA YENHY',
			telefono: '03786-421918',
			codigoPostal: '3302',
			email: 'ituzaingo@spssalud'
		},
		{
			ciudad: 'Mercedes, Corrientes',
			direccion: 'San Martín 1266',
			encargada: 'NILDA GOMEZ',
			celular: '03773-15403847',
			codigoPostal: '3471',
			email: 'mercedes@spssalud.com.ar'
		},
		{
			ciudad: 'Monte Caseros, Corrientes',
			direccion: 'El Maestro 269',
			encargada: 'NATALIA GALDEANO',
			telefono: '03775-423355',
			celular: '03775-15495298',
			codigoPostal: '3220',
			email: 'montecaceros@spssalud.com.ar'
		},
		{
			ciudad: 'La Cruz, Corrientes',
			direccion: 'Buenos Aires 837',
			encargado: 'CLAUDIO VIAUT',
			telefono: '03772-491511',
			celular: '03772-15631297',
			codigoPostal: '3454',
			email: 'lacruz@spssalud.com.ar'
		},
		{
			ciudad: 'Oberá, Misiones',
			direccion: '9 de Julio 935',
			encargada: 'LAURA CORREA',
			telefono: '03755-428149',
			celular: '03755-415949',
			codigoPostal: '3360',
			email: 'obera@spssalud.com.ar'
		},
		{
			ciudad: 'Paso de los Libres, Corrientes',
			direccion: 'Los Ciento Ocho 1199',
			encargada: 'KARINA MIÑO',
			telefono: '03772-427644',
			celular: '03772-15631298',
			codigoPostal: '3230',
			email: 'pasodeloslibres@spssalud.com.ar'
		},
		{
			ciudad: 'Saladas, Corrientes',
			direccion: 'G. INTIHUASI-L.3 Y 4/ ALVEAR Y MITRE 911',
			encargada: 'MARIANGELES DELFINO',
			telefono: '03794-421793',
			celular: '03782-513878',
			codigoPostal: '3420',
			email: 'saladas@spssalud.com.ar'
		},
		{
			ciudad: 'Santa Rosa, Corrientes',
			direccion: 'Av. 25 de Mayo 57',
			encargada: 'PEREZ MIRIAM KARINA',
			celular: '03782-15610505',
			codigoPostal: '3466',
			email: 'santarosa@spssalud.com.ar'
		},
		{
			ciudad: 'Santo Tomé, Corrientes',
			direccion: 'San Martín 685 Local "C"',
			encargada: 'AMUEDO VIRGINIA',
			telefono: '03756-421153',
			celular: '03756-498519',
			codigoPostal: '3340',
			email: 'santotome@spssalud.com.ar'
		},
		{
			ciudad: 'Virasoro, Corrientes',
			direccion: 'Amado Bompland 1046',
			encargada: 'NANCY DA SILVA',
			telefono: '03756-481999',
			celular: '03756-415949',
			codigoPostal: '3342',
			email: 'virasoro@spssalud.com.ar'
		},
		{
			ciudad: 'Alem, Misiones',
			direccion: 'Belgrano 415',
			encargada: 'VANESA CINDY SCHÜCK',
			telefono: '03754-421777',
			codigoPostal: '3315',
			email: 'alem@spssalud.com.ar'
		},
		{
			ciudad: 'Eldorado, Misiones',
			direccion: 'Malvinas 1946',
			encargada: 'BENITEZ LORENA',
			telefono: '03751-426947',
			codigoPostal: '3380',
			email: 'eldorado@spssalud.com.ar'
		},
		{
			ciudad: 'San Vicente, Misiones',
			direccion: 'Calle Joaquín Piña S/N',
			encargada: 'ANDREA MACHADO',
			telefono: '03755-461137',
			celular: '03755-437482',
			codigoPostal: '3380',
			email: 'sanvicente@spssalud.com.ar'
		},
		{
			ciudad: 'O.S. GUINCHEROS',
			direccion: 'Cnel. Salvadores 1638',
			encargada: 'MARTA STARTE',
			telefono: '011-43010048'
		}
	];
</script>

<svelte:head>
	<title>SPS Salud - Oficinas</title>
	<meta name="description" content="SPS Salud - Oficinas" />
	<link rel="StyleSheet" href="/css/estilos.css" type="text/css" />
	<link href="/css/menu_slide.css" type="text/css" rel="stylesheet" />
	<link href="/css/popup.css" rel="stylesheet" type="text/css" />
</svelte:head>

<div id="page">
	<Header />
	<Menu />

	<div class="background_banner">
		<img src="/images/portadas_oficinas.jpg" width="100%" alt="Oficinas" class="shadow-[0_8px_16px_rgba(0,0,0,0.3),0_8px_8px_rgba(0,0,0,0.2)]" />
	</div>

	<div class="block bg-[url('/images/gris_esf.jpg')] bg-repeat-x bg-top">
		<div class="max-w-[1200px] mx-auto pt-[15px] text-center block font-['titular2']">
			<div class="text-[#4c4c4c] p-[30px] text-left w-auto text-base">
				<div class="font-['titular2'] text-[23px] block text-left text-[#006b70] font-bold leading-[28px] py-5 px-0 my-[10px] mb-8">NUESTRAS OFICINAS</div>

				<div class="flex flex-wrap justify-center gap-6">
					{#each oficinas as oficina}
						<div class="bg-white border border-[#006b70] rounded-sm shadow-md overflow-hidden w-[270px] flex flex-col">
							<div class="bg-[#006b70] text-white w-full p-3 text-lg font-semibold">{oficina.ciudad}</div>
							<div class="flex-1 bg-white">
								<div class="font-semibold border-b border-gray-300 p-3 text-sm text-gray-800"><strong>Dirección:</strong> <span class="font-normal italic text-gray-400">{oficina.direccion}</span></div>
								{#if oficina.encargado}
									<div class="font-semibold border-b border-gray-300 p-3 text-sm text-gray-800"><strong>Encargado:</strong> <span class="font-normal italic text-gray-400">{oficina.encargado}</span></div>
								{/if}
								{#if oficina.encargada}
									<div class="font-semibold border-b border-gray-300 p-3 text-sm text-gray-800"><strong>Encargada:</strong> <span class="font-normal italic text-gray-400">{oficina.encargada}</span></div>
								{/if}
								{#if oficina.telefono}
									<div class="font-semibold border-b border-gray-300 p-3 text-sm text-gray-800"><strong>Teléfono:</strong> <span class="font-normal italic text-gray-400">{oficina.telefono}</span></div>
								{/if}
								{#if oficina.celular}
									<div class="font-semibold border-b border-gray-300 p-3 text-sm text-gray-800"><strong>Celular:</strong> <span class="font-normal italic text-gray-400">{oficina.celular}</span></div>
								{/if}
								{#if oficina.codigoPostal}
									<div class="font-semibold border-b border-gray-300 p-3 text-sm text-gray-800"><strong>Código Postal:</strong> <span class="font-normal italic text-gray-400">{oficina.codigoPostal}</span></div>
								{/if}
								{#if oficina.email}
									<div class="font-semibold border-b border-gray-300 p-3 text-sm text-gray-800 last:border-b-0"
										><strong>E-mail:</strong> <a href="mailto:{oficina.email}" target="_blank" class="font-normal italic text-gray-400 hover:text-[#006b70] transition-colors no-underline"
											>{oficina.email}</a
										></div
									>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<ContactSection />
	<Footer />
	<WhatsAppFloat />
	<AsistenteFloat />
</div>

