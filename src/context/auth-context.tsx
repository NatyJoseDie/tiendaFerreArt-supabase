"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: string;
}

interface AuthContextProps {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClientComponentClient());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      // Obtener la sesión actual al montar la app
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, full_name, role")
          .eq("id", session.user.id)
          .single();
        setUser(profile as UserProfile | null);
      }
      // Si no hay sesión, user permanece null
      setLoading(false);
    };

    getInitialSession();

    // Suscribirse a cambios de autenticación
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, full_name, role")
          .eq("id", session.user.id)
          .single();
        setUser(profile as UserProfile | null);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email: string, password: string) => {
    console.log('LLAMANDO signInWithPassword', email);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('RESPUESTA signInWithPassword', error);
      if (error) {
        throw error;
      }
      // onAuthStateChange will handle setting the user state
    } catch (error) {
      throw error; // Re-throw to be caught by the login page UI
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
