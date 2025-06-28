"use client";

import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import AddProductForm from './components/AddProductForm';
import ProductActionsBar from './components/ProductActionsBar';
import EditProductModal from './components/EditProductModal';

// Interfaz de producto alineada con el backend
interface Product {
  id: string;
  name: string;
  sku: string | null;
  cost_price: number | null;
  stock: number;
  category: string | null;
  image_url: string | null;
  destacado?: boolean; // Campo solo para UI
}

interface CategoryGroup {
  name: string;
  products: Product[];
}

export default function CostosPage() {
  const reloadPage = () => window.location.reload();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError('');
        const response = await fetch('/api/products?modo=costosPrivados&limit=150');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: La respuesta de la API no fue exitosa`);
        }
        const productsData: Product[] = await response.json();

        if (!Array.isArray(productsData)) {
          throw new Error('La respuesta de la API no es un array de productos');
        }

        setAllProducts(productsData);

        // Agrupar por categoría real (aunque esté vacía, mostrar el string)
        const grouped = productsData.reduce<Record<string, Product[]>>((acc, product) => {
          let categoryName = typeof product.category === 'string' && product.category.trim() !== '' ? product.category : 'Sin categoría';
          if (!acc[categoryName]) acc[categoryName] = [];
          acc[categoryName].push(product);
          return acc;
        }, {});

        const categoriesArray = Object.keys(grouped).map(name => ({
          name,
          products: grouped[name],
        }));

        setCategories(categoriesArray);
      } catch (err: any) {
        setError(err.message);
        setCategories([]);
      } finally {
        setLoadingData(false);
      }
    };

    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        fetchProducts();
      }
    }
  }, [user, authLoading, router]);

  const handleProductAdded = () => {
    window.location.reload();
  };

  if (authLoading || loadingData) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="p-4 sm:p-8 bg-base-200/50 min-h-screen">
      <h1 className="text-3xl font-bold text-base-content mb-4">Costos y Stock</h1>

      {/* Barra de acciones: importar / exportar */}
      <ProductActionsBar refreshAction={reloadPage} products={allProducts} />

      {/* FORMULARIO DE AGREGAR PRODUCTO */}
      <div className="max-w-4xl mx-auto mb-12">
        <AddProductForm categories={categories.map(c => c.name)} onProductAdded={handleProductAdded} />
      </div>

      <div className="divider my-12 text-xl font-bold">Listado de Productos y Costos</div>

      {error && <div className="alert alert-error shadow-lg mb-4">{error}</div>}

      {categories.length === 0 && !error ? (
        <div className="alert alert-info">No hay productos para mostrar.</div>
      ) : (
        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category.name} className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 rounded-2xl shadow-xl border border-blue-100">
              <div className="flex items-center bg-gradient-to-r from-blue-200 via-purple-100 to-green-100 rounded-t-2xl px-8 py-4 border-b border-blue-100">
                <span className="text-xl font-extrabold text-blue-700 tracking-wide uppercase drop-shadow">{category.name}</span>
                <span className="ml-4 badge badge-lg bg-emerald-400 text-white font-mono shadow">{category.products.length} prod.</span>
              </div>
              <div className="overflow-x-auto rounded-b-2xl">
                <table className="table w-full text-base">
                  <thead>
                    <tr className="bg-blue-50 text-gray-800">
                      <th className="w-24 font-semibold">Imagen</th>
                      <th className="font-semibold">Nombre</th>
                      <th className="font-semibold">SKU</th>
                      <th className="font-semibold">Costo</th>
                      <th className="font-semibold">Stock</th>
                      <th className="font-semibold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.products.map((product, idx) => (
                      <tr key={product.id} className={`transition-all ${idx % 2 === 0 ? 'bg-white/80' : 'bg-blue-50/60'} hover:bg-emerald-50 border-b border-blue-100`}>
                        <td>
                          <div className="avatar">
                            <div className="w-14 h-14 rounded-xl shadow border border-blue-100 bg-white flex items-center justify-center">
                              <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} className="object-cover w-full h-full" />
                            </div>
                          </div>
                        </td>
                        <td className="font-semibold text-gray-800 max-w-xs truncate" title={product.name}>{product.name || <span className='text-gray-400 italic'>Sin nombre</span>}</td>
                        <td className="font-mono text-base text-gray-600">{product.sku || <span className='text-gray-400'>—</span>}</td>
                        <td className={product.cost_price ? "font-mono text-base text-emerald-700" : "font-mono text-base text-gray-400 italic"}>
                          {product.cost_price ? `$${product.cost_price.toLocaleString('es-AR', {minimumFractionDigits:2})}` : "N/A"}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-base ${product.stock <= 5 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{product.stock}</span>
                            {product.stock <= 5 && (
                              <span className="badge badge-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-bold animate-pulse shadow">Stock Crítico</span>
                            )}
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="flex gap-2 justify-center">
                            <button className="btn btn-circle btn-outline btn-info btn-sm shadow hover:bg-info hover:text-white border-info" title="Editar" onClick={() => setEditingProduct(product)}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z" /></svg>
                            </button>
                            <button className="btn btn-circle btn-outline btn-error btn-sm shadow hover:bg-error hover:text-white border-error" title="Eliminar">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories.map(c=>c.name)}
          onClose={() => setEditingProduct(null)}
          onSaved={() => reloadPage()}
        />
      )}
    </div>
  );
}
