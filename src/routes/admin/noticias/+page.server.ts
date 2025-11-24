import * as api from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';


export const load = (async ({ cookies, url, locals }) => {
	const token = cookies.get('token');
	const [noticiasResp] = await Promise.all([api.get({ fetch, endpoint: `noticias/paginated`, token, params: url.searchParams})]);
	console.log(noticiasResp);
	try {
		return {
			noticias: noticiasResp.data.data,
			meta: noticiasResp.data.meta
		};
	} catch (err) {
		console.error('Failed to load noticias:', err);
		throw error(500, 'Failed to load noticias data');
	}
});

export const actions = {
		createNoticia: async ({ request, cookies }: any) => {
			const token = cookies.get('token');
			const formData = await request.formData();
			const titulo = formData.get('titulo');
			const texto = formData.get('texto');
			const copete = formData.get('copete');
			const foto = formData.get('foto');

			try {
				const noticiaResp = await api.post({ fetch, endpoint: `noticias`, token, body: JSON.stringify({ titulo, texto, copete }) });
				const noticiaId = noticiaResp?.data?.id || null;

				if (foto && foto.size > 0 && noticiaId) {
					const formDataFile = new FormData();
					formDataFile.append('file', foto);
					formDataFile.append('noticiaId', noticiaId);
					await api.post({
						fetch,
						endpoint: 'files/upload',
						body: formDataFile,
						token
					});
				}

				return {
					type: 'success',
					data: { message: '¡Noticia creada exitosamente!' }
				};
			} catch (err) {
				console.error('Failed to create noticia:', err);
				throw error(500, 'Failed to create noticia');
			}
		},
	editNoticia: async ({ request, cookies }: any) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		console.log(formData);

		const id = formData.get('id');
		const titulo = formData.get('titulo');
		const texto = formData.get('texto');
		const copete = formData.get('copete');
		const foto = formData.get('foto');
		const deleteImage = formData.get('deleteImage');

		try {
			// Actualizar la noticia
			const noticiaResp = await api.patch({ fetch, endpoint: `noticias/${id}`, token, body: JSON.stringify({ titulo, texto, copete }) });
			console.log(noticiaResp)
			const noticiaId = noticiaResp?.data?.id || id;

			// Si se marcó eliminar imagen, eliminar la imagen actual
			if (deleteImage === 'true' && noticiaId) {
				// Obtener la noticia con sus archivos
				const noticiasResp = await api.get({ fetch, endpoint: `noticias/${noticiaId}`, token });
				const noticia = noticiasResp?.data;
				
				if (noticia?.File && noticia.File.length > 0) {
					// Eliminar la imagen actual
					await api.destroy({
						fetch,
						endpoint: `files/${noticia.File[0].id}`,
						token
					});
				}
			}

			// Si se subió una nueva imagen, subirla
			if (foto && foto.size > 0 && noticiaId) {
				const formDataFile = new FormData();
				formDataFile.append('file', foto);
				formDataFile.append('noticiaId', noticiaId);
				await api.post({
					fetch,
					endpoint: 'files/upload',
					body: formDataFile,
					token
				});
			}

			return { message: '¡Noticia editada exitosamente!' };
		} catch (err) {
			console.error('Failed to edit noticia:', err);
			throw error(500, 'Failed to edit noticia');
		}
	},

	deleteNoticia: async ({ request, cookies, fetch }: any) => {
			const token = cookies.get('token');
			const data = await request.formData();
			const id = data.get('identifier');
			if (!id) {
				return fail(400, { message: 'ID de noticia requerido.' });
			}
			try {
				const res = await api.destroy({
					fetch,
					endpoint: `noticias/${id}`,
					token
				});
				if (res.data.statusCode && res.data.statusCode !== 200) {
					return fail(400, { message: res.data.message });
				}
				return { message: '¡Noticia eliminada exitosamente!' };
			} catch (error) {
				return fail(500, { message: 'Error al eliminar la noticia.' });
			}
	},
	deleteImage: async ({ request, cookies, fetch }: any) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const id = data.get('identifier');
		if (!id) {
			return fail(400, { message: 'ID de noticia requerido.' });
		}
		try {
			const res = await api.destroy({
				fetch,
				endpoint: `files/${id}`,
				token
			});
			if (res.data.statusCode && res.data.statusCode !== 200) {
				return fail(400, { message: res.data.message });
			}
			return { message: '¡Imagen de noticia eliminada exitosamente!' };
		} catch (error) {
			return fail(500, { message: 'Error al eliminar la imagen de la noticia.' });
		}
	}
};