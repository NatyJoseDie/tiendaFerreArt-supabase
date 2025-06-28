export const env = {
  SUPABASE_URL: mustGetEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: mustGetEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  // Agregá más si necesitás
};

function mustGetEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ FALTA variable de entorno: ${key}`);
  }
  return value;
}
