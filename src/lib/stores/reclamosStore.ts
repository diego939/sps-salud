import type { Ciudadano, Reclamo } from "$lib/interfaces/reclamos.interface";
import { writable } from "svelte/store";

export const ciudadanoStore = writable(null) as (Ciudadano | any);

export const reclamosStepsStore = writable({
    step1: true,
    step2: false,
    step3: false,
});

export const formModal = writable(false);


export const reclamoStore = writable(null) as (Reclamo | any);
