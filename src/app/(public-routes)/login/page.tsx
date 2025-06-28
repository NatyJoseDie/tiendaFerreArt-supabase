"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      router.push("/dashboard/products");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  // Redirigir si ya está logueado
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          required
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
}
