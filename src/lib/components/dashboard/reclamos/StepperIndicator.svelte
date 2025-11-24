<script lang="ts">
	import { reclamosStepsStore } from '$lib/stores/reclamosStore';

	import { Indicator } from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';

	const handleColorLine = (inStep: boolean) => {
		return inStep
			? 'flex w-full bg-blue-500 h-0.5 dark:bg-blue-700'
			: 'flex w-full bg-gray-200 h-0.5 dark:bg-gray-700';
	};

	const handleColorChecked = (inStep: boolean) => {
		return inStep
			? 'w-6 h-6 text-primary-600 dark:text-primary-300'
			: 'w-6 h-6 text-gray-600 dark:text-gray-300';
	};
</script>

<ol class="flex items-center max-w-[500px] mx-auto justify-center px-8">
	<li class="relative mb-6 w-full max-w-[200px]">
		<div class="flex items-center w-full min-w-[100px] max-w-[200px]">
			<Indicator
				size="xl"
				color="none"
				class="bg-primary-200 dark:bg-primary-900 z-10 ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0"
			>
				<CheckCircleSolid class={handleColorChecked($reclamosStepsStore.step1)} />
			</Indicator>
			<div class={handleColorLine($reclamosStepsStore.step2)}></div>
		</div>

		<h3 class="font-medium text-gray-900 dark:text-white mt-3 -ml-3">Paso 1</h3>
	</li>
	<li class="relative mb-6 w-full max-w-[200px]">
		<div class="flex items-center w-full min-w-[100px] max-w-[200px]">
			<Indicator
				size="xl"
				color="none"
				class="bg-primary-200 dark:bg-primary-900 z-10 ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0 "
			>
				<CheckCircleSolid class={handleColorChecked($reclamosStepsStore.step2)} />
			</Indicator>
			<div class={handleColorLine($reclamosStepsStore.step3)}></div>
		</div>

		<h3 class="font-medium text-gray-900 dark:text-white mt-3 -ml-3">Paso 2</h3>
	</li>

	<li class="relative w-fit mb-6">
		<div class="flex items-center w-full">
			<Indicator
				size="xl"
				color="gray"
				class="bg-primary-200 dark:bg-primary-900 z-10 ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0"
			>
				<CheckCircleSolid class={handleColorChecked($reclamosStepsStore.step3)} />
			</Indicator>
		</div>

		<h3 class="font-medium text-gray-900 dark:text-white mt-3 -ml-3 min-w-[60px]">Paso 3</h3>
	</li>
</ol>

