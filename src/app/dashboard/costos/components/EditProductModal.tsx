import React, { useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  cost_price: number | null;
  stock: number;
  category: string | null;
  image_url: string | null;
}

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSaved: () => void;
  categories: string[];
}

function EditProductModal({
  product,
  onClose,
  onSaved,
  categories,
}: EditProductModalProps) {
  const [form, setForm] = useState({
    name: product.name,
    sku: product.sku || '',
    cost_price: product.cost_price ?? 0,
    stock: product.stock,
    category: product.category || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(product.image_url ?? null);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabaseClient = createClientComponentClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let newImageUrl = product.image_url;

      // si hay nuevo archivo seleccionado subir a Supabase Storage
      const file = fileRef.current?.files?.[0];
      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `products/${product.id}.${fileExt}`;
        const { error: uploadErr } = await supabaseClient.storage
          .from('product-images')
          .upload(filePath, file, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data } = supabaseClient.storage
          .from('product-images')
          .getPublicUrl(filePath);
        newImageUrl = data.publicUrl;
      }

      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabaseClient.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          cost_price: Number(form.cost_price),
          stock: Number(form.stock),
          category: form.category,
          image_url: newImageUrl,
        }),
      });
      if (!res.ok) throw new Error('Error al actualizar producto');
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-base-300/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">Editar Producto</h3>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div className="form-control">
              <label className="label text-sm font-semibold">Nombre</label>
              <input name="name" value={form.name} onChange={handleChange} className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label text-sm font-semibold">SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label text-sm font-semibold">Costo ($)</label>
              <input type="number" name="cost_price" value={form.cost_price} onChange={handleChange} className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label text-sm font-semibold">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label text-sm font-semibold">Categoría</label>
              <select name="category" value={form.category} onChange={handleChange} className="select select-bordered">
                <option value="">Sin categoría</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6 flex flex-col items-center">
            <div className="avatar">
              <div className="w-32 h-32 rounded-full bg-base-200 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base-content/50 text-center">Sin imagen</span>
                )}
              </div>
            </div>
            <div className="w-full">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileRef} 
                className="file-input file-input-bordered file-input-sm w-full" 
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) setPreviewUrl(URL.createObjectURL(f));
                }} 
              />
            </div>
          </div>

          {/* Errores y botones (toda la fila) */}
          {error && <p className="text-error md:col-span-2 text-center">{error}</p>}
          <div className="md:col-span-2 flex justify-end gap-4 mt-2">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
