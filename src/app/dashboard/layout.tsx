"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirigir al login si no hay sesión o no es admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Mostrar carga mientras se verifica la sesión
  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span className="loading loading-dots loading-lg text-indigo-500"></span>
      </main>
    );
  }

  // Si está autenticado, renderizar la sección
  return <>{children}</>;
}
