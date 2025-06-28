import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AppSetting, SettingKey, SettingValueType } from '@/types/settings';

export type { SettingKey, SettingValueType };

const supabase = createClientComponentClient();

export async function getSetting<T extends SettingKey>(
  key: T
): Promise<SettingValueType<T> | null> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data?.value as SettingValueType<T>;
  } catch (error) {
    console.error(`Error al obtener la configuración ${key}:`, error);
    throw error;
  }
}

export async function setSetting<T extends SettingKey>(
  key: T,
  value: SettingValueType<T>
): Promise<AppSetting<SettingValueType<T>>> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .upsert({ key, value }, { onConflict: 'key' })
      .select()
      .single();

    if (error) throw error;
    return data as AppSetting<SettingValueType<T>>;
  } catch (error) {
    console.error(`Error al actualizar la configuración ${key}:`, error);
    throw error;
  }
}
