
'use client';

import { useState, useEffect, type FormEvent, useMemo, Fragment } from "react";
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
  TableCaption,
} from "@/components/ui/table";
import { Trash2, Edit3, PlusCircle, ListFilter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const MASTER_PRODUCT_LIST_KEY = 'masterProductList';
const LOW_STOCK_THRESHOLD = 5;

export default function ListaCostosPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [form, setForm] = useState<{ name: string; price: string; category: string; stock: string }>({ name: "", price: "", category: "", stock: "5" });
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const storedProducts = localStorage.getItem(MASTER_PRODUCT_LIST_KEY);
    let loadedProducts: Product[];
    if (storedProducts) {
      try {
        loadedProducts = JSON.parse(storedProducts);
      } catch (error) {
        console.error("Error parsing masterProductList from localStorage", error);
        loadedProducts = getAllProducts(); 
      }
    } else {
      loadedProducts = getAllProducts();
    }
    setProductos(loadedProducts);
    const categories = Array.from(
      new Set(loadedProducts.map(p => p.category).filter(cat => cat && cat.trim() !== ""))
    ).sort();
    setProductCategories(categories);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && productos.length > 0) {
        localStorage.setItem(MASTER_PRODUCT_LIST_KEY, JSON.stringify(productos));
        // Update categories if products change after initial load (e.g. new category added)
        const categories = Array.from(
          new Set(productos.map(p => p.category).filter(cat => cat && cat.trim() !== ""))
        ).sort();
        setProductCategories(categories);
    } else if (!isLoading && productos.length === 0) {
        localStorage.setItem(MASTER_PRODUCT_LIST_KEY, JSON.stringify([]));
        setProductCategories([]);
    }
  }, [productos, isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, category: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || form.stock === "") {
      toast({ title: "Error", description: "Todos los campos son requeridos, incluyendo el stock.", variant: "destructive" });
      return;
    }
    const priceAsNumber = parseFloat(form.price);
    const stockAsNumber = parseInt(form.stock, 10);

    if (isNaN(priceAsNumber) || priceAsNumber < 0) {
        toast({ title: "Error", description: "El precio debe ser un número válido.", variant: "destructive" });
        return;
    }
    if (isNaN(stockAsNumber) || stockAsNumber < 0) {
        toast({ title: "Error", description: "El stock debe ser un número entero no negativo.", variant: "destructive" });
        return;
    }

    if (editId) {
      setProductos(productos.map(p =>
        p.id === editId ? { ...p, name: form.name, price: priceAsNumber, category: form.category, stock: stockAsNumber } : p
      ));
      toast({ title: "Éxito", description: "Producto actualizado." });
      setEditId(null);
    } else {
      const newId = productos.length ? (Math.max(...productos.map(p => parseInt(p.id, 10))) + 1).toString() : "1";
      const newProduct: Product = {
        id: newId,
        name: form.name,
        price: priceAsNumber,
        category: form.category,
        stock: stockAsNumber,
        description: `Descripción de ${form.name}`, // Default description
        images: [`https://placehold.co/600x400.png?text=${encodeURIComponent(form.name)}`], // Default image
      };
      setProductos(prev => [...prev, newProduct]);
      toast({ title: "Éxito", description: "Producto agregado." });
    }
    setForm({ name: "", price: "", category: "", stock: "5" });
  };

  const handleEdit = (producto: Product) => {
    setForm({ name: producto.name, price: producto.price.toString(), category: producto.category, stock: producto.stock.toString() });
    setEditId(producto.id);
     // Scroll to form for better UX on mobile when editing
    const formElement = document.getElementById('product-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = (id: string) => {
    setProductos(productos.filter(p => p.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm({ name: "", price: "", category: "", stock: "5" });
    }
    toast({ title: "Producto eliminado", description: "El producto ha sido eliminado de la lista.", variant: "destructive" });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ name: "", price: "", category: "", stock: "5" });
  };

  const filteredAndGroupedProducts = useMemo(() => {
    let filtered = productos;
    if (categoryFilter !== "all") {
      filtered = productos.filter(p => p.category === categoryFilter);
    }

    if (categoryFilter === "all" || filtered.length > 0) {
      return filtered.reduce((acc, product) => {
        const category = product.category || "Sin Categoría";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, {} as Record<string, Product[]>);
    }
    return {};
  }, [productos, categoryFilter]);


  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lista de Costos Privados"
          description="Cargando productos y costos..."
        />
        <Card id="product-form-card"><CardContent className="p-6"><div className="animate-pulse h-64 bg-muted rounded-md"></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="animate-pulse h-96 bg-muted rounded-md"></div></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Costos Privados (Lista Madre)"
        description="Gestiona los costos y stock de tus productos. Los cambios aquí afectarán otras secciones."
      />
      <Card id="product-form-card" className="shadow-lg">
        <CardHeader>
          <CardTitle>{editId ? "Editar Producto" : "Agregar Nuevo Producto"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Label htmlFor="stock">Stock Disponible</Label>
                <Input
                  id="stock"
                  type="number"
                  name="stock"
                  placeholder="Ej: 10 (0 para sin stock)"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                 <Select name="category" value={form.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
            <CardDescription>Visualiza y administra los productos. Actualmente hay {productos.length} productos.</CardDescription>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ListFilter className="h-5 w-5 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  {productCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Costo</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(filteredAndGroupedProducts).length > 0 ? (
                  Object.entries(filteredAndGroupedProducts).map(([category, productsInCategory]) => (
                    <Fragment key={category}>
                      {categoryFilter === "all" && productsInCategory.length > 0 && ( // Show group header only if "All Categories" or if specific category matches
                         <TableRow className="bg-muted/50 hover:bg-muted/50">
                           <TableCell colSpan={6} className="font-semibold text-primary text-lg py-3">
                             {category}
                           </TableCell>
                         </TableRow>
                       )}
                       {categoryFilter !== "all" && productsInCategory.length > 0 && (
                         <TableRow className="bg-muted/50 hover:bg-muted/50">
                           <TableCell colSpan={6} className="font-semibold text-primary text-lg py-3">
                             {category}
                           </TableCell>
                         </TableRow>
                       )}
                      {productsInCategory.map((producto) => (
                        <TableRow 
                          key={producto.id}
                          className={cn(
                            producto.stock === 0 && "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40",
                            producto.stock > 0 && producto.stock <= LOW_STOCK_THRESHOLD && "bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/40"
                          )}
                        >
                          <TableCell>{producto.id}</TableCell>
                          <TableCell className="font-medium">{producto.name}</TableCell>
                          <TableCell className="text-right">${producto.price.toLocaleString("es-AR")}</TableCell>
                          <TableCell 
                            className={cn(
                              "text-right font-semibold",
                              producto.stock === 0 && "text-red-600 dark:text-red-400",
                              producto.stock > 0 && producto.stock <= LOW_STOCK_THRESHOLD && "text-yellow-700 dark:text-yellow-400"
                            )}
                          >
                            {producto.stock}
                            {producto.stock === 0 && " (Sin Stock)"}
                            {producto.stock > 0 && producto.stock <= LOW_STOCK_THRESHOLD && " (Bajo Stock)"}
                          </TableCell>
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
                      ))}
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      {categoryFilter !== "all" ? `No hay productos en la categoría "${categoryFilter}".` : "No hay productos para mostrar."}
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
