<script>
	import { data } from '$lib/sidebarLinks';
	import { page } from '$app/stores';
	import { sidebarOpen } from '../store';
	const style = {
		title: `w-32 text-lg whitespace-pre`,
		inactive: `text-white`,
		active: `font-bold`,
		link: `flex items-center justify-start my-4 p-6 w-full hover:text-white-300 text-lg`,
		close: `lg:duration-700 lg:ease-out lg:invisible lg:opacity-0 lg:transition-all`,
		open: `lg:duration-500 lg:ease-in lg:h-auto lg:opacity-100 lg:transition-all lg:w-auto`
	};
</script>

<ul class="md:pl-5">
	   {#each data as item (item.title)}
		   <li>
			   <a
				   href={item.link}
				   class={`${style.link} 
						   ${item.link === $page.url.pathname ? style.active : style.inactive}`}
			   >
				   <div class={`flex items-center ${item.link === $page.url.pathname ? 'sidebar-active' : ''}`}>
					   <span class={item.link === $page.url.pathname ? 'text-white' : 'text-white'}>
						   <svelte:component this={item.icon} />
					   </span>
					   <span class={`${style.title} ${$sidebarOpen ? style.open : style.close} ${item.link === $page.url.pathname ? 'text-white' : 'text-white'}`}>
						   {item.title}
					   </span>
				   </div>
			   </a>
		   </li>
	   {/each}
</ul>
