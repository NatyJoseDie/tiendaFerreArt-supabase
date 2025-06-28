import { supabase } from '@/backFerre/config/supabase';
import { User, UserRole } from '@/backFerre/types/user';
import { ResellerInfo, CreateResellerDTO } from '@/backFerre/types/reseller';
import { AuthResponse } from '@/backFerre/types/auth';

class AuthService {
  // Registrar un nuevo usuario
  async register(email: string, password: string, userData: Partial<User>): Promise<AuthResponse> {
    try {
      // 1. Registrar el usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.user_metadata?.full_name || '',
            avatar_url: userData.user_metadata?.avatar_url || null,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      // 2. Crear el perfil del usuario en la tabla 'profiles'
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            full_name: userData.user_metadata?.full_name || '',
            avatar_url: userData.user_metadata?.avatar_url || null,
            role: userData.role || 'reseller', // Por defecto es revendedor
          },
        ]);

      if (profileError) {
        // Si falla la creación del perfil, intentamos eliminar el usuario de auth
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Error al crear el perfil: ${profileError.message}`);
      }

      // 3. Si es revendedor, crear el registro en la tabla 'resellers'
      if (userData.role === 'reseller' && userData.reseller_info) {
        const { error: resellerError } = await supabase
          .from('resellers')
          .insert([
            {
              user_id: authData.user.id,
              ...userData.reseller_info,
              is_verified: false, // Por defecto no verificado
            },
          ]);

        if (resellerError) {
          // Si falla la creación del revendedor, eliminamos el perfil y el usuario
          await supabase.from('profiles').delete().eq('id', authData.user.id);
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error(`Error al crear el perfil de revendedor: ${resellerError.message}`);
        }
      }

      return {
        user: authData.user as User,
        session: {
          access_token: authData.session?.access_token || '',
          refresh_token: authData.session?.refresh_token || '',
          expires_in: authData.session?.expires_in || 0,
          token_type: authData.session?.token_type || 'bearer',
        },
      };
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  // Registrar un nuevo revendedor
  async registerReseller(resellerData: CreateResellerDTO): Promise<AuthResponse> {
    const userData: Partial<User> = {
      email: resellerData.email,
      role: 'reseller',
      user_metadata: {
        full_name: `${resellerData.first_name} ${resellerData.last_name}`,
      },
      reseller_info: {
        ...resellerData,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    return this.register(resellerData.email, resellerData.password, userData);
  }

  // Iniciar sesión
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No se pudo iniciar sesión');
      }

      // Obtener el perfil del usuario
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        throw new Error('Error al cargar el perfil del usuario');
      }

      // Obtener información adicional si es revendedor
      let resellerInfo: ResellerInfo | undefined;
      if (profileData.role === 'reseller') {
        const { data: resellerData } = await supabase
          .from('resellers')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (resellerData) {
          resellerInfo = resellerData;
        }
      }

      return {
        user: {
          ...data.user,
          role: profileData.role as UserRole,
          user_metadata: {
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
          },
          reseller_info: resellerInfo,
        } as User,
        session: {
          access_token: data.session?.access_token || '',
          refresh_token: data.session?.refresh_token || '',
          expires_in: data.session?.expires_in || 0,
          token_type: data.session?.token_type || 'bearer',
        },
      };
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  // Obtener el usuario actual
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Obtener el perfil del usuario
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profileData) {
      return null;
    }

    // Obtener información adicional si es revendedor
    let resellerInfo: ResellerInfo | undefined;
    if (profileData.role === 'reseller') {
      const { data: resellerData } = await supabase
        .from('resellers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (resellerData) {
        resellerInfo = resellerData;
      }
    }

    return {
      ...user,
      role: profileData.role as UserRole,
      user_metadata: {
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
      },
      reseller_info: resellerInfo,
    } as User;
  }

  // Actualizar perfil
  async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.user_metadata?.full_name,
        avatar_url: updates.user_metadata?.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }
  }

  // Restablecer contraseña
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Actualizar contraseña
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Verificar si el correo ya está registrado
  async isEmailRegistered(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows returned
      throw new Error(error.message);
    }

    return !!data;
  }
}

export const authService = new AuthService();
