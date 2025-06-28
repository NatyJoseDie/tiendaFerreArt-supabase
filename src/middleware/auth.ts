import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Centraliza la conexión a Supabase (ajusta si tienes helper propio)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Middleware para verificar autenticación y rol
export async function requireAuth(
  req: NextRequest,
  allowedRoles: string[] = []
) {
  // 1. Extrae el token de sesión (cookie, header, etc.)
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  // 2. Valida el token con Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // 3. Si se piden roles específicos, verifica el rol
  if (allowedRoles.length > 0) {
    // El rol puede estar en user.user_metadata o en la tabla profiles
    const role = user.user_metadata?.role || user.user_metadata?.user_type;
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Forbidden: insufficient role' }, { status: 403 });
    }
  }

  // 4. Si todo OK, retorna el user para usar en el endpoint
  return user;
}

// Ejemplo de uso en un endpoint:
// import { requireAuth } from '@/middleware/auth';
//
// export async function GET(req: NextRequest) {
//   const user = await requireAuth(req, ['admin']);
//   if (user instanceof NextResponse) return user; // error
//   // ... lógica de endpoint
// }
