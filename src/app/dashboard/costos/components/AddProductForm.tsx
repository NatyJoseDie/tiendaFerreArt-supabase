"use client";

import { useState } from 'react';

// Las categorías se pasarán como props desde la página principal
interface AddProductFormProps {
  categories: string[];
  onProductAdded: () => void; // Función para recargar la lista de productos
}

export default function AddProductForm({ categories, onProductAdded }: AddProductFormProps) {
  const [newProduct, setNewProduct] = useState({
    name: '',
    costPrice: '',
    stock: '',
    category: '',
    newCategory: '',
    isFeatured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setNewProduct(prev => ({ ...prev, [name]: checked }));
    } else {
        setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newProduct.category && !newProduct.newCategory) {
      setError('Debes seleccionar una categoría o crear una nueva.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      formData.append('name', newProduct.name);
      formData.append('costPrice', newProduct.costPrice);
      formData.append('stock', newProduct.stock);
      formData.append('category', newProduct.category);
      formData.append('newCategory', newProduct.newCategory);
      formData.append('isFeatured', String(newProduct.isFeatured));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar el producto');
      }

      alert('¡Producto agregado con éxito!');
      onProductAdded();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-8 rounded-2xl shadow-xl mb-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-2">Agregar Nuevo Producto</h2>
      <p className="mb-6 text-base-content/70">
        Gestiona los costos, stock, imágenes y si un producto es destacado. Los cambios aquí afectarán otras secciones.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Nombre del producto */}
          <div>
            <label htmlFor="name" className="label">
              <span className="label-text font-medium">Nombre del producto</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ej: Termo Stanley"
              className="input input-bordered w-full"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Precio costo */}
          <div>
            <label htmlFor="costPrice" className="label">
              <span className="label-text font-medium">Precio costo ($)</span>
            </label>
            <input
              type="number"
              id="costPrice"
              name="costPrice"
              placeholder="Ej: 15000"
              className="input input-bordered w-full"
              value={newProduct.costPrice}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Stock Disponible */}
          <div>
            <label htmlFor="stock" className="label">
              <span className="label-text font-medium">Stock Disponible</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              placeholder="5"
              className="input input-bordered w-full"
              value={newProduct.stock}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Imagen del Producto */}
          <div>
            <label htmlFor="image" className="label">
              <span className="label-text font-medium">Imagen del Producto</span>
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
            />
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="category" className="label">
              <span className="label-text font-medium">Categoría</span>
            </label>
            <select
              id="category"
              name="category"
              className="select select-bordered w-full"
              value={newProduct.category}
              onChange={handleInputChange}
              disabled={!!newProduct.newCategory}
              required={!newProduct.newCategory}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* O Crear Nueva Categoría */}
          <div>
            <label htmlFor="newCategory" className="label">
              <span className="label-text font-medium">O Crear Nueva Categoría</span>
            </label>
            <input
              type="text"
              id="newCategory"
              name="newCategory"
              placeholder="Ej: Electrónica Avanzada"
              className="input input-bordered w-full"
              value={newProduct.newCategory}
              onChange={handleInputChange}
              disabled={!!newProduct.category}
            />
          </div>
        </div>

        {/* Marcar como Producto Destacado */}
        <div className="form-control pt-2">
          <label className="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              className="checkbox checkbox-primary"
              checked={newProduct.isFeatured}
              onChange={handleInputChange}
            />
            <span className="label-text">Marcar como Producto Destacado</span>
          </label>
        </div>

        {/* Botón de Agregar */}
        <div className="pt-4">
          <button type="submit" className="btn btn-success btn-lg shadow-lg" disabled={isSubmitting}>
             {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
