import {error, fail, redirect} from '@sveltejs/kit';
import * as api from '$lib/api';
import type { Actions } from './$types';

export const load = async ({ cookies, locals, url, fetch }: any) => {
    const token = cookies.get('token');

    // Solo redirigir si estamos en una ruta de admin y no hay usuario
    if (url.pathname.startsWith('/admin') && !locals.user) {
        redirect(303, '/login');
    }

}
