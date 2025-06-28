import { NextRequest } from 'next/server';
import { authService } from '@/backFerre/services/auth-service';
import { handleApiError, successResponse } from '@/backFerre/lib/api-utils';

import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    import { z } from 'zod';
    const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(new Error(parsed.error.flatten().fieldErrors.email?.[0] || 'Datos inválidos'));
    }
    const { email, password } = parsed.data;
    
    const result = await authService.login(email, password);
    
    return successResponse({
      user: result.user,
      session: result.session
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

export { POST as default };
