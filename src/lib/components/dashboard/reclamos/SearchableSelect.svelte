<script lang="ts">
	import type { Agente } from '$lib/interfaces/agente.interface';
	import { Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { AngleDownOutline } from "flowbite-svelte-icons";
	export let selectedArea = '';
	export let selectedAgente = '';
	export let searchTermAgente = '';
	export let searchTerm = '';
	let filteredAreas: Array<any> = [];
	let isFocused = false;
	export let areas;
	export let agentes;
	export let agentesData;
	export let selectedAgenteBtn;

	const handleAreaChange = () => {
		selectedAgente = ""; // Resetea el agente al cambiar el área
		searchTermAgente = '';
		selectedAgenteBtn = '';
		agentes = agentesData
			?.filter((agente: Agente) => agente.areaId === Number(selectedArea))
			?.map((agente: Agente) => ({
				value: agente.id,
				name: `${agente?.usuario?.nombre} ${agente?.usuario?.apellido}`
			}));
	};

	const filterAreas = () => {
		filteredAreas = areas.filter((area: { name: string }) =>
			area.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	function isAreaNull(){
		if(searchTerm === ""){
				selectedAgente = ""; // Resetea el agente al cambiar el área
				searchTermAgente = '';
			}
	}

	onMount(() => {
		filterAreas();
	});

	function onClickButton(){
		isFocused = !isFocused;
		searchTerm = "";
		filterAreas();
	}

	$: filterAreas();
	let selectedAreaBtn = "";
</script>

<div class="relative">
	<Button 
	outline color="dark"
	class={"flex w-full gap-2 justify-between"}
	 on:click={onClickButton}>
		{selectedAreaBtn ? selectedAreaBtn : "Seleccione un area"} <AngleDownOutline/>
	</Button>

	
	{#if isFocused }
		<Input
			required
			type="text"
			placeholder="Selecciona un área"
			bind:value={searchTerm}
			on:input={filterAreas}
			on:blur={() => {
				setTimeout(() => (isFocused = false), 200); // Se desactiva el foco, después de un pequeño retardo para permitir el clic en la lista
			}}
			on:change={() => isAreaNull()}
		/>
		<ul class="absolute w-full bg-white border rounded-md mt-1 max-h-48 overflow-auto z-10">
			{#each filteredAreas as area}
				<button
					type="button"
					class="w-full text-left py-2 px-3 hover:bg-gray-300 cursor-pointer text-black"
					class:bg-primary-500={selectedArea === area.value}
					class:text-white={selectedArea === area.value}
					on:click={() => {
						selectedArea = area.value;
						selectedAreaBtn = area.name;
						searchTerm = area.name;
						handleAreaChange();
						isFocused = false; // Cierra la lista después de seleccionar
					}}
				>
					{area.name}
				</button>
			{/each}
		</ul>
	{/if}
</div>