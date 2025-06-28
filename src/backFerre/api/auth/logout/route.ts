import { NextResponse } from 'next/server';
import { authService } from '@/backFerre/services/auth-service';
import { handleApiError, successResponse } from '@/backFerre/lib/api-utils';

import { requireAuth } from '@/middleware/auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  // Sólo usuario autenticado
  const user = await requireAuth(req);
  if (user instanceof Response) return user;
  try {
    await authService.logout();
    return successResponse({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    return handleApiError(error);
  }
}

export { POST as default };
