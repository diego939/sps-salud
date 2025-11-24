import * as api from '$lib/api';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url, params }) => {
  const token = cookies.get('token');
  const term = url.searchParams.get('term');
  const tutorId = params.tutorId;

  if (!term || term.length < 2) {
    return json({ success: false, message: 'Término de búsqueda muy corto', data: [] });
  }

  try {
    const response = await api.get({ 
      fetch, 
      endpoint: `alumnos/search?term=${encodeURIComponent(term)}`, 
      token 
    });

    return json({
      success: true,
      message: 'Búsqueda exitosa',
      data: response.data.data || []
    });
  } catch (err) {
    console.error('Error buscando alumnos:', err);
    return json({ 
      success: false, 
      message: 'Error al buscar alumnos', 
      data: [] 
    }, { status: 500 });
  }
};
