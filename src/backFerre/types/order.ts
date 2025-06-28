import { OrderItem } from './order-item';

export type OrderStatus = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  payment_method: string;
  shipping_address: string;
  shipping_method: string;
  created_at: string;
  updated_at: string;
  // Relaciones que se pueden incluir opcionalmente
  items?: OrderItem[];
}

export interface CreateOrderDTO {
  user_id: string;
  status?: OrderStatus;
  total: number;
  payment_method: string;
  shipping_address: string;
  shipping_method: string;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
}

export interface UpdateOrderDTO {
  status?: OrderStatus;
  shipping_address?: string;
  shipping_method?: string;
  updated_at?: string;
}
