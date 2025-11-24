import * as api from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';


export const load = (async ({ cookies, url, params }) => {
	const token = cookies.get('token');
	const tutorId = params.tutorId;
	
	try {
		// Cargar alumnos del tutor específico y datos del tutor
		const [alumnoResp, tutorResp] = await Promise.all([
			api.get({ fetch, endpoint: `alumnos/tutor/${tutorId}`, token }),
			api.get({ fetch, endpoint: `tutores/${tutorId}`, token })
		]);
		
		return {
			alumno: alumnoResp.data.data || [],
			tutor: tutorResp.data.data || {},
			meta: { total: alumnoResp.data.data?.length || 0 }
		};
	} catch (err) {
		console.error('Failed to load data:', err);
		// Fallback: cargar datos vacíos para evitar errores
		return {
			alumno: [],
			tutor: {},
			meta: { total: 0 }
		};
	}
});

export const actions = {
	createAlumno: async ({ request, cookies }: any) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		console.log('🚀 Action createAlumno - FormData:', formData);
		
		const nombre = formData.get('nombre');
		const apellido = formData.get('apellido');
		const dni = formData.get('dni');
		const personaId = formData.get('personaId');
		
		try {
			const body = {
				nombre,
				apellido,
				dni,
				...(personaId && { personaId })
			};
			
			const response = await api.post({ 
				fetch, 
				endpoint: `alumnos`, 
				token, 
				body: JSON.stringify(body) 
			});
			
			console.log('🚀 Action createAlumno - Respuesta:', response);
			console.log('🚀 Action createAlumno - Estructura response:', {
				data: response.data,
				dataType: typeof response.data,
				dataData: response.data?.data,
				dataDataType: typeof response.data?.data
			});
			
					// Validar que la respuesta tenga los datos esperados
			if (!response.data || !response.data.data || !response.data.data.id) {
				console.error('🚀 Action createAlumno - Respuesta inválida:', response);
				throw new Error('Respuesta inválida del servidor: no se pudo obtener el ID del alumno creado');
			}
			
			return {
				message: '¡Alumno creado exitosamente!',
				alumno: response.data.data, // Los datos del alumno creado
				alumnoId: response.data.data.id // ID específico para fácil acceso
			};
		} catch (err: any) {
			console.error('🚀 Action createAlumno - Error:', err);
			return fail(400, { 
				message: err.message || 'Error al crear el alumno' 
			});
		}
	},

	associateAlumno: async ({ request, cookies, params }: any) => {
        const token = cookies.get('token');
        const tutorId = params.tutorId;
        const formData = await request.formData();
        
        const alumnoId = formData.get('alumnoId');
        
        console.log('🚀 Action associateAlumno:', { tutorId, alumnoId });
        
        if (!alumnoId) {
            return fail(400, { message: 'ID de alumno requerido' });
        }
        
        try {
            const bodyData = {
                tutorId: parseInt(tutorId),
                alumnoId: parseInt(alumnoId as string)
            };
            
            console.log('🚀 Action associateAlumno - Body a enviar:', bodyData);
            
            const response = await api.post({
                fetch,
                endpoint: `alumnos/associate`,
                token,
                body: JSON.stringify(bodyData)
            });
              console.log('🚀 Action associateAlumno - Respuesta:', response);
            
            return {
                message: '¡Alumno asociado exitosamente!',
                association: response.data.data
            };        } catch (err: any) {
            console.error('🚀 Action associateAlumno - Error:', err);
            
            // Manejar errores específicos
            if (err.message && err.message.includes('ya existe')) {
                return {
                    warning: true,
                    message: 'La asociación ya existe'
                };
            }
            
            return fail(400, {
                message: err.message || 'Error al asociar el alumno'
            });
        }
    },

	editAlumno: async ({ request, cookies }: any) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		console.log(formData);

		const id = formData.get('id');
		const nombre = formData.get('nombre');
		const apellido = formData.get('apellido');
		const dni = formData.get('dni');
		try {
			await api.patch({ fetch, endpoint: `alumnos/${id}`, token, body: JSON.stringify({ nombre, apellido, dni }) });
			return { message: '¡Alumno editado exitosamente!' };
		} catch (err) {
			console.error('Failed to edit Alumno:', err);
			throw error(500, 'Failed to edit Alumno');
		}
	},	deleteAlumno: async ({ request, cookies, fetch, params }: any) => {
		console.log('🚀 ACTION deleteAlumno iniciado');
		const token = cookies.get('token');
		const data = await request.formData();
		const alumnoIdRaw = data.get('identifier');
		const tutorIdRaw = params.tutorId;
		
		// Convertir a números y validar
		const alumnoId = parseInt(alumnoIdRaw as string);
		const tutorId = parseInt(tutorIdRaw as string);
		
		console.log('🚀 Datos recibidos:', { 
			alumnoIdRaw, 
			tutorIdRaw, 
			alumnoId,
			tutorId,
			alumnoIdIsValid: !isNaN(alumnoId),
			tutorIdIsValid: !isNaN(tutorId)
		});
		
		if (!alumnoIdRaw || isNaN(alumnoId)) {
			console.log('🚀 Error: No alumnoId válido');
			return fail(400, { message: 'ID de Alumno requerido y debe ser un número válido.' });
		}
		
		if (!tutorIdRaw || isNaN(tutorId)) {
			console.log('🚀 Error: No tutorId válido');
			return fail(400, { message: 'ID de Tutor requerido y debe ser un número válido.' });
		}
		
		try {
			console.log('🚀 Enviando petición de desasociación...');
			// Enviar números directamente en el body
			const bodyData = {
				tutorId: tutorId,
				alumnoId: alumnoId
			};
			console.log('🚀 Body a enviar (números):', bodyData);
			
			const res = await api.destroy({
				fetch,
				endpoint: `alumnos/disassociate`,
				token,
				body: JSON.stringify(bodyData)
			});
			
			console.log('🚀 Respuesta del backend:', res);
			
			if (res.data.statusCode && res.data.statusCode !== 200) {
				console.log('🚀 Error en respuesta:', res.data.message);
				return fail(400, { message: res.data.message });
			}
			console.log('🚀 Éxito en desasociación');
			return { 
				type: 'success',
				message: '¡Alumno desasociado exitosamente!' 
			};
		} catch (error) {
			console.log('🚀 Error en catch:', error);
			return fail(500, { message: 'Error al desasociar el Alumno.' });
		}
	}
};