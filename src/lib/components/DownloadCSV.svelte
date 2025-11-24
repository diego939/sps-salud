<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'flowbite-svelte';
  export let data: any[] = [];
  export let filename: string = "export.csv";


  function convertArrayOfObjectsToCSV(array: any[]) {
		if (!array || array.length === 0) {
			console.warn("Empty dataset, skipping CSV creation.");
			return null;
		}

		let result = '';
		const columnDelimiter = ';'; 
		const lineDelimiter = '\n';

		const keys = Object.keys(array[0]);
		result += keys.join(columnDelimiter) + lineDelimiter;

		array.forEach((item) => {
			let row = keys.map(key => {
				let value = item[key] === null ? '' : item[key].toString();
				return value.includes(columnDelimiter) ? `"${value.replace(/"/g, '""')}"` : value;
			}).join(columnDelimiter);
			result += row + lineDelimiter;
		});

		return result;
	}

  function downloadCSV() {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const csv = convertArrayOfObjectsToCSV(data);
    if (!csv) return;
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

</script>

<Button on:click={downloadCSV} class="border-lime-500" style="white-space: nowrap;">Descargar CSV</Button>
