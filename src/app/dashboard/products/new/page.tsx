"use client";
import { useState } from "react";
import axios from "axios";

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    cost_price: "",
    stock: "",
    category: "",
    sku: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError("Puedes subir un máximo de 5 imágenes.");
      return;
    }
    setImages([...images, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach(img => formData.append("images", img));
      
      const token = localStorage.getItem("supabase_token") || "";
      const res = await axios.post("/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess("Producto creado exitosamente");
      setForm({ name: "", description: "", cost_price: "", stock: "", category: "", sku: "" });
      setImages([]);
      setPreviews([]);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full border rounded p-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full border rounded p-2"
          required
        />
        <input
          name="cost_price"
          type="number"
          value={form.cost_price}
          onChange={handleChange}
          placeholder="Precio de costo"
          className="w-full border rounded p-2"
          required
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border rounded p-2"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Categoría"
          className="w-full border rounded p-2"
          required
        />
        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
          className="w-full border rounded p-2"
          required
        />
        <div>
          <label className="block mb-1">Imágenes (hasta 5):</label>
          <input type="file" accept="image/*" onChange={handleImage} multiple disabled={images.length >= 5} />
          <div className="mt-2 flex flex-wrap gap-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt={`preview ${i}`} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Crear producto"}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>
    </div>
  );
}
