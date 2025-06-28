import { User as AuthUser } from '@supabase/supabase-js';
import { ResellerInfo } from '@/backFerre/types/reseller';

export type UserRole = 'admin' | 'reseller';

export interface User extends Omit<AuthUser, 'email_confirmed_at' | 'phone_confirmed_at' | 'last_sign_in_at' | 'user_metadata' | 'app_metadata'> {
  // Campos estándar de Supabase Auth
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  email_confirmed_at: string | null;
  phone_confirmed_at: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Metadata adicional
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  
  // Estado de la cuenta
  is_active?: boolean;
  
  // Solo para revendedores
  reseller_info?: ResellerInfo;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  phone?: string;
  role?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface UpdateUserDTO {
  email?: string;
  phone?: string | null;
  role?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  updated_at?: string;
}

export interface UserProfile extends User {
  // Aquí puedes incluir relaciones con otras tablas si es necesario
  // Por ejemplo, si un usuario tiene un perfil asociado
  profile?: {
    full_name?: string | null;
    phone?: string | null;
    address?: string | null;
    avatar_url?: string | null;
  };
}
