
'use client';

import Link from 'next/link';
import { Heart, Search, ShoppingCart, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/authUtils';
import { getUserFromLocalStorage } from '@/lib/authUtils';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const { getItemCount, getCartTotal, toggleCart } = useCart(); 

  const itemCount = getItemCount();
  const cartTotal = getCartTotal();

  console.log("Header: Rendering. Item count:", itemCount, "Cart total:", cartTotal, "Current pathname:", pathname);


  useEffect(() => {
    setIsClient(true);
    setUser(getUserFromLocalStorage());
    console.log("Header: useEffect for user and pathname. User:", getUserFromLocalStorage(), "Pathname:", pathname);
  }, [pathname]);

  const mainNavLinks = [
    { href: '/', label: 'INICIO' },
    { href: '/how-to-buy', label: 'CÓMO COMPRAR' },
    { href: '/products', label: 'PRODUCTOS' },
  ];

  // Show search bar only on /products page or /products/[id] pages
  const showSearchBar = pathname === '/products' || pathname.startsWith('/products/');
  const showAuthLinks = isClient && !user && pathname !== '/login' && !pathname.startsWith('/dashboard') && pathname !== '/wholesale-register';
  const showDashboardLink = isClient && user && !pathname.startsWith('/dashboard');


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-1.5">
          <Heart className="h-9 w-9 text-primary" fill="currentColor" />
          <div className="flex flex-col">
            <span className="font-bold text-3xl text-primary leading-none">AB</span>
            <span className="text-[0.6rem] text-muted-foreground tracking-wider leading-none mt-0.5">MAYORISTA</span>
          </div>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-3 lg:space-x-4">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-medium text-foreground transition-colors hover:text-primary",
                pathname === link.href && "text-primary font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
          {showSearchBar && (
            <div className="relative flex items-center w-32 sm:w-40 md:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar"
                className="pl-10 pr-3 py-2 text-sm rounded-full border h-9"
              />
            </div>
          )}
          <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative h-9 w-9" onClick={toggleCart}>
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[0.6rem] rounded-full px-1 leading-tight">
                {itemCount}
              </span>
            )}
          </Button>
          <span className="text-xs text-foreground hidden sm:inline">${cartTotal.toFixed(2)}</span>
          

          {showAuthLinks && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" className="text-xs">
                  <LogIn className="mr-1 h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">INICIAR SESIÓN</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/wholesale-register" className="text-xs">
                  <UserPlus className="mr-1 h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">REGISTRARSE</span>
                </Link>
              </Button>
            </>
          )}
          {showDashboardLink && (
            <Button variant="default" size="sm" asChild>
              <Link href="/dashboard" className="text-xs">
                <LayoutDashboard className="mr-1 h-4 w-4 sm:mr-2" />
                Panel
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="md:hidden flex flex-wrap items-center justify-center space-x-3 p-2 border-t">
          {mainNavLinks.map((link) => (
            <Link
              key={`${link.href}-mobile`}
              href={link.href}
              className={cn(
                "text-xs font-medium text-foreground transition-colors hover:text-primary py-1 px-2",
                 pathname === link.href && "text-primary font-semibold bg-muted rounded-md"
              )}
            >
              {link.label}
            </Link>
          ))}
      </div>
    </header>
  );
}

    