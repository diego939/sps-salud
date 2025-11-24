import * as XLSX from 'xlsx';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';

function snakeCaseToWords(str: string) {
	return capitalizeFirstLetter(str.replace(/_/g, ' ').toLowerCase());
}

export const exportToExcel = (reclamos: any, selectedZona: string) => {
	// Construimos la data para el Excel a partir de data.reclamos
	const datos = reclamos.map((reclamo: any) => {
		return {
			'Estado del reclamo': snakeCaseToWords(reclamo?.estado?.descripcion) || '',
			Zona: selectedZona || '',
			Fecha: reclamo.createdAt ? new Date(reclamo.createdAt).toLocaleDateString() : '',
			'Barrio del reclamo': reclamo?.barrio?.descripcion || '',
			'Nombre del vecino': `${reclamo?.ciudadano?.apellido}, ${reclamo?.ciudadano?.nombre}` || '',
			Ubicación: reclamo?.ubicacion || '',
			'Detalle de ubicación': reclamo?.ubicacionDetalle || '',
			Motivo: reclamo?.motivo || '',
			Teléfono: reclamo?.ciudadano?.telefono || ''
		};
	});

	// Creamos la hoja de cálculo
	const worksheet = XLSX.utils.json_to_sheet(datos);
	// Creamos el libro de Excel
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Reclamos');

	// Exportamos el archivo Excel
	XLSX.writeFile(workbook, 'reclamos.xlsx');
};
