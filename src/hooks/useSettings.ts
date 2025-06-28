import { useState, useEffect, useCallback } from 'react';
import { getSetting, setSetting, SettingKey, SettingValueType } from '@/services/settings';

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
