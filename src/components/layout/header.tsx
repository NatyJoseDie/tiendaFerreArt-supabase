
import Link from 'next/link';
import { Heart, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/90"> {/* Fondo claro (card) */}
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-1.5">
          <Heart className="h-9 w-9 text-primary fill-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-3xl text-primary leading-none">AB</span>
            <span className="text-[0.6rem] text-muted-foreground tracking-wider leading-none mt-0.5">MAYORISTA</span>
          </div>
        </Link>
        <nav className="flex flex-1 items-center space-x-3 lg:space-x-4">
          {/* Navigation Links */}
          {[
            { href: '/', label: 'INICIO' },
            { href: '/how-to-buy', label: 'CÓMO COMPRAR' },
            { href: '/products', label: 'PRODUCTOS' },
            { href: '/wholesale-register', label: 'REGISTRO MAYORISTA' },
            { href: '/retail-store', label: 'TIENDA MINORISTA' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-foreground transition-colors hover:text-primary" 
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar"
              className="pl-10 pr-3 py-2 text-sm rounded-full border h-9"
            />
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative h-9 w-9">
              <ShoppingCart className="h-5 w-5 text-foreground" /> {/* Asegurar que el icono se vea */}
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[0.6rem] rounded-full px-1 leading-tight">
                0
              </span>
            </Button>
            <span className="text-xs text-foreground">$0.00</span> 
          </div>
        </div>
      </div>
    </header>
  );
}

    