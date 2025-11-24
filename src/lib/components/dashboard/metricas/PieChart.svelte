<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
	import { browser } from '$app/environment';

	// Registrando los componentes necesarios de Chart.js
	Chart.register(PieController, ArcElement, Tooltip, Legend);

	export let data = [30, 50, 20];
	export let labels = ['Red', 'Blue', 'Yellow'];
	export let backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'];

	let labelOrientation = 'top';
	let labelFontSize = 14;
	let canvas: HTMLCanvasElement;
	let chart: Chart | undefined;

	function handleResize() {
		if (window.innerWidth > 1024) {
			// labelOrientation = 'right';
			labelFontSize = 20;
		}
	}

	onMount(() => {
		if (browser) {
			handleResize();
		}
		chart = new Chart(canvas, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: backgroundColors
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: labelOrientation as 'top' | 'right',
						labels: {
							font: {
								size: labelFontSize
							},
							padding: 20
						}
					},
					tooltip: {
						callbacks: {
							label: function (tooltipItem) {
								return `${tooltipItem.label}: ${tooltipItem.raw}%`;
							}
						}
					}
				}
			}
		});
	});

	afterUpdate(() => {
		if (chart) {
			chart.data.labels = labels;
			chart.data.datasets![0].data = data;
			chart.data.datasets![0].backgroundColor = backgroundColors;
			chart.update();
		}
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		max-height: 400px;
		width: 320px;
	}
</style>
