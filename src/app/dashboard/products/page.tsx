"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  cost_price: number;
  category: string;
  images: string[];
  description?: string;
  created_at?: string;
}

interface CategoryGroup {
  name: string;
  products: Product[];
  isOpen: boolean;
}

export default function ProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Toggle para expandir/colapsar categorías
  const toggleCategory = (categoryName: string) => {
    setCategories(categories.map(cat => 
      cat.name === categoryName 
        ? { ...cat, isOpen: !cat.isOpen }
        : cat
    ));
  };
  
  // Expandir/colapsar todas las categorías
  const toggleAllCategories = (isOpen: boolean) => {
    setCategories(categories.map(cat => ({
      ...cat,
      isOpen
    })));
  };

  // Función para cargar productos y agrupar por categoría
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Cargar todos los productos sin paginación
      const res = await fetch('/api/products?limit=1000');
      
      if (!res.ok) {
        throw new Error('Error al cargar los productos');
      }
      
      const result = await res.json();
      const products: Product[] = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      
      // Agrupar productos por categoría
      const categoriesMap = new Map<string, Product[]>();
      
      products.forEach((product: Product) => {
        const category = product.category || 'Sin categoría';
        if (!categoriesMap.has(category)) {
          categoriesMap.set(category, []);
        }
        categoriesMap.get(category)?.push(product);
      });
      
      // Convertir a array de categorías con productos
      const categoriesData: CategoryGroup[] = Array.from(categoriesMap.entries()).map(([name, products]) => ({
        name,
        products,
        isOpen: false // Por defecto cerradas
      }));
      
      setCategories(categoriesData);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Redireccionar si el usuario no está autenticado o no es admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Cargar productos una vez que se confirma que el usuario es admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadProducts();
    }
  }, [user, loadProducts]);

  // Función para manejar la búsqueda con debounce
  useEffect(() => {
    if (!searchTerm) {
      loadProducts();
      return;
    }

    const timer = setTimeout(() => {
      setCategories(prevCategories => {
        const filtered = prevCategories.map(category => ({
          ...category,
          products: category.products.filter(
            product => 
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        })).filter(category => category.products.length > 0);

        return filtered;
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, loadProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar el producto');
      
      // Actualizar la lista de productos eliminando el producto eliminado
      setCategories(prevCategories => 
        prevCategories.map(category => ({
          ...category,
          products: category.products.filter(product => product.id !== id)
        })).filter(category => category.products.length > 0)
      );
    } catch (err: any) { 
      setError(err.message); 
    }
  };

  if (loading) return <div className="p-4">Cargando productos...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <div className="flex gap-2">
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => toggleAllCategories(true)}
          >
            Expandir todo
          </button>
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => toggleAllCategories(false)}
          >
            Colapsar todo
          </button>
          <Link href="/dashboard/products/new" className="btn btn-primary">
            Nuevo Producto
          </Link>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="form-control w-full max-w-xs">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="alert alert-info">No hay productos disponibles</div>
        ) : (
          categories.map((category) => (
            <div key={category.name} className="border rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-base-200 cursor-pointer hover:bg-base-300"
                onClick={() => toggleCategory(category.name)}
              >
                <div className="font-bold">
                  {category.name} 
                  <span className="ml-2 badge badge-neutral">
                    {category.products.length} productos
                  </span>
                </div>
                <div className="text-xl">
                  {category.isOpen ? '−' : '+'}
                </div>
              </div>
              
              {category.isOpen && (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>SKU</th>
                        <th>Stock</th>
                        <th>Precio Costo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            {product.images?.[0] ? (
                              <div className="avatar">
                                <div className="w-12 h-12">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="object-cover rounded"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-400 text-xs">Sin imagen</span>
                              </div>
                            )}
                          </td>
                          <td className="font-medium">{product.name}</td>
                          <td>{product.sku}</td>
                          <td>
                            <span
                              className={`badge ${
                                product.stock > 10
                                  ? "badge-success"
                                  : product.stock > 0
                                  ? "badge-warning"
                                  : "badge-error"
                              }`}
                            >
                              {product.stock} en stock
                            </span>
                          </td>
                          <td>${product.cost_price?.toFixed(2) || '0.00'}</td>
                          <td>
                            <div className="flex gap-2">
                              <Link
                                href={`/dashboard/products/edit/${product.id}`}
                                className="btn btn-ghost btn-xs"
                              >
                                Editar
                              </Link>
                              <button
                                className="btn btn-ghost btn-xs text-error"
                                onClick={() => handleDelete(product.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
