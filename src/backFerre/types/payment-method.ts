export interface PaymentMethod {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentMethodDTO extends Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdatePaymentMethodDTO extends Partial<CreatePaymentMethodDTO> {
  updated_at?: string;
}
