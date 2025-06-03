
'use client';

import Link from 'next/link';
import { Heart, Search, ShoppingCart, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { getUserFromLocalStorage, type User } from '@/lib/authUtils';
import { usePathname } from 'next/navigation';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    setUser(getUserFromLocalStorage());
  }, [pathname]); // Re-check user status on route change

  const mainNavLinks = [
    { href: '/', label: 'INICIO' },
    { href: '/how-to-buy', label: 'CÓMO COMPRAR' },
    { href: '/products', label: 'PRODUCTOS' },
    // { href: '/wholesale-register', label: 'REGISTRO MAYORISTA' }, // Removed
    // { href: '/retail-store', label: 'TIENDA MINORISTA' }, // Removed
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-1.5">
          <Heart className="h-9 w-9 text-primary fill-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-3xl text-primary leading-none">AB</span>
            <span className="text-[0.6rem] text-muted-foreground tracking-wider leading-none mt-0.5">MAYORISTA</span>
          </div>
        </Link>
        <nav className="flex flex-1 items-center space-x-3 lg:space-x-4">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {/* Conditional Login/Register Links */}
          {isClient && !user && pathname !== '/login' && !pathname.startsWith('/dashboard') && (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-foreground transition-colors hover:text-primary flex items-center"
              >
                <LogIn className="mr-1 h-4 w-4" />
                INICIAR SESIÓN
              </Link>
              <span className="text-xs text-muted-foreground mx-1 hidden sm:inline">/</span>
              <Link
                href="/wholesale-register"
                className="text-xs font-medium text-foreground transition-colors hover:text-primary flex items-center"
              >
                <UserPlus className="mr-1 h-4 w-4" />
                REGISTRARSE
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center w-40 md:w-48"> {/* Adjusted width for smaller screens */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar"
              className="pl-10 pr-3 py-2 text-sm rounded-full border h-9"
            />
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative h-9 w-9">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[0.6rem] rounded-full px-1 leading-tight">
                0
              </span>
            </Button>
            <span className="text-xs text-foreground hidden sm:inline">$0.00</span>
          </div>
        </div>
      </div>
    </header>
  );
}
