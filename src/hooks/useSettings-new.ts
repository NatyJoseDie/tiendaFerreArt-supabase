import { useState, useEffect, useCallback } from 'react';
import { getSetting, setSetting } from '@/services/settings';

// Definimos los tipos localmente para evitar problemas de importación
type SettingKey = 'home_slider' | 'contact_info' | 'social_links' | 'theme' | string;

type SettingValueType<T extends SettingKey> = 
  T extends 'home_slider' ? any[] :
  T extends 'contact_info' ? { phone: string; email: string; address: string } :
  T extends 'social_links' ? Record<string, string> :
  T extends 'theme' ? { primary_color: string; secondary_color: string; font_family: string; dark_mode: boolean } :
  any;

export function useSettings<T extends SettingKey>(
  key: T,
  defaultValue?: SettingValueType<T>
) {
  const [value, setValue] = useState<SettingValueType<T> | null>(defaultValue || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSetting = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSetting(key);
      setValue(data !== null ? data : defaultValue || null);
      return data;
    } catch (err) {
      console.error(`Error loading setting ${key}:`, err);
      setError(err instanceof Error ? err : new Error('Error al cargar la configuración'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  const updateSetting = useCallback(async (newValue: SettingValueType<T>) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await setSetting(key, newValue);
      setValue(newValue);
      return result;
    } catch (err) {
      console.error(`Error updating setting ${key}:`, err);
      setError(err instanceof Error ? err : new Error('Error al actualizar la configuración'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  useEffect(() => {
    loadSetting();
  }, [loadSetting]);

  return {
    value,
    isLoading,
    error,
    update: updateSetting,
    refresh: loadSetting,
  };
}
