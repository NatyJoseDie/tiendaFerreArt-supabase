import { NextRequest } from 'next/server';
import { authService } from '@/backFerre/services/auth-service';
import { CreateResellerDTO } from '@/backFerre/types/reseller';
import { handleApiError, successResponse } from '@/backFerre/lib/api-utils';

import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const data: CreateResellerDTO = await request.json();
    
    import { z } from 'zod';
    const RegisterSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
    const parsed = RegisterSchema.safeParse(data);
    if (!parsed.success) {
      return handleApiError(new Error(parsed.error.flatten().fieldErrors.email?.[0] || 'Datos inválidos'));
    }
    
    // Registrar el revendedor
    const result = await authService.registerReseller(data);
    
    // No devolver la contraseña en la respuesta
    const { password, ...userWithoutPassword } = data;
    
    return successResponse({
      user: userWithoutPassword,
      session: result.session
    }, 201);
    
  } catch (error) {
    return handleApiError(error);
  }
}

export { POST as default };
