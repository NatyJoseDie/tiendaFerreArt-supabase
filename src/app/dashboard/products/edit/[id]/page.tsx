"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function EditProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState({ name: "", description: "", cost_price: "", stock: "", category: "", sku: "" });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        const product = data.find((p: any) => p.id === id);
        if (!product) {
          setError("Producto no encontrado");
          return;
        }
        setForm({ name: product.name || "", description: product.description || "", cost_price: product.cost_price?.toString() || "", stock: product.stock?.toString() || "", category: product.category || "", sku: product.sku || "" });
        setExistingImages(product.images || []);
        setPreviews(product.images || []);
      } catch { setError("Error al cargar producto");
      } finally { setLoadingForm(false); }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previews.length > 5) {
      setError("Puedes tener un máximo de 5 imágenes.");
      return;
    }
    setNewImages([...newImages, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    }
    setPreviews(previews.filter((_, i) => i !== index));
    if (!isExisting) {
        const newImageIndex = index - existingImages.length;
        setNewImages(newImages.filter((_,i) => i !== newImageIndex));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("existing_images_urls", existingImages.join(','));
      newImages.forEach(img => formData.append("images", img));
      
      const token = localStorage.getItem("supabase_token") || "";
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Error al editar producto");
      }
      setSuccess("Producto actualizado exitosamente");
      setTimeout(() => router.push("/dashboard/products"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingForm(false);
    }
  };

  if (loading || loadingForm) return <div className="p-8">Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Editar Producto</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form inputs */}
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="w-full border rounded p-2" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="w-full border rounded p-2" required />
        <input name="cost_price" type="number" value={form.cost_price} onChange={handleChange} placeholder="Precio de costo" className="w-full border rounded p-2" required />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className="w-full border rounded p-2" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Categoría" className="w-full border rounded p-2" required />
        <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="w-full border rounded p-2" required />
        
        <div>
          <label className="block mb-1">Imágenes (hasta 5):</label>
          <input type="file" accept="image/*" onChange={handleNewImage} multiple disabled={previews.length >= 5} className="mb-2" />
          <div className="mt-2 grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt={`preview ${i}`} className="w-full h-24 object-cover rounded" />
                <button type="button" onClick={() => removeImage(i, i < existingImages.length)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">X</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loadingForm}>
          {loadingForm ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
