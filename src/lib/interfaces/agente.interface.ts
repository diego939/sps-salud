export interface Agente {
    id:        number;
    areaId:    number;
    usuarioId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    nombre:    string;
    usuario:   Usuario;
    area:      Area;
}

interface Area {
    id:          number;
    descripcion: string;
}

interface Usuario {
    id:        number;
    email:     string;
    dni:      string;
    nombre:    string;
    apellido:  string;
    createdAt: Date;
}
