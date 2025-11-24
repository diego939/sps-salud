import * as api from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';


export const load = (async ({ cookies, url, locals }) => {
	const token = cookies.get('token');

	const [tutoresResp] = await Promise.all([api.get({ fetch, endpoint: `tutores/paginated`, token, params: url.searchParams})]);
	try {
		return {
			tutores: tutoresResp.data.data,
			meta: tutoresResp.data.meta
		};
	} catch (err) {
		console.error('Failed to load tutores:', err);
		throw error(500, 'Failed to load tutores data');
	}
});

export const actions = {
	createTutor: async ({ request, cookies }: any) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		console.log(formData);
		
		const nombre = formData.get('nombre');
		const apellido = formData.get('apellido');
		const dni = formData.get('dni');
		const numero_tramite = formData.get('numero_tramite');

		// Validaciones básicas
		if (!nombre || !apellido || !dni) {
			return fail(400, { message: 'Nombre, apellido y DNI son requeridos.' });
		}

		try {
			const response = await api.post({ 
				fetch, 
				endpoint: `tutores`, 
				token, 
				body: JSON.stringify({ 
					nombre, 
					apellido, 
					dni, 
					numero_tramite: numero_tramite || null,
					alumnos_ids: [] // Por ahora vacío, se pueden asociar después
				}) 
			});
			// Obtener el id del tutor creado (ajusta según la respuesta real de tu API)
			const tutorId = response?.data?.data?.id;
			return {
				type: 'success',
				data: { message: '¡Tutor creado exitosamente!', id: tutorId }
			};
		} catch (err) {
			console.error('Failed to create tutor:', err);
			return fail(500, { message: 'Error al crear el tutor. Verifique que el DNI no esté duplicado.' });
		}
	},

	editTutor: async ({ request, cookies }: any) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		console.log(formData);

		const id = formData.get('id');
		const nombre = formData.get('nombre');
		const apellido = formData.get('apellido');
		const dni = formData.get('dni');
		const numero_tramite = formData.get('numero_tramite');

		// Validaciones básicas
		if (!id || !nombre || !apellido || !dni) {
			return fail(400, { message: 'ID, nombre, apellido y DNI son requeridos.' });
		}

		try {
			const response = await api.patch({ 
				fetch, 
				endpoint: `tutores/${id}`, 
				token, 
				body: JSON.stringify({ 
					nombre, 
					apellido, 
					dni, 
					numero_tramite: numero_tramite || null 
				}) 
			});
			
			return { 
				type: 'success',
				message: '¡Tutor editado exitosamente!' 
			};
		} catch (err) {
			console.error('Failed to edit tutor:', err);
			return fail(500, { message: 'Error al editar el tutor. Verifique que el DNI no esté duplicado.' });
		}
	},

	deleteTutor: async ({ request, cookies, fetch }: any) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const id = data.get('identifier');
		
		if (!id) {
			return fail(400, { message: 'ID de tutor requerido.' });
		}
		
		try {
			const res = await api.destroy({
				fetch,
				endpoint: `tutores/${id}`,
				token
			});
			
			if (res.data.statusCode && res.data.statusCode !== 200) {
				return fail(400, { message: res.data.message });
			}
			
			return { 
				type: 'success',
				message: '¡Tutor eliminado exitosamente!' 
			};
		} catch (error) {
			console.error('Failed to delete tutor:', error);
			return fail(500, { message: 'Error al eliminar el tutor.' });
		}
	}
};