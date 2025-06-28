import { supabase } from '@/backFerre/config/supabase';
import { CreateOrderDTO, UpdateOrderDTO } from '@/backFerre/types/order';

export class OrderService {
  private static instance: OrderService;
  private constructor() {}
  static getInstance() {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async createOrder(order: CreateOrderDTO) {
    const { data, error } = await supabase.from('orders').insert([order]).select().single();
    if (error) throw error;
    return data;
  }

  async getOrders() {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) throw error;
    return data;
  }

  async getOrderById(id: string) {
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateOrder(id: string, update: UpdateOrderDTO) {
    const { data, error } = await supabase.from('orders').update(update).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteOrder(id: string) {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

export const orderService = OrderService.getInstance();
