import { Product } from './product';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  // Relaciones que se pueden incluir opcionalmente
  product?: Product;
}

export interface CreateOrderItemDTO {
  order_id: string;
  product_id: number;
  quantity: number;
  price: number;
}

export interface UpdateOrderItemDTO {
  quantity?: number;
  price?: number;
}
