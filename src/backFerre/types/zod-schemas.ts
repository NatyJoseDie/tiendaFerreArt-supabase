import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().nullable().optional(),
  cost_price: z.number().nonnegative("El precio de costo no puede ser negativo").nullable().optional(),
  stock: z.number().int("El stock debe ser un número entero").nonnegative("El stock no puede ser negativo"),
  category: z.string().nullable().optional(),
  image_url: z.string().url("La URL de la imagen no es válida").nullable().optional(),
  sku: z.string().nullable().optional(),
});

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  role: z.enum(['admin', 'reseller', 'customer'])
});

export type ProductInput = z.infer<typeof ProductSchema>;
export type UserInput = z.infer<typeof UserSchema>;

export const OrderItemSchema = z.object({
  product_id: z.string(), // ID es ahora un UUID
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

export const OrderSchema = z.object({
  user_id: z.string().optional(), // Puede ser undefined si es consumidor final
  status: z.enum(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']).optional(),
  total: z.number().nonnegative(),
  payment_method: z.string().min(1),
  shipping_address: z.string().optional(),
  shipping_method: z.string().optional(),
  items: z.array(OrderItemSchema),
  nombre: z.string().min(1), // Para consumidor final
  email: z.string().email(),
  telefono: z.string().optional(),
  observaciones: z.string().optional(),
});

export type OrderInput = z.infer<typeof OrderSchema>;
