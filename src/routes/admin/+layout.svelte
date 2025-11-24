<script>
	import Layout from '$lib/components/dashboard/Layout.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	export let data;
</script>

<Toaster />

<Layout {data}>
	<slot />
</Layout>