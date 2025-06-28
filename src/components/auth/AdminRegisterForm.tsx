'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const adminRegisterSchema = yup.object().shape({
  email: yup.string().email('Correo electrónico inválido').required('El correo es requerido'),
  password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir'),
  adminCode: yup.string().required('El código de administrador es requerido')
    .test('admin-code', 'Código de administrador inválido', (value) => {
      // En producción, esto debería validarse en el servidor
      return value === process.env.NEXT_PUBLIC_ADMIN_REGISTER_CODE;
    })
});

type AdminRegisterFormData = yup.InferType<typeof adminRegisterSchema>;

export function AdminRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeField, setShowCodeField] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AdminRegisterFormData>({
    resolver: yupResolver(adminRegisterSchema)
  });

  const onSubmit = async (data: AdminRegisterFormData) => {
    setIsLoading(true);
    
    try {
      // Verificar el código de administrador
      if (data.adminCode !== process.env.NEXT_PUBLIC_ADMIN_REGISTER_CODE) {
        toast({
          title: 'Acceso denegado',
          description: 'El código de administrador no es válido',
          variant: 'destructive'
        });
        return;
      }

    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: 'Administrador',
            role: 'admin'
          }
        }
      });

      if (error) throw error;

      if (authData.user) {
        // Crear perfil de administrador
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: data.email,
              full_name: 'Administrador',
              role: 'admin'
            }
          ]);

        if (profileError) throw profileError;

        toast({
          title: '¡Registro exitoso!',
          description: 'Tu cuenta de administrador ha sido creada correctamente.'
        });

        router.push('/admin');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error al registrar el administrador',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar solo el campo de código primero
  if (!showCodeField) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-center">Acceso de Administrador</h3>
          <p className="text-sm text-gray-600 text-center mt-2">
            Ingresa el código de acceso para continuar
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminCode">Código de acceso</Label>
            <Input
              id="adminCode"
              type="password"
              {...register('adminCode')}
              disabled={isLoading}
              autoComplete="off"
              autoFocus
            />
            {errors.adminCode && (
              <p className="text-sm text-red-500">{errors.adminCode.message}</p>
            )}
          </div>
          <Button 
            type="button" 
            className="w-full" 
            onClick={handleSubmit((data) => {
              if (data.adminCode === process.env.NEXT_PUBLIC_ADMIN_REGISTER_CODE) {
                setShowCodeField(true);
              } else {
                toast({
                  title: 'Código incorrecto',
                  description: 'El código de acceso no es válido',
                  variant: 'destructive'
                });
              }
            })}
            disabled={isLoading}
          >
            Verificar código
          </Button>
        </div>
      </div>
    );
  }

  // Mostrar el formulario completo después de la verificación
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled={isLoading}
          autoComplete="username"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminCode">Código de administrador</Label>
        <Input
          id="adminCode"
          type="password"
          {...register('adminCode')}
          disabled={isLoading}
        />
        {errors.adminCode && (
          <p className="text-sm text-red-500">{errors.adminCode.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Crear cuenta de administrador'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={() => setShowCodeField(false)}
          disabled={isLoading}
        >
          Volver
        </Button>
      </div>
    </form>
  );
}
