/* import * as api from '$lib/api';

export async function load({ locals, fetch }) {
	// Verificar si hay usuario autenticado
	if (!locals.user) {
		return {
			user: null,
			proyectos: [],
			proyectosUser: []
		};
	}

	// Obtener la lista de proyectos para el layout
	const proyectos = await api.get({ fetch, endpoint: 'projects/all' });
	const lotes = await api.get({ fetch, endpoint: `customers/${locals.user.id}/lots` });
	const proyectosUser = await api.get({ fetch, endpoint: `projects/${locals.user.id}/with-users`});
	return {
		user: locals.user,
		proyectos: proyectos?.data?.data || [],
		lotes: lotes?.data?.data || [],
		proyectosUser: proyectosUser.data.project || []
	}
}
 */