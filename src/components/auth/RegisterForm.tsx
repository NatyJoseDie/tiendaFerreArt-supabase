'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

type TaxRegime = 'monotributista' | 'responsable_inscripto' | 'no_inscripto';

const registerSchema = yup.object().shape({
  // Información personal
  first_name: yup.string().required('El nombre es requerido'),
  last_name: yup.string().required('El apellido es requerido'),
  
  // Información de contacto
  email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido'),
  phone: yup.string().required('El teléfono es requerido'),
  address: yup.string().required('La dirección es requerida'),
  
  // Información fiscal
  tax_id: yup.string().required('El CUIT/DNI es requerido'),
  tax_id_type: yup.string().oneOf(['cuit', 'dni'], 'Tipo de identificación inválido').required('El tipo de identificación es requerido'),
  tax_regime: yup.string().oneOf<TaxRegime>(['monotributista', 'responsable_inscripto', 'no_inscripto'], 'Régimen fiscal inválido').required('El régimen fiscal es requerido'),
  
  // Información de negocio (opcional)
  business_name: yup.string(),
  business_address: yup.string(),
  
  // Contraseña
  password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
  confirm_password: yup.string()
    .oneOf([yup.ref('password'), undefined], 'Las contraseñas deben coincidir')
    .required('Debes confirmar la contraseña'),
  
  // Términos y condiciones
  terms: yup.boolean().oneOf([true], 'Debes aceptar los términos y condiciones').required('Requerido'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { registerReseller } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await registerReseller({
        ...data,
        // Asegurarse de que los campos opcionales no sean undefined
        business_name: data.business_name || undefined,
        business_address: data.business_address || undefined,
      });
      
      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Error al registrar. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">¡Registro exitoso!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Tu cuenta ha sido creada exitosamente. Estamos revisando tu información y te contactaremos pronto.</p>
                </div>
                <div className="mt-4">
                  <Link href="/login" className="text-sm font-medium text-green-800 hover:text-green-600">
                    Ir al inicio de sesión <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Registro de Revendedor</h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  Nombre *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="first_name"
                    autoComplete="given-name"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.first_name ? 'border-red-300' : ''
                    }`}
                    {...register('first_name')}
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Apellido *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="last_name"
                    autoComplete="family-name"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.last_name ? 'border-red-300' : ''
                    }`}
                    {...register('last_name')}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico *
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.email ? 'border-red-300' : ''
                    }`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono *
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    autoComplete="tel"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.phone ? 'border-red-300' : ''
                    }`}
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Dirección *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address"
                    autoComplete="street-address"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.address ? 'border-red-300' : ''
                    }`}
                    {...register('address')}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="tax_id_type" className="block text-sm font-medium text-gray-700">
                  Tipo de identificación *
                </label>
                <div className="mt-1">
                  <select
                    id="tax_id_type"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.tax_id_type ? 'border-red-300' : ''
                    }`}
                    {...register('tax_id_type')}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="cuit">CUIT</option>
                    <option value="dni">DNI</option>
                  </select>
                  {errors.tax_id_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.tax_id_type.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">
                  Número de CUIT/DNI *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="tax_id"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.tax_id ? 'border-red-300' : ''
                    }`}
                    {...register('tax_id')}
                  />
                  {errors.tax_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.tax_id.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="tax_regime" className="block text-sm font-medium text-gray-700">
                  Régimen fiscal *
                </label>
                <div className="mt-1">
                  <select
                    id="tax_regime"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.tax_regime ? 'border-red-300' : ''
                    }`}
                    {...register('tax_regime')}
                  >
                    <option value="">Seleccionar régimen fiscal...</option>
                    <option value="monotributista">Monotributista</option>
                    <option value="responsable_inscripto">Responsable Inscripto</option>
                    <option value="no_inscripto">No Inscripto</option>
                  </select>
                  {errors.tax_regime && (
                    <p className="mt-1 text-sm text-red-600">{errors.tax_regime.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Información de negocio (opcional)</h3>
                <p className="mt-1 text-sm text-gray-500">Completa esta sección si tienes un nombre comercial o dirección fiscal diferente.</p>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                  Nombre comercial o razón social
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="business_name"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register('business_name')}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="business_address" className="block text-sm font-medium text-gray-700">
                  Dirección fiscal
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="business_address"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register('business_address')}
                  />
                </div>
              </div>

              <div className="sm:col-span-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Seguridad</h3>
                <p className="mt-1 text-sm text-gray-500">Crea una contraseña segura para tu cuenta.</p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña *
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.password ? 'border-red-300' : ''
                    }`}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña *
                </label>
                <div className="mt-1">
                  <input
                    id="confirm_password"
                    type="password"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.confirm_password ? 'border-red-300' : ''
                    }`}
                    {...register('confirm_password')}
                  />
                  {errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      {...register('terms')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      Acepto los{' '}
                      <Link href="/terminos" className="text-blue-600 hover:text-blue-500">
                        Términos y Condiciones
                      </Link>{' '}
                      y la{' '}
                      <Link href="/privacidad" className="text-blue-600 hover:text-blue-500">
                        Política de Privacidad
                      </Link>{' '}
                      *
                    </label>
                    {errors.terms && (
                      <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </>
                ) : (
                  'Registrarme como revendedor'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
