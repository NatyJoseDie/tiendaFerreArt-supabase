
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/authUtils';
import { Home, ListChecks, ShoppingBag, BarChart2, Camera, DollarSign, Users } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  href: string;
  icon?: React.ElementType;
  isClientTab?: boolean; // To identify client-specific tabs for vendedora view
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
  ];

  const clienteTabs: Tab[] = [
    { id: 'clienteHome', label: 'Home Cliente', href: '/dashboard', icon: Home, isClientTab: true }, // Keep same href as vendedora home for now, or create /dashboard/cliente-home
    { id: 'listaCliente', label: 'Mis Precios (Cliente)', href: '/dashboard/lista-cliente', icon: DollarSign, isClientTab: true },
    { id: 'catalogoCliente', label: 'Mi Catálogo (Cliente)', href: '/dashboard/catalogo-cliente', icon: Camera, isClientTab: true },
  ];

  if (userType === 'vendedora') {
    // Vendedora sees her tabs and also the client tabs for overview
    tabs = [
      ...vendedoraTabs,
      // Optional: Add a separator or visual cue here if desired
      { id: 'clientSectionSeparator', label: '--- Vista Cliente ---', href: '#', icon: Users, isClientTab: true }, // Non-clickable visual separator
      ...clienteTabs.map(tab => ({...tab, label: tab.label.replace(" (Cliente)", "")})) // Remove redundant label part for vendedora view
    ];
  } else if (userType === 'cliente') {
    tabs = clienteTabs;
  }


  if (tabs.length === 0) {
    return null; 
  }

  return (
    <nav className="flex flex-wrap gap-2 p-4 border-b bg-card items-center">
      {tabs.map((tab) => {
        if (tab.id === 'clientSectionSeparator') {
          return (
            <div key={tab.id} className="flex items-center text-xs text-muted-foreground px-2 py-1.5">
               {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
               {tab.label}
            </div>
          );
        }

        const isActive = pathname === tab.href || (tab.href === '/dashboard' && pathname.startsWith('/dashboard') && tabs.find(t => t.href === pathname && t.id !== 'home' && t.id !== 'clienteHome') === undefined && pathname.split('/').length <= 3 && (userType === 'vendedora' ? tab.id === 'home' : tab.id === 'clienteHome') );
        
        return (
          <Button
            key={tab.id}
            asChild
            variant={isActive ? 'default' : 'outline'}
            className={cn(
              "transition-all",
              isActive ? "shadow-md" : "text-muted-foreground hover:text-foreground",
              tab.isClientTab && userType === 'vendedora' ? 'border-blue-300 hover:border-blue-500' : '' // Optional: visual cue for client tabs when vendedora views them
            )}
            disabled={tab.href === '#'}
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
