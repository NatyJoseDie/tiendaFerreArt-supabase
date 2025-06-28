'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/backFerre/types';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isReseller: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerReseller: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = user?.role === 'admin';
  const isReseller = user?.role === 'reseller';

  // Verificar la sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          // 🚫 Ya no redirigimos desde acá (lo hace el middleware)
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Obtener perfil del usuario
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      let resellerInfo = null;
      if (profile.role === 'reseller') {
        const { data } = await supabase
          .from('resellers')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (data) {
          resellerInfo = data;
        }
      }

      setUser({
        ...profile,
        user_metadata: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        },
        reseller_info: resellerInfo,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchUserProfile(user.id);
        // 🚫 Redirección automática la maneja el useEffect
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Registrar revendedor
  const registerReseller = async (formData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.first_name} ${formData.last_name}`,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').insert([{
          id: data.user.id,
          email: formData.email,
          full_name: `${formData.first_name} ${formData.last_name}`,
          role: 'reseller',
        }]);

        await supabase.from('resellers').insert([{
          user_id: data.user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          tax_id: formData.tax_id,
          tax_id_type: formData.tax_id_type,
          tax_regime: formData.tax_regime,
          phone: formData.phone,
          address: formData.address,
          business_name: formData.business_name,
          business_address: formData.business_address,
          is_verified: false,
        }]);

        router.push('/registro-exitoso');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  // Refrescar sesión manualmente
  const refreshSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await fetchUserProfile(user.id);
    } else {
      setUser(null);
    }
  };

  // 🔁 Redirección automática después del login
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'reseller')) {
      if (pathname === '/login') {
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      }
    }
  }, [user, pathname]);

  const value = {
    user,
    isLoading,
    isAdmin,
    isReseller,
    login,
    registerReseller,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
