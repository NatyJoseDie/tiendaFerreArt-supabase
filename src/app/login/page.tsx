
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/shared/page-header';
import Link from 'next/link';
import { saveUserToLocalStorage } from '@/lib/authUtils'; // We'll create this

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('vendedora');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === 'admin' && password === 'admin123' && userType === 'vendedora') ||
      (username === 'comercio1' && password === 'cliente123' && userType === 'cliente')
    ) {
      saveUserToLocalStorage({ username, userType });
      toast({
        title: 'Login exitoso',
        description: `Bienvenido ${username}!`,
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Error de inicio de sesión',
        description: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <PageHeader title="Acceso al Sistema" description="Ingresa tus credenciales para continuar." className="text-center mb-8" />
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🔐 Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="mb-2 block font-medium">Tipo de Usuario</Label>
              <RadioGroup
                value={userType}
                onValueChange={setUserType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vendedora" id="vendedora" />
                  <Label htmlFor="vendedora" className="cursor-pointer">👩‍💼 Vendedora</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cliente" id="cliente" />
                  <Label htmlFor="cliente" className="cursor-pointer">🏪 Cliente</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" size="lg">
              Ingresar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
           <Link href="/wholesale-register" className="text-sm text-primary hover:underline">
              ¿No tienes cuenta? Regístrate
           </Link>
          <div className="text-xs text-muted-foreground text-center p-3 bg-muted rounded-md">
            <p className="font-semibold">Datos de demostración:</p>
            <p>Vendedora: usuario `admin`, contraseña `admin123`</p>
            <p>Cliente: usuario `comercio1`, contraseña `cliente123`</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
