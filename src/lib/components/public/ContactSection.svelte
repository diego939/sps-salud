<script>
	import ContactForm from './ContactForm.svelte';
	import ContactInfo from './ContactInfo.svelte';
</script>

<div class="block w-full mt-[30px] bg-[#6FB39D]">
	<div class="max-w-[1050px] mx-auto px-[30px] py-[30px] text-white font-['titular2','Trebuchet_MS',Arial,Helvetica,sans-serif]">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
			<ContactForm />
			<ContactInfo />
		</div>
	</div>
</div>

