
'use client';

import { useState, useEffect, type FormEvent, useMemo, Fragment, type ChangeEvent } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit3, PlusCircle, ListFilter, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';


const MASTER_PRODUCT_LIST_KEY = 'masterProductList';
const LOW_STOCK_THRESHOLD = 5;

interface FormState {
  name: string;
  price: string;
  category: string;
  stock: string;
  imageFile: File | null;
  currentImageUrl: string;
}

export default function ListaCostosPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>({ name: "", price: "", category: "", stock: "5", imageFile: null, currentImageUrl: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    // TEMPORARY CHANGE: Always load from getAllProducts() to bypass localStorage for verification
    const loadedProductsFromSource: Product[] = getAllProducts();
    
    // Attempt to load from localStorage for edits, but prioritize the source for initial state if it's a temporary verification phase.
    // For now, we are in verification phase, so `loadedProductsFromSource` is used.
    // If we were to revert, the logic would be:
    // const storedProducts = localStorage.getItem(MASTER_PRODUCT_LIST_KEY);
    // let loadedProducts: Product[];
    // if (storedProducts) {
    //   try {
    //     loadedProducts = JSON.parse(storedProducts);
    //   } catch (error) {
    //     console.error("Error parsing masterProductList from localStorage", error);
    //     loadedProducts = getAllProducts(); 
    //   }
    // } else {
    //   loadedProducts = getAllProducts();
    // }
    // setProductos(loadedProducts);

    setProductos(loadedProductsFromSource);
    const categories = Array.from(
      new Set(loadedProductsFromSource.map(p => p.category).filter(cat => cat && cat.trim() !== ""))
    ).sort();
    setProductCategories(categories);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
        // Still save to localStorage so new additions/edits persist IF we revert the temporary source loading
        localStorage.setItem(MASTER_PRODUCT_LIST_KEY, JSON.stringify(productos));
        const categories = Array.from(
          new Set(productos.map(p => p.category).filter(cat => cat && cat.trim() !== ""))
        ).sort();
        setProductCategories(categories);
    }
  }, [productos, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, imageFile: e.target.files[0] });
    } else {
      setForm({ ...form, imageFile: null });
    }
  };

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, category: value });
  };

  const resetForm = () => {
    setForm({ name: "", price: "", category: "", stock: "5", imageFile: null, currentImageUrl: '' });
    setEditId(null);
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
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
    
    setIsSubmitting(true);
    let imageUrl = form.currentImageUrl || (editId ? productos.find(p => p.id === editId)?.images[0] : '');
    
    if (form.imageFile) {
      const { id: uploadingToastId, dismiss: dismissUploadingToast } = toast({ 
        title: "Subiendo imagen...", 
        description: "Por favor espera.", 
        duration: Infinity // Prevent auto-dismiss
      });
      try {
        const imageRef = ref(storage, `product_images/${Date.now()}_${form.imageFile.name}`);
        await uploadBytes(imageRef, form.imageFile);
        imageUrl = await getDownloadURL(imageRef);
        dismissUploadingToast();
        toast({ title: "Imagen subida", description: "La imagen se ha subido correctamente." });
      } catch (error: any) {
        console.error("Error uploading image: ", error);
        dismissUploadingToast();
        toast({ 
          title: "Error de subida de imagen", 
          description: `No se pudo subir la imagen. ${error.message || 'Intenta de nuevo.'}`, 
          variant: "destructive" 
        });
        setIsSubmitting(false);
        return; 
      }
    } else if (!imageUrl && !editId) {
        imageUrl = `https://placehold.co/100x100.png?text=${encodeURIComponent(form.name)}`;
    }
    
    const productData = {
      name: form.name,
      price: priceAsNumber,
      category: form.category,
      stock: stockAsNumber,
      description: `Descripción de ${form.name}`,
      images: imageUrl ? [imageUrl] : (editId ? [] : [`https://placehold.co/100x100.png?text=${encodeURIComponent(form.name)}`]),
    };

    if (editId) {
      setProductos(productos.map(p =>
        p.id === editId ? { ...p, ...productData, images: productData.images.length > 0 ? productData.images : p.images } : p
      ));
      toast({ title: "Éxito", description: "Producto actualizado." });
    } else {
      const newId = productos.length ? (Math.max(...productos.map(p => parseInt(p.id || "0", 10))) + 1).toString() : "1";
      const newProduct: Product = {
        id: newId,
        ...productData,
        longDescription: productData.description,
        currency: '$',
        featured: false,
        sku: `SKU-${newId}`,
        brand: 'Marca Ejemplo',
        tags: [form.category.toLowerCase()]
      };
      setProductos(prev => [...prev, newProduct]);
      toast({ title: "Éxito", description: "Producto agregado." });
    }
    resetForm();
    setIsSubmitting(false);
  };

  const handleEdit = (producto: Product) => {
    setForm({ 
      name: producto.name, 
      price: producto.price.toString(), 
      category: producto.category, 
      stock: producto.stock.toString(),
      imageFile: null,
      currentImageUrl: producto.images && producto.images[0] ? producto.images[0] : ''
    });
    setEditId(producto.id);
    const formElement = document.getElementById('product-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteInitiation = (id: string) => {
    setProductToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDeleteId) {
      setProductos(prevProductos => prevProductos.filter(p => p.id !== productToDeleteId));
      toast({ title: "Producto eliminado", description: "El producto ha sido eliminado de la lista.", variant: "destructive" });
      if (editId === productToDeleteId) {
        resetForm();
      }
    }
    setProductToDeleteId(null);
    setIsDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setProductToDeleteId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "all") {
      return productos;
    }
    return productos.filter(p => p.category === categoryFilter);
  }, [productos, categoryFilter]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = product.category || "Sin Categoría";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [filteredProducts]);


  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lista de Costos Privados"
          description="Cargando productos y costos..."
        />
        <Card id="product-form-card"><CardContent className="p-6"><Skeleton className="h-96 bg-muted rounded-md"></Skeleton></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-96 bg-muted rounded-md"></Skeleton></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Costos Privados (Lista Madre)"
        description="Gestiona los costos, stock e imágenes de tus productos. Los cambios aquí afectarán otras secciones."
      />
      <Card id="product-form-card" className="shadow-lg">
        <CardHeader>
          <CardTitle>{editId ? "Editar Producto" : "Agregar Nuevo Producto"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <div>
                <Label htmlFor="name">Nombre del producto</Label>
                <Input id="name" type="text" name="name" placeholder="Ej: Termo Stanley" value={form.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="price">Precio costo ($)</Label>
                <Input id="price" type="number" name="price" placeholder="Ej: 15000" value={form.price} onChange={handleInputChange} required min="0" step="0.01" />
              </div>
              <div>
                <Label htmlFor="stock">Stock Disponible</Label>
                <Input id="stock" type="number" name="stock" placeholder="Ej: 10" value={form.stock} onChange={handleInputChange} required min="0" />
              </div>
              <div>
                <Label htmlFor="category-form-select">Categoría</Label>
                 <Select name="category" value={form.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger id="category-form-select">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.filter(cat => cat && cat.trim() !== "").map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                     {form.category && !productCategories.includes(form.category) && (
                        <SelectItem value={form.category} disabled>{form.category} (Nueva)</SelectItem>
                     )}
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="imageFile">Imagen del Producto</Label>
                <Input id="imageFile" type="file" name="imageFile" accept="image/*" onChange={handleFileChange} />
                {form.imageFile && <p className="text-xs mt-1 text-muted-foreground">Archivo seleccionado: {form.imageFile.name}</p>}
                {!form.imageFile && form.currentImageUrl && (
                     <p className="text-xs mt-1 text-muted-foreground">Imagen actual: <a href={form.currentImageUrl} target="_blank" rel="noopener noreferrer" className="underline">ver imagen</a> (selecciona un nuevo archivo para cambiarla)</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editId ? <Edit3 className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
                {isSubmitting ? (editId ? "Guardando..." : "Agregando...") : (editId ? "Guardar Cambios" : "Agregar Producto")}
              </Button>
              {editId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
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
                <SelectTrigger className="w-full sm:w-[200px]" id="category-filter-select">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  {productCategories.filter(cat => cat && cat.trim() !== "").map(cat => (
                    <SelectItem key={`filter-${cat}`} value={cat}>{cat}</SelectItem>
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
                  <TableHead className="w-[100px]">Imagen</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Costo</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(groupedProducts).length > 0 ? (
                  Object.entries(groupedProducts).map(([category, productsInCategory]) => (
                    <Fragment key={category}>
                      {(categoryFilter === "all" || categoryFilter === category) && productsInCategory.length > 0 && (
                         <TableRow className="bg-muted/50 hover:bg-muted/50 sticky top-0 z-10">
                           <TableCell colSpan={7} className="font-semibold text-primary text-lg py-3">
                             {category} ({productsInCategory.length})
                           </TableCell>
                         </TableRow>
                       )}
                      {productsInCategory.map((producto) => (
                        <TableRow 
                          key={producto.id}
                          className={cn(
                            !producto.stock || producto.stock === 0 ? "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40" : "",
                            producto.stock > 0 && producto.stock <= LOW_STOCK_THRESHOLD ? "bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/40" : ""
                          )}
                        >
                          <TableCell>{producto.id}</TableCell>
                          <TableCell>
                            {producto.images && producto.images[0] ? (
                              <Image src={producto.images[0]} alt={producto.name} width={40} height={40} className="rounded object-cover aspect-square" data-ai-hint={(producto.category || 'product').toLowerCase() + " " + producto.name.split(" ")[0].toLowerCase()} onError={(e) => e.currentTarget.src = 'https://placehold.co/40x40.png?text=Error'}/>
                            ) : (
                              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{producto.name}</TableCell>
                          <TableCell className="text-right">${producto.price.toLocaleString("es-AR", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                          <TableCell 
                            className={cn(
                              "text-right font-semibold",
                              !producto.stock || producto.stock === 0 ? "text-red-600 dark:text-red-400" : "",
                              producto.stock > 0 && producto.stock <= LOW_STOCK_THRESHOLD ? "text-yellow-700 dark:text-yellow-400" : ""
                            )}
                          >
                            {producto.stock || 0}
                            {(!producto.stock || producto.stock === 0) && <span className="block text-xs">(Sin Stock)</span>}
                            {(producto.stock > 0 && producto.stock <= LOW_STOCK_THRESHOLD) && <span className="block text-xs">(Bajo Stock)</span>}
                          </TableCell>
                          <TableCell>{producto.category}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(producto)} className="mr-1" disabled={isSubmitting}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteInitiation(producto.id)} className="text-destructive hover:text-destructive" disabled={isSubmitting}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      {categoryFilter !== "all" ? `No hay productos en la categoría "${categoryFilter}".` : "No hay productos para mostrar. Agrega algunos usando el formulario de arriba."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setProductToDeleteId(null); // Limpia el ID si el diálogo se cierra externamente
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar el producto "{productToDeleteId ? productos.find(p => p.id === productToDeleteId)?.name : ''}"?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Sí, eliminar producto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
    
    
