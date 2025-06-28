import { supabase } from '@/backFerre/config/supabase';
import { UserInput } from '../types/zod-schemas';

export const userService = {
  async getAllUsers() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    return data;
  },
  async createUser(user: UserInput) {
    // Aquí podrías usar Supabase Auth API para registrar usuario y luego insertar en profiles
    const { data, error } = await supabase.from('profiles').insert([user]).select().single();
    if (error) throw error;
    return data;
  },
  async updateUser(id: string, user: Partial<UserInput>) {
    const { data, error } = await supabase.from('profiles').update(user).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async deleteUser(id: string) {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};
