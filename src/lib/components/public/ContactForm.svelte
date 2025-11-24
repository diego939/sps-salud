<script lang="ts">
	export let action: string = 'https://spssalud.com.ar/enviarmail.php';
	export let mensajePlaceholder: string = 'Escribe aquí tu consulta (60 caracteres max)...';
	export let mensajeDefault: string = '';
	export let formId: string = 'contFrm';
	
	let formData = {
		nombrecon: 'Nombre',
		email: '* email',
		telefono: '* Teléfono',
		mensaje: mensajeDefault
	};
	
	function handleFocus(field: string) {
		if (field === 'nombre' && formData.nombrecon === 'Nombre') {
			formData.nombrecon = '';
		} else if (field === 'email' && formData.email === '* email') {
			formData.email = '';
		} else if (field === 'telefono' && formData.telefono === '* Teléfono') {
			formData.telefono = '';
		} else if (field === 'mensaje' && formData.mensaje === mensajeDefault && mensajeDefault !== '') {
			formData.mensaje = '';
		}
	}
	
	function handleBlur(field: string) {
		if (field === 'nombre' && formData.nombrecon === '') {
			formData.nombrecon = 'Nombre';
		} else if (field === 'email' && formData.email === '') {
			formData.email = '* email';
		} else if (field === 'telefono' && formData.telefono === '') {
			formData.telefono = '* Teléfono';
		} else if (field === 'mensaje' && formData.mensaje === '' && mensajeDefault !== '') {
			formData.mensaje = mensajeDefault;
		}
	}
</script>

<div class="text-white">
	<div class="text-lg mb-10 text-white font-bold">CONTACTO DIRECTO</div>
	<form method="POST" name="contFrm" id={formId} action={action} class="block max-w-[500px]">
		<input
			name="nombrecon"
			type="text"
			class="w-[100%] text-sm font-['Trebuchet_MS',Arial,Helvetica,sans-serif] text-[#333] h-[40px] bg-[#D7EAD9] border border-[#387154] text-left py-[5px] px-[15px] my-[10px] block italic focus:bg-[#d4ffe8] focus:border-white focus:outline-none focus:text-[#387154] focus:shadow-[1px_1px_2px_#000] focus:not-italic"
			id="nombrecon"
			bind:value={formData.nombrecon}
			on:focus={() => handleFocus('nombre')}
			on:blur={() => handleBlur('nombre')}
			required
		/>
		<input
			name="email"
			type="email"
			class="w-[100%] text-sm font-['Trebuchet_MS',Arial,Helvetica,sans-serif] text-[#333] h-[40px] bg-[#D7EAD9] border border-[#387154] text-left py-[5px] px-[15px] my-[10px] block italic focus:bg-[#d4ffe8] focus:border-white focus:outline-none focus:text-[#387154] focus:shadow-[1px_1px_2px_#000] focus:not-italic"
			id="email"
			bind:value={formData.email}
			on:focus={() => handleFocus('email')}
			on:blur={() => handleBlur('email')}
			required
		/>
		<input
			name="telefono"
			type="tel"
			class="w-[100%] text-sm font-['Trebuchet_MS',Arial,Helvetica,sans-serif] text-[#333] h-[40px] bg-[#D7EAD9] border border-[#387154] text-left py-[5px] px-[15px] my-[10px] block italic focus:bg-[#d4ffe8] focus:border-white focus:outline-none focus:text-[#387154] focus:shadow-[1px_1px_2px_#000] focus:not-italic"
			id="telefono"
			bind:value={formData.telefono}
			on:focus={() => handleFocus('telefono')}
			on:blur={() => handleBlur('telefono')}
			required
		/>
		<textarea
			name="mensaje"
			cols="56"
			rows="6"
			id="mensaje"
			class="w-[100%] border border-[#387154] text-sm font-['Trebuchet_MS',Arial,Helvetica,sans-serif] italic text-[#387154] bg-[#D7EAD9] text-left py-[5px] px-[15px] my-[10px] block h-auto min-h-[100px] focus:bg-[#d4ffe8] focus:border-white focus:outline-none focus:shadow-[1px_1px_2px_#000] focus:not-italic"
			placeholder={mensajePlaceholder}
			bind:value={formData.mensaje}
			on:focus={() => handleFocus('mensaje')}
			on:blur={() => handleBlur('mensaje')}
			maxlength="60"
			required
		></textarea>
		<input 
			name="send" 
			type="submit" 
			class="w-[200px] h-[45px] my-[10px] text-center text-[21px] text-white not-italic font-['titular2','Trebuchet_MS',Arial,Helvetica,sans-serif] bg-[#706F6F] cursor-pointer border-none block hover:bg-[#5a5a5a]" 
			id="send" 
			value="ENVIAR" 
		/>
	</form>
</div>

