<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';

	export let isOpen: boolean = false;
	export let onClose: () => void;

	type ChatState = 
		| 'initial'
		| 'asking_affiliate_number'
		| 'confirming_identity'
		| 'asking_symptoms'
		| 'asking_fever_duration'
		| 'asking_other_symptoms'
		| 'completed'
		| 'not_affiliated';

	let messages: Array<{ text: string; sender: 'user' | 'assistant'; time: string }> = [];
	let inputMessage: string = '';
	let isTyping: boolean = false;
	let hasInitialMessage: boolean = false;
	let chatState: ChatState = 'initial';
	let userData: { affiliateNumber?: string; name?: string; location?: string; symptoms?: string[]; feverDuration?: string } = {};
	let messagesContainer: HTMLDivElement;
	let inputElement: HTMLInputElement;

	// Datos mock para el flujo de afiliado
	const mockAffiliateData: Record<string, { name: string; location: string }> = {
		'12458963': { name: 'Rocío Vara', location: 'Corrientes Capital' },
		'12345678': { name: 'Diego Almirón', location: 'Corrientes Capital' }
	};

	// Función para hacer scroll al final del chat
	async function scrollToBottom() {
		await tick();
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	// Función para enfocar el input
	async function focusInput() {
		await tick();
		if (inputElement) {
			inputElement.focus();
		}
	}

	// Agregar mensaje inicial cuando se abre el chat
	$: if (isOpen && !hasInitialMessage) {
		const initialMessage = {
			text: '¡Hola! Te comunicaste con el asistente virtual de SPS Salud. Estoy acá para ayudarte. Para empezar, ¿me decís tu número de afiliado?',
			sender: 'assistant' as const,
			time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
		};
		messages = [initialMessage];
		hasInitialMessage = true;
		chatState = 'asking_affiliate_number';
		scrollToBottom();
	}

	// Scroll automático cuando cambian los mensajes o el estado de typing
	$: if (messages.length > 0 || isTyping) {
		scrollToBottom();
	}

	// Scroll y focus cuando se abre el modal
	$: if (isOpen) {
		scrollToBottom();
		focusInput();
	}

	function addMessage(text: string, sender: 'user' | 'assistant') {
		const message = {
			text,
			sender,
			time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
		};
		messages = [...messages, message];
	}

	function processUserMessage(userText: string) {
		const normalizedText = userText.trim().toLowerCase();

		switch (chatState) {
			case 'asking_affiliate_number':
				// Verificar si dice que no está afiliado
				if (normalizedText.includes('no') && (normalizedText.includes('afiliado') || normalizedText.includes('afiliada'))) {
					chatState = 'not_affiliated';
					setTimeout(() => {
						addMessage(
							`¡No hay problema! Para gestionar tu afiliación, podés comunicarte al WhatsApp de Atención al Cliente:<br><br>
							<a href="https://wa.me/543794639497" target="_blank" rel="noopener noreferrer" class="float-left flex items-center gap-2 px-1 py-1 border-[1.5px] border-white rounded-lg bg-transparent text-white font-medium text-sm no-underline hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5 my-1">
							<svg class="w-5 h-5 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<path fill="currentColor" fill-rule="evenodd" d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z" clip-rule="evenodd"/>
								<path fill="currentColor" d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z"/>
							</svg>
							<span class="whitespace-nowrap">+54 379 463-9497</span></a>
							<br><br>Ellos te van a asesorar sobre planes, requisitos y pasos para afiliarte.`,
							'assistant'
						);
						isTyping = false;
						chatState = 'completed';
					}, 1500);
				} else {
					// Asumir que es un número de afiliado
					userData.affiliateNumber = userText.trim();
					const affiliateInfo = mockAffiliateData[userData.affiliateNumber];
					
					if (affiliateInfo) {
						userData.name = affiliateInfo.name;
						userData.location = affiliateInfo.location;
						chatState = 'confirming_identity';
						setTimeout(() => {
							addMessage(
								`¿Sos ${affiliateInfo.name}, de ${affiliateInfo.location}?`,
								'assistant'
							);
							isTyping = false;
						}, 1500);
					} else {
						// Número no encontrado, pero continuamos el flujo
						chatState = 'confirming_identity';
						setTimeout(() => {
							addMessage(
								'¿Podés confirmar tu nombre y ubicación?',
								'assistant'
							);
							isTyping = false;
						}, 1500);
					}
				}
				break;

			case 'confirming_identity':
				// Verificar respuesta afirmativa
				if (normalizedText === 'sí' || normalizedText === 'si' || normalizedText === 'yes' || normalizedText.includes('correcto') || normalizedText.includes('es correcto')) {
					chatState = 'asking_symptoms';
					setTimeout(() => {
						const name = userData.name || 'usuario';
						addMessage(
							`¡Perfecto, ${name}! Gracias por comunicarte conmigo. Ahora, ¿podés contarme qué síntomas estás sintiendo?`,
							'assistant'
						);
						isTyping = false;
					}, 1500);
				} else {
					// Si no confirma, preguntamos de nuevo
					setTimeout(() => {
						addMessage(
							'Por favor, confirmá tu identidad para continuar.',
							'assistant'
						);
						isTyping = false;
					}, 1500);
				}
				break;

			case 'asking_symptoms':
				// Guardar síntomas
				if (!userData.symptoms) {
					userData.symptoms = [];
				}
				userData.symptoms.push(userText.trim());
				
				// Verificar si menciona fiebre
				if (normalizedText.includes('fiebre')) {
					chatState = 'asking_fever_duration';
					setTimeout(() => {
						const name = userData.name || 'usuario';
						addMessage(
							`¿Desde cuándo tenés fiebre, ${name}?`,
							'assistant'
						);
						isTyping = false;
					}, 1500);
				} else {
					// Si no menciona fiebre, preguntamos por otros síntomas
					chatState = 'asking_other_symptoms';
					setTimeout(() => {
						addMessage(
							'¿Tenés algún otro síntoma como tos, dolor en el pecho o dificultad para respirar?',
							'assistant'
						);
						isTyping = false;
					}, 1500);
				}
				break;

			case 'asking_fever_duration':
				userData.feverDuration = userText.trim();
				chatState = 'asking_other_symptoms';
				setTimeout(() => {
					const name = userData.name || 'usuario';
					addMessage(
						`¿Tenés algún otro síntoma como tos, dolor en el pecho o dificultad para respirar?`,
						'assistant'
					);
					isTyping = false;
				}, 1500);
				break;

			case 'asking_other_symptoms':
				// Agregar síntomas adicionales
				if (!userData.symptoms) {
					userData.symptoms = [];
				}
				if (userText.trim().toLowerCase() !== 'no' && !normalizedText.includes('ninguno')) {
					// Marcar como "otros síntomas" con un prefijo especial
					userData.symptoms.push(`OTROS_SINTOMAS:${userText.trim()}`);
				}
				
				// Completar el flujo
				chatState = 'completed';
				setTimeout(() => {
					const name = userData.name || 'usuario';
					const symptoms = userData.symptoms || [];
					const feverDuration = userData.feverDuration || '';
					
					// Construir texto de síntomas
					let symptomsText = '';
					// Limpiar el prefijo OTROS_SINTOMAS: para el mensaje
					const cleanedSymptoms = symptoms.map(s => s.replace(/^OTROS_SINTOMAS:/, '').toLowerCase());
					
					if (feverDuration) {
						// Si hay duración de fiebre, significa que mencionó fiebre
						const otherSymptoms = cleanedSymptoms
							.filter(s => !s.includes('fiebre'));
						
						if (otherSymptoms.length > 0) {
							symptomsText = `fiebre y ${otherSymptoms.join(' y ')} desde hace ${feverDuration}`;
						} else {
							symptomsText = `fiebre desde hace ${feverDuration}`;
						}
					} else {
						// No hay fiebre o no se preguntó por duración
						symptomsText = cleanedSymptoms.join(' y ');
					}
					
					// Construir URL con datos del paciente
					const params = new URLSearchParams();
					params.set('name', encodeURIComponent(name));
					if (userData.affiliateNumber) {
						params.set('affiliateNumber', userData.affiliateNumber);
					}
					if (userData.location) {
						params.set('location', encodeURIComponent(userData.location));
					}
					// Agregar síntomas como query params
					if (symptoms.length > 0) {
						params.set('symptoms', encodeURIComponent(JSON.stringify(symptoms)));
					}
					if (feverDuration) {
						params.set('feverDuration', encodeURIComponent(feverDuration));
					}
					
					const telemedicinaUrl = `/telemedicina-paciente?${params.toString()}`;
					
					const response = `${name}, por los síntomas que presentás —${symptomsText}— te voy a derivar a una consulta de telemedicina con un profesional.<br><br>Podés entrar al siguiente enlace:<br><br><a href="${telemedicinaUrl}" class="float-left flex items-center gap-2 px-1 py-1 border-[1.5px] border-white rounded-full bg-transparent text-white font-medium text-sm no-underline hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5 my-1"><span class="whitespace-nowrap">sps.salud/telemedicina</span></a><br><br>Gracias por confiar en este servicio. Recordá que esto no reemplaza una consulta médica presencial. Hasta luego!`;
					
					addMessage(response, 'assistant');
					isTyping = false;
				}, 1500);
				break;

			case 'completed':
			case 'not_affiliated':
				// El flujo ya está completado, no responder más
				setTimeout(() => {
					addMessage(
						'El chat ha finalizado. Si necesitás más ayuda, podés cerrar y abrir el chat nuevamente.',
						'assistant'
					);
					isTyping = false;
				}, 1500);
				break;

			default:
				// Estado inicial o desconocido
				setTimeout(() => {
					addMessage(
						'Por favor, respondé a la pregunta anterior para continuar.',
						'assistant'
					);
					isTyping = false;
				}, 1500);
				break;
		}
	}

	function handleSend() {
		if (!inputMessage.trim()) return;
		if (chatState === 'completed' || chatState === 'not_affiliated') return;

		// Agregar mensaje del usuario
		addMessage(inputMessage, 'user');
		const userText = inputMessage;
		inputMessage = '';

		// Procesar mensaje y generar respuesta
		isTyping = true;
		processUserMessage(userText);
		
		// Mantener el focus en el input
		focusInput();
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}

	// Resetear el chat cuando se cierra
	$: if (!isOpen && hasInitialMessage) {
		messages = [];
		inputMessage = '';
		isTyping = false;
		hasInitialMessage = false;
		chatState = 'initial';
		userData = {};
	}
</script>

{#if isOpen}
	<!-- Overlay -->
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-end justify-end p-4 pb-6 md:p-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="chat-title"
	>
		<!-- Backdrop clickable -->
		<button
			class="absolute inset-0 w-full h-full"
			on:click={onClose}
			on:keydown={(e) => e.key === 'Escape' && onClose()}
			aria-label="Cerrar modal"
		></button>
		<!-- Modal de Chat -->
		<div
			class="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] md:h-[650px] flex flex-col overflow-hidden transform transition-all duration-300 relative z-10"
		>
			<!-- Header -->
			<div class="bg-[#349392] text-white p-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
						<img src="/images/Asistant.png" alt="Asistente SPS" class="w-full h-full object-cover" />
					</div>
					<div>
						<h3 id="chat-title" class="font-bold text-lg">Asistente SPS</h3>
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							<p class="text-sm text-white/90">En Linea</p>
						</div>
					</div>
				</div>
				<button
					on:click={onClose}
					class="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
					aria-label="Cerrar chat"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Mensajes -->
			<div bind:this={messagesContainer} class="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
				{#each messages as message}
					<div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-[75%] px-4 py-3 {message.sender === 'user'
								? 'bg-[#6FB39D] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl text-shadow-xl'
								: 'bg-[#7A7B7A] text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl text-shadow-xl'}"
						>
							<span class="text-sm whitespace-pre-wrap leading-relaxed block">
								{@html message.text}
							</span>
							<span class="text-xs opacity-75 mt-1 block text-right">
								{message.time}
							</span>
						</div>
					</div>
				{/each}

				{#if isTyping}
					<div class="flex justify-start">
						<div class="bg-[#7A7B7A] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl px-4 py-3">
							<div class="flex gap-1">
								<div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0s"></div>
								<div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
								<div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Input -->
			<div class="border-t border-gray-200 p-4 bg-white">
				<div class="flex items-center gap-2">
					<div class="flex-1 relative">
						<input
							type="text"
							bind:this={inputElement}
							bind:value={inputMessage}
							on:keydown={handleKeyPress}
							placeholder="Escribe tu mensaje..."
							class="text-black w-full px-4 py-4 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FB39D] focus:border-transparent text-sm"
						/>
						<button
							on:click={handleSend}
							disabled={!inputMessage.trim()}
							class="absolute right-1 top-1/2 -translate-y-1/2 p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
							aria-label="Enviar mensaje"
						>
							<svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M24.3403 0.00748641L7.51375 9.3054L0.234475 3.44367C-0.209764 3.09182 0.0162615 2.41057 0.585199 2.35817L24.3403 0V0.00748641Z" fill="#349392"/>
								<path d="M9.77342 19.3668L8.15234 10.3759L24.9789 1.07794L10.9269 19.6214C10.5918 20.0631 9.86694 19.9058 9.77342 19.3668Z" fill="#349392"/>
							</svg>
						</button>
					</div>
					<button
						class="p-2 flex-shrink-0 transition-opacity hover:opacity-80"
						aria-label="Grabar audio"
					>
						<svg width="21" height="31" viewBox="0 0 21 31" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clip-path="url(#clip0_1_199)">
								<path d="M6.59813 31V28.8818H8.29471V25.3712C5.04593 24.6243 2.32983 21.6726 1.52593 18.2413C0.991298 15.9601 1.32691 13.5222 1.21666 11.1878C0.46642 10.4817 -0.519921 9.832 0.323981 8.69557C0.423493 8.56187 1.09471 7.93726 1.1991 7.93726H3.03618L3.09374 16.5618C4.31325 26.4 17.4313 25.8704 17.962 15.957V7.93726H19.8567C19.9064 7.93726 20.5406 8.54098 20.6176 8.63499C21.5562 9.77873 20.5679 10.4566 19.7815 11.1867C19.6586 13.5045 20.0206 15.9392 19.4957 18.2048C18.6898 21.6809 15.9913 24.6108 12.7035 25.3701V28.8807H14.4001V30.999H6.59813V31Z" fill="#349392"/>
								<path d="M9.97877 0.0261431C12.8558 -0.272587 15.4139 2.00027 15.7027 5.06068C15.531 8.54412 15.9232 12.2636 15.7027 15.7189C15.5066 18.7887 12.8285 21.002 10.0188 20.7701C7.64023 20.5737 5.47242 18.3468 5.29486 15.7794C5.05584 12.3211 5.48023 8.55143 5.29486 5.06068C5.53096 2.44314 7.52218 0.282048 9.97877 0.0261431Z" fill="#349392"/>
							</g>
							<defs>
								<clipPath id="clip0_1_199">
									<rect width="21" height="31" fill="white"/>
								</clipPath>
							</defs>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}

	:global(.bg-\[#6FB39D\] a),
	:global(.bg-\[#7A7B7A\] a) {
		color: inherit;
		text-decoration: underline;
		font-weight: 600;
		transition: opacity 0.2s;
	}

	:global(.bg-\[#6FB39D\] a:hover),
	:global(.bg-\[#7A7B7A\] a:hover) {
		opacity: 0.8;
	}
</style>

