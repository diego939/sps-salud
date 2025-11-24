<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';
	import { AngleDownOutline } from "flowbite-svelte-icons";
	import { onMount } from 'svelte';
	export let selectedAgente = '';
	export let selectedArea = '';
	export let searchTermAgente = '';
	export let selectedAgenteBtn = "";
	let filteredAgente: Array<any> = [];
	let isFocused = false;
	export let agentes;

	const filterAgentes = () => {
		filteredAgente = agentes.filter(
			(agente: { value: number; name: string }) =>
				agente?.name.toLowerCase().includes(searchTermAgente.toLowerCase()) && agente?.value !== 3 //hardcodeo a las 2 de la maniana
		);
	};

	onMount(() => {
		filterAgentes();
	});

	$: if (selectedArea) {
    filterAgentes();
	}

	$: filterAgentes();
	let simple = ['one', 'two', 'three'];

	function onClickButton(){
		isFocused = !isFocused;
		searchTermAgente = "";
		filterAgentes();
	}

</script>

<div class="relative">
	<Button 
	disabled={(selectedArea==="" ? true : false)}
	class={"flex w-full gap-2 justify-between"}
	outline color="dark"
	 on:click={onClickButton}>
		{selectedAgenteBtn ? selectedAgenteBtn : "Seleccione un agente"} <AngleDownOutline/> 
	</Button>
	{#if isFocused}
		<Input
			type="text"
			placeholder="Selecciona un agente"
			bind:value={searchTermAgente}
			on:input={filterAgentes}
			on:blur={() => {
				setTimeout(() => (isFocused = false), 200); // Se desactiva el foco, después de un pequeño retardo para permitir el clic en la lista
			}}
			disabled={(selectedArea==="" ? true : false)}
		/>
			<ul class="absolute w-full bg-white border rounded-md mt-1 max-h-48 overflow-auto z-10">
				{#each filteredAgente as agente}
					<button
						type="button"
						class="w-full text-left py-2 px-3 hover:bg-gray-300 cursor-pointer text-black"
						class:bg-primary-500={selectedAgente === agente.value}
						class:text-white={selectedAgente === agente.value}
						on:click={() => {
							selectedAgente = agente.value;
							selectedAgenteBtn = agente.name;
							isFocused = false;
						}}
					>
						{agente.name}
					</button>
				{/each}
			</ul>
		{:else if (isFocused && !filteredAgente)}
			<div
				class="absolute w-full bg-white border rounded-md mt-1 max-h-48 overflow-auto z-10 text-center py-2 text-gray-500"
			>
				No hay agentes en este área
			</div>
	{/if}
</div>
