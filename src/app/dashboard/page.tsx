"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link';

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

const menu = [
  { label: "Home", path: "/dashboard", icon: "🏠" },
  { label: "Costos Privados", path: "/dashboard/costos", icon: "💸" },
  { label: "Ventas C. Final", path: "/dashboard/ventas-cfinal", icon: "📊" },
  { label: "Ventas Mayoristas", path: "/dashboard/ventas-mayoristas", icon: "👥" },
  { label: "Mi Catálogo (Público)", path: "/dashboard/catalogo", icon: "📷" },
  { label: "Consumidor Final", path: "/dashboard/consumidor-final", icon: "🛒" },
  { label: "Portal Cliente", path: "/dashboard/portal-cliente", icon: "💼" },
];

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<number>(0);
  const [lowStock, setLowStock] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch products count and low stock
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const result = await res.json();
        const productsData = Array.isArray(result) ? result : [];
        setProducts(productsData.length);
        setLowStock(productsData.filter((p: any) => Number(p.stock) <= 0).length);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(0);
        setLowStock(0);
      }
    };
    fetchProducts();
    // Fetch total sales (dummy, implement with your sales API)
    const fetchSales = async () => {
      // TODO: Cambia por tu endpoint real de ventas
      setTotalSales(0);
    };
    fetchSales();
  }, []);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-indigo-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-indigo-400 to-purple-500">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
            {user.full_name?.[0] || user.email[0]}
          </div>
          <div>
            <div className="font-semibold text-white text-lg">{user.full_name || user.email}</div>
            <div className="text-xs text-white/80">Panel {user.role === "admin" ? "Vendedora" : user.role}</div>
          </div>
        </div>
        <button
          className="bg-white/80 px-4 py-2 rounded font-semibold hover:bg-white"
          onClick={logout}
        >
          ⏏ Salir
        </button>
      </div>
      {/* Menu */}
      <div className="flex gap-2 px-8 py-3 bg-white border-b">
        {menu.map((item, i) => (
          <Link
            key={item.path}
            href={item.path}
            className={classNames(
              "flex items-center gap-2 px-4 py-2 rounded font-medium text-gray-700 hover:bg-indigo-100",
              pathname === item.path && "bg-orange-500 text-white hover:bg-orange-600"
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
      {/* Main */}
      <main className="max-w-4xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-2">Bienvenida de nuevo, {user.role}!</h1>
        <p className="mb-6 text-gray-600">Aquí puedes administrar costos, catálogos y ventas.</p>
        {/* Resumen Rápido */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">Resumen Rápido</h2>
          <p className="mb-6 text-gray-500">Un vistazo general a tu actividad.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded p-4 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2">Ingresos Totales por Ventas</div>
              <div className="text-2xl font-bold">${totalSales.toLocaleString("es-AR", {minimumFractionDigits:2})}</div>
              <div className="text-xs mt-2">Suma de todas las ventas registradas.</div>
            </div>
            <div className="bg-indigo-50 rounded p-4 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2">Productos Activos</div>
              <div className="text-2xl font-bold">{products}</div>
              <div className="text-xs mt-2">Productos en tu lista de costos.</div>
            </div>
            <div className="bg-indigo-50 rounded p-4 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2">Alertas de Stock</div>
              <div className="text-2xl font-bold">{lowStock}</div>
              <div className="text-xs mt-2">Productos con stock bajo o nulo.</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
