export interface Reclamo {
  estadoId: number;
  id:                number;
  motivo:            string;
  barrio:            string;
  zona:              string;
  createdAt:         string;
  updatedAt:         string;
  deletedAt:         Date;
  ciudadanoId:       number;
  canalId:           number;
  ciudadano:         Ciudadano;
  canal:             Canal;
  creador:           Agente;
  reclamosHistorias: ReclamosHistoria[];
}

export interface Usuario {
  id:        number;
  email:     string;
  dni:      string;
  nombre:    string;
  apellido:  string;
  createdAt: Date;
}

export interface Canal {
  id:          number;
  descripcion: string;
  createdAt:   Date;
  updatedAt:   Date;
  deletedAt:   null;
  tipo:        string;
  orden:       number;
}

export interface Ciudadano {
  id:        number;
  dni:      string;
  nombre:    string;
  apellido:    string;
  telefono:  string;
  genero:    string;
  email:     string;
  direccion: string;
  direccionDetalle: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface ReclamosHistoria {
  id:          number;
  agente:      Agente;
  area:        Area;
  estado:      Area;
  descripcion: string;
}

interface Agente {
  nombre: string;
  usuario: Usuario;
}

interface Area {
  descripcion: string;
}