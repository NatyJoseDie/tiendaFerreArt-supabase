
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/authUtils';
import { Home, ListChecks, ShoppingBag, BarChart2, Camera, DollarSign, Users, Briefcase } from 'lucide-react'; // Added Briefcase

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
    { id: 'listaComercios', label: 'Para Comercios', href: '/dashboard/lista-comercios', icon: ShoppingBag },
    { id: 'listaFinal', label: 'Consumidor Final', href: '/dashboard/lista-final', icon: ListChecks },
    { id: 'catalogoVendedora', label: 'Mi Catálogo (Público)', href: '/dashboard/catalogo-vendedora', icon: Camera },
    { id: 'ventas', label: 'Gestión de Ventas', href: '/dashboard/ventas', icon: BarChart2 },
    { id: 'portalCliente', label: 'Portal Cliente', href: '/dashboard/vista-cliente', icon: Briefcase }, // Changed icon
  ];

  const clienteTabs: Tab[] = [
    { id: 'clienteHome', label: 'Home Cliente', href: '/dashboard', icon: Home },
    { id: 'listaCliente', label: 'Mis Precios', href: '/dashboard/lista-cliente', icon: DollarSign },
    { id: 'catalogoCliente', label: 'Mi Catálogo', href: '/dashboard/catalogo-cliente', icon: Camera },
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
        // Determine if the current tab is active.
        // For the 'home' and 'clienteHome' tabs, they are active if the pathname is exactly '/dashboard'.
        // For other tabs, they are active if the pathname starts with their href.
        let isActive = false;
        if ((tab.id === 'home' || tab.id === 'clienteHome') && tab.href === '/dashboard') {
          isActive = pathname === '/dashboard';
        } else {
          isActive = pathname.startsWith(tab.href);
        }
        
        // Special condition for the root dashboard page to ensure only one "Home" tab is active.
        if (pathname === '/dashboard') {
            if (userType === 'vendedora' && tab.id !== 'home') isActive = false;
            if (userType === 'cliente' && tab.id !== 'clienteHome') isActive = false;
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
