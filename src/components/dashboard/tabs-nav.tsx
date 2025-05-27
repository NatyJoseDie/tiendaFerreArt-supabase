
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/authUtils';
import { Home, ListChecks, ShoppingBag, BarChart2, Camera, DollarSign, Briefcase, Users } from 'lucide-react';

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

  const vendedoraTabs: Tab[] = [
    { id: 'home', label: 'Home', href: '/dashboard', icon: Home },
    { id: 'listaCostos', label: 'Costos Privados', href: '/dashboard/lista-costos', icon: DollarSign },
    { id: 'ventasConsumidorFinal', label: 'Ventas C. Final', href: '/dashboard/ventas', icon: BarChart2 },
    { id: 'ventasMayoristas', label: 'Ventas Mayoristas', href: '/dashboard/ventas-mayoristas', icon: Users },
    { id: 'catalogoVendedora', label: 'Mi Catálogo (Público)', href: '/dashboard/catalogo-vendedora', icon: Camera },
    { id: 'consumidorFinal', label: 'Consumidor Final', href: '/dashboard/lista-final', icon: ListChecks },
    { id: 'portalCliente', label: 'Portal Cliente', href: '/dashboard/vista-cliente', icon: Briefcase },
  ];

  const clienteTabs: Tab[] = [
    { id: 'clienteHome', label: 'Home Cliente', href: '/dashboard', icon: Home },
    { id: 'listaCliente', label: 'Mis Precios', href: '/dashboard/lista-cliente', icon: DollarSign },
    { id: 'catalogoCliente', label: 'Mi Catálogo', href: '/dashboard/catalogo-cliente', icon: Camera },
    // Consider adding "Realizar Pedido" here if it's a primary client action from the main nav
    // { id: 'realizarPedido', label: 'Realizar Pedido', href: '/dashboard/realizar-pedido', icon: ShoppingCart },
  ];

  if (userType === 'vendedora') {
    tabs = vendedoraTabs;
  } else if (userType === 'cliente') {
    tabs = clienteTabs;
  }


  if (tabs.length === 0) {
    return null;
  }

  return (
    <nav className="flex flex-wrap gap-2 p-4 border-b bg-card items-center">
      {tabs.map((tab) => {
        let isActive = false;
        // Exact match for dashboard home
        if ((tab.id === 'home' && userType === 'vendedora' && pathname === '/dashboard') || 
            (tab.id === 'clienteHome' && userType === 'cliente' && pathname === '/dashboard')) {
          isActive = true;
        } else if (tab.href !== '/dashboard') { // For other tabs, use startsWith
          isActive = pathname.startsWith(tab.href);
        }


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

    