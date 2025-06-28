export interface Product {
  id: string; // Es UUID en la base de datos
  name: string;
  description: string | null;
  cost_price: number | null;
  stock: number;
  category: string | null;
  image_url: string | null;
  created_at: string;
  sku: string | null;
}

// El DTO para crear un producto omite los campos generados por la BD
export interface CreateProductDTO extends Omit<Product, 'id' | 'created_at'> {}

// El DTO para actualizar es un parcial del de creación
export interface UpdateProductDTO extends Partial<CreateProductDTO> {}
