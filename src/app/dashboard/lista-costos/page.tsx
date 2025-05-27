
'use client';

import { useState, useEffect, type FormEvent } from "react";
import { getAllProducts } from "@/data/mock-products";
import type { Product } from "@/lib/types";
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit3, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Get unique categories from products for the select dropdown
const productCategories = Array.from(new Set(getAllProducts().map(p => p.category))).sort();


export default function ListaCostosPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [form, setForm] = useState<{ name: string; price: string; category: string }>({ name: "", price: "", category: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize products from mock data
    // In a real app, this would be fetched from an API
    setProductos(getAllProducts());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, category: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast({ title: "Error", description: "Todos los campos son requeridos.", variant: "destructive" });
      return;
    }
    const priceAsNumber = parseFloat(form.price);
    if (isNaN(priceAsNumber) || priceAsNumber < 0) {
        toast({ title: "Error", description: "El precio debe ser un número válido.", variant: "destructive" });
        return;
    }


    if (editId) {
      setProductos(productos.map(p =>
        p.id === editId ? { ...p, name: form.name, price: priceAsNumber, category: form.category } : p
      ));
      toast({ title: "Éxito", description: "Producto actualizado." });
      setEditId(null);
    } else {
      const newId = productos.length ? (Math.max(...productos.map(p => Number(p.id))) + 1).toString() : "1";
      const newProduct: Product = {
        id: newId,
        name: form.name,
        price: priceAsNumber,
        category: form.category,
        description: `Descripción de ${form.name}`, // Default description
        images: [`https://placehold.co/600x400.png?text=${encodeURIComponent(form.name)}`], // Default image
        stock: 50, // Default stock
      };
      setProductos([...productos, newProduct]);
      toast({ title: "Éxito", description: "Producto agregado." });
    }
    setForm({ name: "", price: "", category: "" });
  };

  const handleEdit = (producto: Product) => {
    setForm({ name: producto.name, price: producto.price.toString(), category: producto.category });
    setEditId(producto.id);
  };

  const handleDelete = (id: string) => {
    setProductos(productos.filter(p => p.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm({ name: "", price: "", category: "" });
    }
    toast({ title: "Producto eliminado", description: "El producto ha sido eliminado de la lista (solo vista).", variant: "destructive" });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ name: "", price: "", category: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Costos Privados"
        description="Gestiona los costos internos de tus productos. Los cambios son solo visuales y no se guardan permanentemente."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{editId ? "Editar Producto" : "Agregar Nuevo Producto"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Nombre del producto</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Ej: Termo Stanley"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Precio costo ($)</Label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="Ej: 15000"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                 <Select name="category" value={form.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="" disabled>Seleccionar categoría</SelectItem>
                    {productCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button type="submit">
                {editId ? <Edit3 className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {editId ? "Guardar Cambios" : "Agregar Producto"}
              </Button>
              {editId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar Edición
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Listado de Productos y Costos</CardTitle>
          <CardDescription>Visualiza y administra los productos. Actualmente hay {productos.length} productos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Costo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>{producto.id}</TableCell>
                      <TableCell className="font-medium">{producto.name}</TableCell>
                      <TableCell className="text-right">${producto.price.toLocaleString("es-AR")}</TableCell>
                      <TableCell>{producto.category}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(producto)} className="mr-1">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(producto.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No hay productos para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
