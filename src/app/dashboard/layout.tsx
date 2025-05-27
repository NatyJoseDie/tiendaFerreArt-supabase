
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TabsNav } from '@/components/dashboard/tabs-nav';
import { getUserFromLocalStorage, removeUserFromLocalStorage, type User } from '@/lib/authUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, UserCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.replace('/login'); // Redirect to login if no user found
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    removeUserFromLocalStorage();
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between p-4 border-b bg-card">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </header>
        <nav className="p-4 border-b bg-card">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>
        </nav>
        <main className="flex-grow p-6 bg-muted/40">
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }
  
  if (!user) {
    // This case should ideally be handled by the redirect, but as a fallback:
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirigiendo a la página de login...</p>
      </div>
    );
  }

  const userInitial = user.username ? user.username.charAt(0).toUpperCase() : '?';
  const userTypeText = user.userType === 'vendedora' ? 'Panel Vendedora' : 'Panel Comercio';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 flex items-center justify-between p-4 border-b bg-card shadow-sm">
        <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://placehold.co/40x40.png?text=${userInitial}`} alt={user.username} data-ai-hint="avatar placeholder"/>
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">{user.username}</h1>
              <p className="text-xs text-muted-foreground">{userTypeText}</p>
            </div>
        </div>
        <Button variant="outline" onClick={handleLogout} size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Salir
        </Button>
      </header>
      <TabsNav userType={user.userType} />
      <main className="flex-grow p-6 bg-muted/30">
        {children}
      </main>
    </div>
  );
}
