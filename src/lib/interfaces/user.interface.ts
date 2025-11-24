export interface User {
  id: number;
  name: string;
  lastName: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  roles: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export enum UserRole {
  superadmin,
  admin,
  operator,
  customer
}