
'use client';
import Link from 'next/link';
import { Phone, Mail, LogIn, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserFromLocalStorage, type User } from '@/lib/authUtils';


export function TopBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
    setUser(getUserFromLocalStorage());
  }, [pathname]); 

  // This component is now effectively unused due to the layout change,
  // but keeping the logic here for reference or if reinstated.
  // The logic for showing login/dashboard links has been moved to Header.tsx

  // If you intend to completely remove this, you can delete the file.
  // For now, let's return null so it renders nothing if accidentally imported.
  return null;

  /*
  // Original logic (now mostly in Header.tsx)
  const showLoginLink = !user && pathname !== '/login' && !pathname.startsWith('/dashboard');
  const showDashboardLink = user && !pathname.startsWith('/dashboard');


  return (
    <div className="bg-foreground text-sm text-background">
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
         {isClient && showDashboardLink && (
            <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center text-xs">
                <LayoutDashboard className="mr-1 h-4 w-4" />
                Panel de {user.userType === 'vendedora' ? 'Vendedora' : 'Comercio'}
            </Link>
        )}
      </div>
    </div>
  );
  */
}
