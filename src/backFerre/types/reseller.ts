export type TaxRegime = 'monotributista' | 'responsable_inscripto' | 'no_inscripto';

export interface ResellerInfo {
  // Información personal
  first_name: string;
  last_name: string;
  
  // Información fiscal
  tax_id: string; // CUIT o DNI
  tax_id_type: 'cuit' | 'dni';
  tax_regime: TaxRegime;
  
  // Información de contacto
  phone: string;
  address: string;
  
  // Información adicional
  business_name?: string;
  business_address?: string;
  
  // Estado de verificación
  is_verified: boolean;
  verified_at?: string | null;
  
  // Fechas
  created_at: string;
  updated_at: string;
}

export interface CreateResellerDTO {
  // Información de autenticación
  email: string;
  password: string;
  
  // Información personal
  first_name: string;
  last_name: string;
  
  // Información fiscal
  tax_id: string;
  tax_id_type: 'cuit' | 'dni';
  tax_regime: TaxRegime;
  
  // Información de contacto
  phone: string;
  address: string;
  
  // Información opcional de negocio
  business_name?: string;
  business_address?: string;
}

export interface UpdateResellerDTO {
  first_name?: string;
  last_name?: string;
  tax_id?: string;
  tax_id_type?: 'cuit' | 'dni';
  tax_regime?: TaxRegime;
  phone?: string;
  address?: string;
  business_name?: string | null;
  business_address?: string | null;
  is_verified?: boolean;
  verified_at?: string | null;
}
