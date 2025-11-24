<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	
	let mobileMenuOpen = false;
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
	
	function handleNavigation(href: string, event: MouseEvent) {
		event.preventDefault();
		goto(href);
		if (mobileMenuOpen) {
			mobileMenuOpen = false;
		}
	}
	
	const menuItems = [
		{ href: '/', label: 'Inicio' },
		{ href: '/empresa', label: 'Empresa' },
		{ href: '/oficinas', label: 'Oficinas' },
		{ href: '/planes', label: 'Planes' },
		{ href: '/afiliarse', label: 'Afiliación' }
	];
</script>

<!-- Menu PC -->
<div class="hidden md:block">
	<div class="bg-[#349392] h-[43px] relative z-[999] bg-[url('/images/menu_new.jpg')] bg-repeat-x">
		<div class="max-w-[960px] mx-auto text-center">
			{#each menuItems as item}
				<div class="inline-block cursor-pointer mt-2">
					<a 
						href={item.href}
						on:click={(e) => handleNavigation(item.href, e)}
						class="my-[5px] py-2 px-[14px] pb-[13px] lg:py-[25px] lg:px-6 lg:pb-[10px] text-lg font-semibold no-underline transition-colors {($page.url.pathname === item.href) ? 'text-black bg-[#e3eee2]' : 'text-white hover:text-black hover:bg-[#e3eee2]'}"
					>
						{item.label}
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Menu Mobile -->
<div class="block md:hidden">
	<div class="bg-[#349392] h-[43px] relative z-[999] bg-[url('/images/menu_new.jpg')] bg-repeat-x">
		<a 
			class="cursor-pointer absolute mt-[7px] ml-[13px]" 
			on:click={toggleMobileMenu}
			on:keydown={(e) => e.key === 'Enter' && toggleMobileMenu()}
			role="button" 
			tabindex="0"
		>
			<img src="/images/icon_menu.png" alt="Menú" />
		</a>
		<div class="block md:hidden overflow-auto">
			<div class="text-white inline-block float-right font-sans text-[23px] mt-2 mr-[10px]">
				(379) 426-7143
			</div>
		</div>
	</div>

	{#if mobileMenuOpen}
		<div class="block">
			<div class="w-full font-['titular'] text-white">
				<ul class="m-0 p-0 border-0 list-none leading-none block relative box-border">
					{#each menuItems as item, index}
						<li class="m-0 p-0 border-0 list-none leading-none block relative box-border {index === menuItems.length - 1 ? 'last' : ''}">
							<a 
								href={item.href}
								on:click={(e) => handleNavigation(item.href, e)}
								class="block m-0 px-5 py-[15px] border-0 list-none leading-none relative box-border cursor-pointer z-[2] text-sm font-semibold no-underline bg-[#349392] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] {($page.url.pathname === item.href) ? 'text-black bg-[#e3eee2]' : 'text-white hover:text-[#eeeeee] hover:bg-[#349392]'}"
							>
								<span>{item.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</div>

