
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/authUtils';
import { Home, ListChecks, ShoppingBag, BarChart2, Camera, DollarSign } from 'lucide-react'; // Added more icons

interface Tab {
  id: string;
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface TabsNavProps {
  userType: User['userType'] | undefined;
}

export function TabsNav({ userType }: TabsNavProps) {
  const pathname = usePathname();
  let tabs: Tab[] = [];

  if (userType === 'vendedora') {
    tabs = [
      { id: 'home', label: 'Home', href: '/dashboard', icon: Home },
      { id: 'listaCostos', label: 'Costos Privados', href: '/dashboard/lista-costos', icon: DollarSign },
      { id: 'listaComercios', label: 'Para Comercios', href: '/dashboard/lista-comercios', icon: ShoppingBag },
      { id: 'listaFinal', label: 'Consumidor Final', href: '/dashboard/lista-final', icon: ListChecks },
      { id: 'catalogoVendedora', label: 'Mi Catálogo', href: '/dashboard/catalogo-vendedora', icon: Camera },
      { id: 'ventas', label: 'Gestión de Ventas', href: '/dashboard/ventas', icon: BarChart2 },
    ];
  } else if (userType === 'cliente') {
    tabs = [
      { id: 'home', label: 'Home', href: '/dashboard', icon: Home },
      { id: 'listaCliente', label: 'Mis Precios', href: '/dashboard/lista-cliente', icon: DollarSign },
      { id: 'catalogoCliente', label: 'Mi Catálogo', href: '/dashboard/catalogo-cliente', icon: Camera },
    ];
  }

  if (tabs.length === 0) {
    return null; // Or some fallback UI if userType is not recognized or tabs are empty
  }

  return (
    <nav className="flex flex-wrap gap-2 p-4 border-b bg-card">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href === '/dashboard' && pathname.startsWith('/dashboard') && tabs.find(t => t.href === pathname) === undefined && pathname.split('/').length <= 3);
        // The isActive logic for '/dashboard' home is a bit complex to handle sub-routes correctly.
        // It checks if current path is exactly '/dashboard' OR if it starts with '/dashboard' but isn't another defined tab path and is not too deep.
        
        return (
          <Button
            key={tab.id}
            asChild
            variant={isActive ? 'default' : 'outline'}
            className={cn(
              "transition-all",
              isActive ? "shadow-md" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Link href={tab.href}>
              {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
              {tab.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
