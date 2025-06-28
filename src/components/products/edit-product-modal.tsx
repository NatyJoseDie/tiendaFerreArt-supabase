
'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Loader2, Edit3, ImageIcon } from 'lucide-react';

interface EditProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit: Product | null;
  onProductUpdate: (updatedProduct: Product) => void;
  productCategories: string[];
}

interface EditFormState {
  id: string;
  name: string;
  price: string;
  category: string;
  newCategoryName: string; // Nuevo campo
  stock: string;
  description: string;
  longDescription: string;
  imageFile: File | null;
  currentImageUrl: string;
  tags: string[];
  brand: string;
  sku: string;
  featured: boolean;
}

export function EditProductModal({
  isOpen,
  onOpenChange,
  productToEdit,
  onProductUpdate,
  productCategories,
}: EditProductModalProps) {
  const [formState, setFormState] = useState<EditFormState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (productToEdit) {
      setFormState({
        id: productToEdit.id,
        name: productToEdit.name,
        price: productToEdit.price.toString(),
        category: productToEdit.category,
        newCategoryName: "", // Inicializar vacío
        stock: productToEdit.stock.toString(),
        description: productToEdit.description,
        longDescription: productToEdit.longDescription || '',
        imageFile: null,
        currentImageUrl: productToEdit.images && productToEdit.images[0] ? productToEdit.images[0] : '',
        tags: productToEdit.tags || [],
        brand: productToEdit.brand || '',
        sku: productToEdit.sku || '',
        featured: productToEdit.featured || false,
      });
    } else {
      setFormState(null);
    }
  }, [productToEdit, isOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formState) return;
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formState) return;
    if (e.target.files && e.target.files[0]) {
      setFormState({ ...formState, imageFile: e.target.files[0] });
    } else {
      setFormState({ ...formState, imageFile: null });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (!formState) return;
    // Si se selecciona una categoría del dropdown, limpiar el campo de nueva categoría
    setFormState({ ...formState, category: value, newCategoryName: "" });
  };
  
  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formState) return;
    setFormState({ ...formState, tags: e.target.value.split(',').map((tag: string) => tag.trim()) });
  };

  const handleFeaturedChange = (checked: boolean) => {
    if (!formState) return;
    setFormState({ ...formState, featured: checked });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState || !productToEdit) {
      toast({ title: "Error", description: "No hay producto para editar.", variant: "destructive" });
      return;
    }

    let categoryToSave = formState.category;
    if (formState.newCategoryName && formState.newCategoryName.trim() !== "") {
      categoryToSave = formState.newCategoryName.trim();
    }

    if (!formState.name || !formState.price || !categoryToSave || formState.stock === "" || !formState.description) {
      toast({ title: "Error", description: "Nombre, precio, categoría, stock y descripción son requeridos.", variant: "destructive" });
      return;
    }
    const priceAsNumber = parseFloat(formState.price);
    const stockAsNumber = parseInt(formState.stock, 10);

    if (isNaN(priceAsNumber) || priceAsNumber < 0) {
      toast({ title: "Error", description: "El precio debe ser un número válido.", variant: "destructive" });
      return;
    }
    if (isNaN(stockAsNumber) || stockAsNumber < 0) {
      toast({ title: "Error", description: "El stock debe ser un número entero no negativo.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    let imageUrl = formState.currentImageUrl;

    if (formState.imageFile) {
      const { id: uploadingToastId, dismiss: dismissUploadingToast } = toast({
        title: "Subiendo imagen...",
        description: "Por favor espera.",
        duration: Infinity
      });
      try {
        // Código para subir la imagen a Supabase
        const fileName = `product_images/${Date.now()}_${formState.imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images') // Usando el nombre del bucket que me proporcionaste
          .upload(fileName, formState.imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicURLData } = supabase.storage
          .from('product-images') // Usando el nombre del bucket que me proporcionaste
          .getPublicUrl(fileName);
        
        imageUrl = publicURLData.publicUrl;


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
    }

    const updatedProductData: Product = {
      ...productToEdit,
      id: formState.id,
      name: formState.name,
      price: priceAsNumber,
      category: categoryToSave,
      stock: stockAsNumber,
      description: formState.description,
      longDescription: formState.longDescription,
      images: imageUrl ? [imageUrl] : productToEdit.images, // Mantener imagen anterior si no se sube nueva
      tags: formState.tags,
      brand: formState.brand,
      sku: formState.sku,
      featured: formState.featured,
    };

    onProductUpdate(updatedProductData);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  // ...código existente arriba...
  if (!isOpen || !formState) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-200 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Editar Producto
          </DialogTitle>
          <DialogDescription className="text-center mb-4">
            Realizá los cambios necesarios en la información del producto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Nombre</Label>
              <Input id="edit-name" name="name" value={formState.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="edit-price">Costo ($)</Label>
              <Input id="edit-price" name="price" type="number" value={formState.price} onChange={handleInputChange} required min="0" step="0.01" />
            </div>
            <div>
              <Label htmlFor="edit-stock">Stock</Label>
              <Input id="edit-stock" name="stock" type="number" value={formState.stock} onChange={handleInputChange} required min="0" />
            </div>
            <div>
              <Label htmlFor="edit-category-select">Categoría</Label>
              <Select name="category" value={formState.category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="edit-category-select">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map(cat => (
                    <SelectItem key={`edit-cat-${cat}`} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-newCategoryName">Nueva Categoría</Label>
              <Input 
                id="edit-newCategoryName" 
                name="newCategoryName" 
                placeholder="Ej: Electrónica Novedosa" 
                value={formState.newCategoryName} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <Label htmlFor="edit-brand">Marca</Label>
              <Input id="edit-brand" name="brand" value={formState.brand} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="edit-sku">SKU</Label>
              <Input id="edit-sku" name="sku" value={formState.sku} onChange={handleInputChange} />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-description">Descripción corta</Label>
            <Textarea id="edit-description" name="description" value={formState.description} onChange={handleInputChange} required rows={2} />
          </div>
          <div>
            <Label htmlFor="edit-longDescription">Descripción larga</Label>
            <Textarea id="edit-longDescription" name="longDescription" value={formState.longDescription} onChange={handleInputChange} rows={3} />
          </div>
          <div>
            <Label htmlFor="edit-tags">Etiquetas (separadas por coma)</Label>
            <Input id="edit-tags" name="tags" value={formState.tags.join(', ')} onChange={handleTagsChange} placeholder="Ej: oferta, nuevo, electronica"/>
          </div>

          <div className="flex items-center space-x-3 mt-2">
            <Checkbox
                id="edit-featured"
                checked={formState.featured}
                onCheckedChange={(checked) => handleFeaturedChange(checked as boolean)}
            />
            <Label htmlFor="edit-featured" className="cursor-pointer text-sm font-medium">
                Producto destacado
            </Label>
          </div>

          <div>
            <Label htmlFor="edit-imageFile">Imagen del producto</Label>
            <Input id="edit-imageFile" type="file" name="imageFile" accept="image/*" onChange={handleFileChange} className="mb-2"/>
            {formState.imageFile && <p className="text-xs mt-1 text-blue-600">Nuevo archivo: {formState.imageFile.name}</p>}
            {formState.currentImageUrl && (
              <div className="mt-2 flex flex-col items-center">
                <Image src={formState.currentImageUrl} alt="Imagen actual" width={90} height={90} className="rounded-full object-cover border shadow aspect-square" onError={(e) => e.currentTarget.style.display='none'}/>
                {!formState.imageFile && <p className="text-xs mt-1 text-gray-400">(Seleccioná un nuevo archivo para reemplazarla)</p>}
              </div>
            )}
            {!formState.currentImageUrl && !formState.imageFile && (
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mt-2 border">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                </div>
            )}
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit3 className="mr-2 h-4 w-4" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
// ...código existente abajo...
}

