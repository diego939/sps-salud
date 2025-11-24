<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Label, Select } from 'flowbite-svelte';

	export let orderCols: string[];

	let order = $page.url.searchParams.get('order');
	let direction = $page.url.searchParams.get('direction');

	let orderOpts: Record<string, string>[];
	orderOpts = orderCols?.flatMap((order) => {
		return ['asc', 'desc'].map((direc) => {
			return { name: `${translate(order)} ${translate(direc)}`, value: `${order} ${direc}` };
		});
	});

	let ordering = order ? `${order} ${direction}` : undefined;

	function translate(label: string | null) {
		if (!label) return;
		if (label === 'createdAt') return 'fecha';
		if (label === 'asc') return 'menor a mayor';
		if (label === 'desc') return 'mayor a menor';
		return label;
	}

	function ordenar() {
		if (!ordering) return;
		//console.log(ordering);
		const split = ordering.split(' ');
		$page.url.searchParams.set('page', '1');
		$page.url.searchParams.set('order', split[0]);
		$page.url.searchParams.set('direction', split[1]);
		goto(`${$page.url.pathname}?${$page.url.searchParams}`, {
			replaceState: true,
			invalidateAll: true
		});
	}
	function clear() {
		$page.url.searchParams.delete('page');
		$page.url.searchParams.delete('order');
		$page.url.searchParams.delete('direction');
		goto(`${$page.url.pathname}?${$page.url.searchParams}`, {
			replaceState: true,
			invalidateAll: true
		});
	}
</script>

<Label forId="ordenar" class="mb-2 font-popMedium">Ordenación</Label>

<Select
	items={orderOpts}
	bind:value={ordering}
	name="ordenar"
	placeholder={'Seleccionar el ordenamiento'}
	on:change={() => ordenar()}
	on:clear={() => clear()}
/>
