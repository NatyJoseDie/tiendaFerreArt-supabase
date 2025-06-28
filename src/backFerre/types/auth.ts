import { User } from './user';
import { Profile } from './profile';

export interface RegisterUserDTO {
  // Campos de autenticación
  email: string;
  password: string;
  
  // Información del perfil
  profile: {
    full_name: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  profile?: Profile;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
}

export interface PasswordResetDTO {
  email: string;
}

export interface UpdatePasswordDTO {
  newPassword: string;
}
