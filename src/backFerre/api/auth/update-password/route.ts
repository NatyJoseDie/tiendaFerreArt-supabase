import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { handleApiError, successResponse } from '@/backFerre/lib/api-utils';

import { requireAuth } from '@/middleware/auth';

export async function POST(req: NextRequest) {
  // Sólo usuario autenticado
  const user = await requireAuth(req);
  if (user instanceof Response) return user;
  try {
    const { newPassword } = await request.json();
    
    if (!newPassword) {
      return handleApiError(new Error('La nueva contraseña es requerida'));
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      throw error;
    }
    
    return successResponse({
      message: 'Contraseña actualizada correctamente'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

export { POST as default };
