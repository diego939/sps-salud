<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Input, Label, Select } from 'flowbite-svelte';

	export let placeholder: string;
	export let url = $page.url.pathname;
	export let disabled = false;

	let dni = $page.url.searchParams.get('dni') || '';
	let genero = $page.url.searchParams.get('genero') || '';
	let timer: any;

	const debounceSearch = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			$page.url.searchParams.set('page', '1');
			const dniValue = dni.trim();
			const generoValue = genero.trim();
			if (!dniValue || !generoValue) {
				$page.url.searchParams.delete('search');
			} else {
				$page.url.searchParams.set('search', value);
			}
			goto(`${url}?${$page.url.searchParams}`, {
				replaceState: true,
				invalidateAll: true,
				keepFocus: true
			});
		}, 500);
	};
</script>

<!-- svelte-ignore a11y-autofocus -->
<div>
	<Label class="space-y-2 mb-2">Género</Label>
	<Select
		bind:value={genero}
		name="genero"
		items={[
			{ value: 'masculino', name: 'Masculino' },
			{ value: 'femenino', name: 'Femenino' },
			{ value: 'x', name: 'X' }
		]}
		placeholder="Seleccione un género"
		required
	/>
</div>
<Input
	id="searchInput"
	type="text"
	name="search"
	placeholder=" Buscar usuario"
	bind:value={search}
	{disabled}
	on:input={() => debounceSearch()}
/>
