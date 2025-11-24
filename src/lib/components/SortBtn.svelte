<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let key = '';
	export let label = '';

	$: direction =
		$page.url.searchParams.get('order') === key ? $page.url.searchParams.get('direction') : null;

	function ordenar() {
		const sentido = !direction || direction === 'desc' ? 'asc' : 'desc';
		$page.url.searchParams.set('page', '1');
		$page.url.searchParams.set('order', key);
		$page.url.searchParams.set('direction', sentido);
		goto(`${$page.url.pathname}?${$page.url.searchParams}`, {
			replaceState: true,
			invalidateAll: true
		});
	}
</script>

<button on:click={ordenar} type="button" class="sort-btn">
	<span class="uppercase">{label}</span>
	<div class="btn-icons">
		<svg
			class="{direction === 'desc' ? 'active' : 'inactive'} bi bi-caret-up-fill block"
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			fill="currentColor"
			viewBox="0 0 16 16"
		>
			<path
				d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
			/>
		</svg>
		<svg
			class="{direction === 'asc' ? 'active' : 'inactive'} bi bi-caret-down-fill block"
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			fill="currentColor"
			viewBox="0 0 16 16"
		>
			<path
				d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
			/>
		</svg>
	</div>
</button>

<style>
	.sort-btn {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
	}

	.sort-btn,
	.sort-btn:focus,
	.sort-btn:hover,
	.sort-btn:active,
	.sort-btn:visited {
		border: none;
		background-color: transparent;
		padding: 0;
		margin: 0;
	}

	.btn-icons {
		display: flex;
		flex-direction: column;
	}

	.sort-btn:hover {
		opacity: 0.8;
	}

	.active {
		color: black;
	}

	.inactive {
		color: gray;
		opacity: 0.5;
	}
</style>
