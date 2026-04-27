export type UserRole = 'USER' | 'TECHNICIAN' | 'ADMIN';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  USER: 'Usuário',
  TECHNICIAN: 'Técnico',
  ADMIN: 'Administrador'
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  active: boolean;
  createdAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  message: string;
}
