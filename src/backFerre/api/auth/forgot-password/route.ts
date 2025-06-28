import { NextRequest } from 'next/server';
import { authService } from '@/backFerre/services/auth-service';
import { handleApiError, successResponse } from '@/backFerre/lib/api-utils';

import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    import { z } from 'zod';
    const EmailSchema = z.object({ email: z.string().email() });
    const parsed = EmailSchema.safeParse({ email });
    if (!parsed.success) {
      return handleApiError(new Error(parsed.error.flatten().fieldErrors.email?.[0] || 'Email inválido'));
    }
    
    await authService.resetPassword(email);
    
    return successResponse({
      message: 'Se ha enviado un correo con las instrucciones para restablecer la contraseña'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

export { POST as default };
