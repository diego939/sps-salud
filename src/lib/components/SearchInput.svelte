<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Input } from 'flowbite-svelte';

	export let placeholder: string;
	export let url = $page.url.pathname;
	export let disabled = false;

	let search = $page.url.searchParams.get('search') || '';
	let timer: any;

	const debounceSearch = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			$page.url.searchParams.set('page', '1');
			const value = search.trim();
			if (!value) {
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
<Input
	id="searchInput"
	type="text"
	name="search"
	{placeholder}
	bind:value={search}
	{disabled}
	on:input={() => debounceSearch()}
/>
