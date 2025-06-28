export interface ShippingMethod {
  id: number;
  name: string;
  price: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateShippingMethodDTO extends Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateShippingMethodDTO extends Partial<CreateShippingMethodDTO> {
  updated_at?: string;
}
