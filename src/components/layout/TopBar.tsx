
'use client';
import Link from 'next/link';
import { Phone, Mail, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserFromLocalStorage, type User } from '@/lib/authUtils';


export function TopBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Indicate component has mounted and can access localStorage
    setUser(getUserFromLocalStorage());
  }, [pathname]); // Re-check user on path change for dynamic display

  const showLoginLink = !user && pathname !== '/login' && !pathname.startsWith('/dashboard');

  return (
    <div className="bg-muted/50 text-sm text-foreground"> {/* Changed text-muted-foreground to text-foreground */}
      <div className="container mx-auto flex h-10 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Phone className="mr-1 h-4 w-4" /> 1125486394
          </span>
          <span className="flex items-center">
            <Mail className="mr-1 h-4 w-4" /> abmayorista@gmail.com
          </span>
        </div>
        {isClient && showLoginLink && (
           <Link href="/login" className="hover:text-primary transition-colors flex items-center">
            <LogIn className="mr-1 h-4 w-4" />
            Iniciar sesión
          </Link>
        )}
         {isClient && user && (pathname.startsWith('/') && !pathname.startsWith('/dashboard')) && (
            <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center text-xs">
                Panel de {user.userType === 'vendedora' ? 'Vendedora' : 'Comercio'}
            </Link>
        )}
      </div>
    </div>
  );
}
