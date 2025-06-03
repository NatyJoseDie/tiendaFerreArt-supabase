
'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  stock: string;
  description: string;
  longDescription: string;
  imageFile: File | null;
  currentImageUrl: string;
  tags: string[];
  brand: string;
  sku: string;
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
        stock: productToEdit.stock.toString(),
        description: productToEdit.description,
        longDescription: productToEdit.longDescription || '',
        imageFile: null,
        currentImageUrl: productToEdit.images && productToEdit.images[0] ? productToEdit.images[0] : '',
        tags: productToEdit.tags || [],
        brand: productToEdit.brand || '',
        sku: productToEdit.sku || '',
      });
    } else {
      setFormState(null); // Reset form when no product is being edited or modal closes
    }
  }, [productToEdit, isOpen]); // Depend on isOpen to reset form when modal is closed

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formState) return;
    setFormState({ ...formState, [e.target.name]: e.target.value });
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
    setFormState({ ...formState, category: value });
  };
  
  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formState) return;
    setFormState({ ...formState, tags: e.target.value.split(',').map(tag => tag.trim()) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState || !productToEdit) {
      toast({ title: "Error", description: "No hay producto para editar.", variant: "destructive" });
      return;
    }

    if (!formState.name || !formState.price || !formState.category || formState.stock === "" || !formState.description) {
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
        const imageRef = ref(storage, `product_images/${Date.now()}_${formState.imageFile.name}`);
        await uploadBytes(imageRef, formState.imageFile);
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
    }

    const updatedProductData: Product = {
      ...productToEdit, // Preserve other original product fields not in the form explicitly
      id: formState.id,
      name: formState.name,
      price: priceAsNumber,
      category: formState.category,
      stock: stockAsNumber,
      description: formState.description,
      longDescription: formState.longDescription,
      images: imageUrl ? [imageUrl] : productToEdit.images, // Use new image if uploaded, else keep old
      tags: formState.tags,
      brand: formState.brand,
      sku: formState.sku,
      // featured, specifications, reviews would be preserved from productToEdit
    };

    onProductUpdate(updatedProductData);
    setIsSubmitting(false);
    onOpenChange(false); // Close the modal
  };

  if (!isOpen || !formState) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto: {productToEdit?.name}</DialogTitle>
          <DialogDescription>
            Realiza los cambios necesarios en la información del producto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Nombre del producto</Label>
              <Input id="edit-name" name="name" value={formState.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="edit-price">Precio costo ($)</Label>
              <Input id="edit-price" name="price" type="number" value={formState.price} onChange={handleInputChange} required min="0" step="0.01" />
            </div>
            <div>
              <Label htmlFor="edit-stock">Stock Disponible</Label>
              <Input id="edit-stock" name="stock" type="number" value={formState.stock} onChange={handleInputChange} required min="0" />
            </div>
            <div>
              <Label htmlFor="edit-category">Categoría</Label>
              <Select name="category" value={formState.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map(cat => (
                    <SelectItem key={`edit-cat-${cat}`} value={cat}>{cat}</SelectItem>
                  ))}
                  {formState.category && !productCategories.includes(formState.category) && (
                    <SelectItem value={formState.category} disabled>{formState.category} (Nueva)</SelectItem>
                  )}
                </SelectContent>
              </Select>
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
            <Label htmlFor="edit-description">Descripción Corta</Label>
            <Textarea id="edit-description" name="description" value={formState.description} onChange={handleInputChange} required rows={3} />
          </div>
          <div>
            <Label htmlFor="edit-longDescription">Descripción Larga</Label>
            <Textarea id="edit-longDescription" name="longDescription" value={formState.longDescription} onChange={handleInputChange} rows={5} />
          </div>
          <div>
            <Label htmlFor="edit-tags">Etiquetas (separadas por coma)</Label>
            <Input id="edit-tags" name="tags" value={formState.tags.join(', ')} onChange={handleTagsChange} placeholder="Ej: oferta, nuevo, electronica"/>
          </div>

          <div>
            <Label htmlFor="edit-imageFile">Imagen del Producto</Label>
            <Input id="edit-imageFile" type="file" name="imageFile" accept="image/*" onChange={handleFileChange} className="mb-2"/>
            {formState.imageFile && <p className="text-xs mt-1 text-muted-foreground">Nuevo archivo: {formState.imageFile.name}</p>}
            {formState.currentImageUrl && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Imagen actual:</p>
                <Image src={formState.currentImageUrl} alt="Imagen actual" width={80} height={80} className="rounded object-cover aspect-square" onError={(e) => e.currentTarget.style.display='none'}/>
                {!formState.imageFile && <p className="text-xs mt-1 text-muted-foreground">(Selecciona un nuevo archivo para reemplazarla)</p>}
              </div>
            )}
            {!formState.currentImageUrl && !formState.imageFile && (
                 <div className="w-20 h-20 bg-muted rounded flex items-center justify-center mt-2">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
            )}
          </div>

          <DialogFooter className="pt-4">
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
}

    