<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Input } from 'flowbite-svelte';

	export let placeholder: string;
	export let url = $page.url.pathname;
	export let disabled = false;

	let search = $page.url.searchParams.get('query') || '';
	let timer: any;

	const debounceSearch = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			$page.url.searchParams.set('page', '1');
			const value = search.trim();
			if (!value) {
				$page.url.searchParams.delete('query');
			} else {
				$page.url.searchParams.set('query', value);
			}
			goto(`${url}?${$page.url.searchParams}`, {
				replaceState: true,
				invalidateAll: true,
				keepFocus: true
			});
		}, 250);
	};
</script>

<!-- svelte-ignore a11y-autofocus -->
<Input
	type="text"
	name="search"
	class=" focus:ring-lime-500 focus:border-lime-500 bg-[#efeded] text-sm md:text-base"
	{placeholder}
	bind:value={search}
	{disabled}
	on:input={() => debounceSearch()}
/>

