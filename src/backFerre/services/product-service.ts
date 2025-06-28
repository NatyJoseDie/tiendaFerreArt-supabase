import { supabase } from '@/backFerre/config/supabase';
import { Product, CreateProductDTO, UpdateProductDTO } from '@/backFerre/types/product';

export class ProductService {
  private static instance: ProductService;
  private supabase = supabase;

  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getAllProducts({ offset = 0, limit = 50 }: { offset?: number; limit?: number }): Promise<Product[]> {
    const { data: products, error } = await this.supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error al obtener los productos');
    }

    return products || [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data: product, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }

    return product;
  }

  async createProductWithImage(productData: any, imageFile: File | null): Promise<Product> {
    let imageUrl = productData.image_url || null;

    if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
        const { data: uploadData, error: uploadError } = await this.supabase.storage
            .from('product-images') // Asegúrate que este bucket exista en Supabase
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error('Error al subir la imagen');
        }

        const { data: publicUrlData } = this.supabase.storage
            .from('product-images')
            .getPublicUrl(uploadData.path);

        imageUrl = publicUrlData.publicUrl;
    }

    const finalProductData: CreateProductDTO = {
        name: productData.name,
        description: '', // Valor por defecto
        cost_price: parseFloat(productData.costPrice),
        stock: parseInt(productData.stock, 10),
        category: productData.newCategory || productData.category,
        image_url: imageUrl,
        sku: null // Valor por defecto
    };

    return this.createProduct(finalProductData);
  }

  async createProduct(productData: CreateProductDTO): Promise<Product> {
    const { data: product, error } = await this.supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw new Error('Error al crear el producto');
    }

    return product;
  }

  async updateProduct(id: string, productData: UpdateProductDTO): Promise<Product> {
    const { data: product, error } = await this.supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating product ${id}:`, error);
      throw new Error('Error al actualizar el producto');
    }

    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product ${id}:`, error);
      return false;
    }

    return true;
  }

  async findBySku(sku: string): Promise<Product | null> {
    if (!sku) return null;
    const { data: product, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .single();

    if (error) {
      // Si no se encuentra (PGRST116), no es un error grave.
      if (error.code !== 'PGRST116') {
        console.error(`Error buscando producto por SKU ${sku}:`, error);
      }
      return null;
    }

    return product;
  }

  async getCostosPrivadosProducts({ offset = 0, limit = 150 }: { offset?: number; limit?: number }) {
    const { data, error } = await this.supabase
      .from("products")
      .select(
        `
          id,
          name,
          sku,
          cost_price,
          stock,
          category,
          image_url
        `
      )
      .range(offset, offset + limit - 1)
      .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching private cost products:', error);
        throw new Error('Error al obtener los productos de costos privados');
    }
    return data || [];
  }

  // Métodos adicionales según sea necesario
  async searchProducts(query: string): Promise<Product[]> {
    const { data: products, error } = await this.supabase
      .from('products')
      .select('*')
      .or(`nombre.ilike.%${query}%,codigo.ilike.%${query}%`);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return products || [];
  }
}

export const productService = ProductService.getInstance();
