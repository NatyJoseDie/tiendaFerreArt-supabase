import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type UserType = 'admin' | 'reseller' | 'customer';

export const getUserType = async (): Promise<UserType | null> => {
  const supabase = createClientComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return null;
  
  // Obtener el tipo de usuario de user_metadata
  const userType = session.user.user_metadata?.user_type as UserType;
  
  // Si no hay user_type en los metadatos, asumimos que es un cliente
  return userType || 'customer';
};

export const requireUserType = async (requiredType: UserType) => {
  const userType = await getUserType();
  
  if (!userType) {
    return { hasAccess: false, redirectTo: '/login?redirected=true' };
  }
  
  // Los administradores tienen acceso a todo
  if (userType === 'admin') {
    return { hasAccess: true };
  }
  
  // Los revendedores solo pueden acceder a sus propias rutas
  if (userType === 'reseller' && requiredType === 'reseller') {
    return { hasAccess: true };
  }
  
  // Por defecto, redirigir al dashboard correspondiente
  const redirectTo = userType === 'admin' ? '/admin' : 
                    userType === 'reseller' ? '/revendedor' : '/';
  
  return { 
    hasAccess: userType === requiredType, 
    redirectTo 
  };
};

// Middleware para proteger rutas del lado del servidor
export const withAuth = (requiredType: UserType) => {
  return async () => {
    const { hasAccess, redirectTo } = await requireUserType(requiredType);
    
    if (!hasAccess) {
      return {
        redirect: {
          destination: redirectTo || '/unauthorized',
          permanent: false,
        },
      };
    }
    
    return { props: {} };
  };
};
