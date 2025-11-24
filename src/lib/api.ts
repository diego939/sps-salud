import { PUBLIC_API_URL } from '$env/static/public'
import type {Response} from '$lib/interfaces/response.interface'

type fetchParams = {
  fetch: typeof globalThis.fetch, 
  endpoint: string, 
  params?: URLSearchParams, 
  token?: string,
  body?: string | FormData,
}

function getHeaders(body?: string | FormData, token?: string){
  return {
    Authorization: `Bearer ${token}`,
    'Access-Control-Allow-Origin': '*',
    ...(typeof body === 'string' && {'Content-Type': 'application/json'}),
  }
}

async function connect(args: fetchParams, method = 'GET'): Promise<Response>{
  let url = `${PUBLIC_API_URL}/${args.endpoint}`;
  if(args.params) url += `?${args.params}`;

  try {
    const response = await fetch(url, {method, headers: getHeaders(args.body, args.token), body: args.body });
    const data = await response.json();
    return {ok: true, data};
    
  } catch (error) {
    return {ok: false, data: error};
  }
}

export async function get(args: fetchParams): Promise<Response>{
  return connect(args, 'GET');
}

export async function post(args: fetchParams): Promise<Response>{
  return connect(args, 'POST');
}

export async function patch(args: fetchParams): Promise<Response>{
  return connect(args, 'PATCH');
}

export async function destroy(args: fetchParams): Promise<Response>{
  return connect(args, 'DELETE');
}