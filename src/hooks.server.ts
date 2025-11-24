import { paths, type PathConfig } from '$lib/access';
import * as api from '$lib/api';
import { redirect, type HandleServerError } from '@sveltejs/kit';

export async function handle({ event, resolve }: any) {
  const currentPath = event.url.pathname;
  //console.log('PROCESANDO RUTA:', currentPath);
  
		// Rutas públicas que no requieren autenticación
		const publicRoutes = ['/', '/asociar', '/asociar/pago', '/asociar/carnet'];
		const isPublicRoute = publicRoutes.some(route =>
			currentPath === route || currentPath.startsWith('/asociar/')
		);
  //console.log('ES RUTA PÚBLICA:', isPublicRoute);
  // console.log('RUTAS PÚBLICAS:', publicRoutes);
  // console.log('RUTA ACTUAL:', currentPath);

  // Comprobar si es una solicitud de logout o viene de logout
  if (event.url.pathname === '/logout' || event.url.pathname === '/api/auth/logout' || event.url.searchParams.has('t')) {
    // Limpiar la sesión y continuar
    event.locals.user = undefined;
    event.cookies.delete('token', { path: '/' });
    
    // Para la API de logout, resolver inmediatamente
    if (event.url.pathname === '/api/auth/logout') {
      return await resolve(event);
    }
  }

  // Si es una ruta pública, no verificar autenticación
  if (isPublicRoute) {
    //console.log('RUTA PÚBLICA DETECTADA:', currentPath);
    return await resolve(event);
  }

  const token = event.cookies.get('token');
  //console.log('TOKEN PRESENTE:', !!token);

  //Si no hay token, no hay usuario
  if (!token) {
    event.locals.user = undefined;
    // Si está intentando acceder a rutas de admin sin token, redirigir al login
    if (currentPath.startsWith('/admin')) {
      return redirect(307, '/login');
    }
    return await resolve(event);
  }

  try {
    const res = await api.get({ fetch, endpoint: 'auth/user-admin', token });
    //console.log('RESPUESTA API:', res);
    if (res?.ok) {
      event.locals.user = res.data;

      const userRoles = event?.locals?.user?.roles?.map((r: any) => r.nombre) || [];

      // Buscar la ruta actual en la lista de paths definidos
      const pathConfig = paths?.find((p) => p.root === currentPath);

      // Si la ruta está definida en paths y tiene roles específicos, verificar acceso
      if (pathConfig && pathConfig?.roles && pathConfig.roles.length > 0) {
        // Si no tiene los roles necesarios, redirigir
        if (!pathConfig.roles.some((role) => userRoles.includes(role))) {
          return redirect(307, '/admin/tutores');
        }
      }

      return await resolve(event);
    } else {
      // Token inválido, limpiar sesión
      event.locals.user = undefined;
      event.cookies.delete('token', { path: '/' });
      // Si está en una ruta de admin, redirigir al login
      if (currentPath.startsWith('/admin')) {
        return redirect(307, '/login');
      }
      return await resolve(event);
    }
  } catch (error) {
    // Error en la verificación del token, limpiar sesión
    console.error('Error verificando el token:', error);
    event.locals.user = undefined;
    event.cookies.delete('token', { path: '/' });
    // Si está en una ruta de admin, redirigir al login
    if (currentPath.startsWith('/admin')) {
      return redirect(307, '/login');
    }
    return await resolve(event);
  }
}
