export interface AppSetting<T = any> {
  id: string;
  key: string;
  value: T;
  created_at: string;
  updated_at: string;
}

export interface Slide {
  image_url: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  is_active: boolean;
  order?: number;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  business_hours: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
}

export interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  font_family: string;
  dark_mode: boolean;
}

export type SettingKey = 
  | 'home_slider'
  | 'contact_info'
  | 'social_links'
  | 'theme'
  | string;

export type SettingValueType<T extends SettingKey> = 
  T extends 'home_slider' ? Slide[] :
  T extends 'contact_info' ? ContactInfo :
  T extends 'social_links' ? SocialLinks :
  T extends 'theme' ? ThemeSettings :
  any;
