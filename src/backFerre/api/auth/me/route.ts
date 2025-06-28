import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { handleApiError, successResponse } from '@/backFerre/lib/api-utils';

// Configuración para evitar el cacheo de esta ruta
export const dynamic = 'force-dynamic';

import { requireAuth } from '@/middleware/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Sólo usuario autenticado
  const user = await requireAuth(req);
  if (user instanceof Response) return user;
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Obtener la sesión actual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    // Obtener el perfil del usuario
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    // Obtener información adicional si es revendedor
    let resellerInfo = null;
    if (profile.role === 'reseller') {
      const { data } = await supabase
        .from('resellers')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (data) {
        resellerInfo = data;
      }
    }
    
    const user = {
      ...session.user,
      role: profile.role,
      user_metadata: {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      },
      reseller_info: resellerInfo,
    };
    
    return successResponse({ user });
    
  } catch (error) {
    return handleApiError(error);
  }
}

export { GET as default };
