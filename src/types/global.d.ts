// Tipos globales para la aplicación

// Módulos de configuración
declare module '@/services/settings' {
  import { SettingKey, SettingValueType } from '@/types/settings';
  
  export function getSetting<T extends SettingKey>(
    key: T
  ): Promise<SettingValueType<T> | null>;

  export function setSetting<T extends SettingKey>(
    key: T,
    value: SettingValueType<T>
  ): Promise<{ id: string; key: string; value: SettingValueType<T>; created_at: string; updated_at: string }>;
}

// Módulos de Node.js que pueden faltar en el cliente
declare module 'fs' {
  export = {};
}

declare module 'net' {
  export = {};
}

declare module 'tls' {
  export = {};
}

declare module 'dns' {
  export = {};
}

declare module 'child_process' {
  export = {};
}

declare module 'dgram' {
  export = {};
}

declare module 'module' {
  export = {};
}

declare module 'request' {
  export = {};
}

declare module 'readline' {
  export = {};
}

// Tipos para las variables de entorno
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SETUP_TOKEN: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
