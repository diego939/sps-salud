<script lang="ts">
	import ChatModal from './ChatModal.svelte';
	
	let isChatOpen = false;
	
	function toggleChat() {
		isChatOpen = !isChatOpen;
	}
	
	function closeChat() {
		isChatOpen = false;
	}
</script>

<button
	on:click={toggleChat}
	class="fixed bottom-[100px] right-5 z-[1000] w-[60px] h-[60px] bg-[#25D366] rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.5)] flex justify-center items-center hover:shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-shadow duration-200 cursor-pointer border-none"
	title="Asistente Virtual"
	aria-label="Abrir chat con asistente virtual"
>
	<img src="/images/asistente.png" alt="Asistente Virtual" class="w-[45px] h-[45px] object-contain" />
</button>

<ChatModal isOpen={isChatOpen} onClose={closeChat} />

