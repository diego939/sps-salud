<script lang="ts">
	import { page } from '$app/stores';

	export let prev: number | undefined | null;
	export let next: number | undefined | null;
	export let lastPage: number | undefined | null;
	export let currentPage: number | undefined | null;
	export let total: number | undefined | null = undefined;
	export let perPage: number | undefined | null = undefined;
	export let url = $page.url.pathname;

	// ignorar props
	function ignoreProps() {
		total;
		perPage;
	}

	$: nextUrl = getUrlForPage($page.url.searchParams, next);
	$: previousUrl = getUrlForPage($page.url.searchParams, prev);

	function getUrlForPage(searchParams: URLSearchParams, page: number | undefined | null) {
		if (!page) return '';

		const params = new URLSearchParams(searchParams);
		params.set('page', `${page}`);
		return `${url}?${params}`;
	}
</script>

<!-- First navigation component with larger text and padding -->
<nav aria-label="Page navigation" class={$$props.class}>
	<!-- Unordered list container with flex display and no list style -->
	<ul class="list-style-none flex justify-center">
		<!-- Previous button (disabled) -->
		<li>
			<a
				href={previousUrl ? previousUrl : '#'}
				aria-disabled={previousUrl ? 'false' : 'true'}
				class:pointer-events-none={!previousUrl}
				class:dark:text-neutral-500={!previousUrl}
				class:text-neutral-400={!previousUrl}
				class="hover:text-primary-500 text-gray-700 dark:text-gray-300 dark:hover:text-primary-300 relative block bg-transparent px-5 text-lg transition-all duration-300"
			>
				Ant.</a
			>
		</li>
		<li>
			<span
				class="relative block bg-transparent px-5 text-lg transition-all duration-300 dark:text-gray-300 text-gray-700"
			>
				{currentPage}
				de
				{lastPage}
			</span>
		</li>
		<!-- Next button -->
		<li>
			<a
				href={nextUrl ? nextUrl : '#'}
				aria-disabled={nextUrl ? 'false' : 'true'}
				class:pointer-events-none={!nextUrl}
				class:dark:text-neutral-500={!nextUrl}
				class:text-neutral-400={!nextUrl}
				class="hover:text-primary-500 text-gray-700 dark:hover:text-primary-300 dark:text-gray-300 relative block bg-transparent px-5 text-lg transition-all duration-300"
			>
				Sig.
			</a>
		</li>
	</ul>
</nav>
