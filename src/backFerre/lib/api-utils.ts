import { NextResponse } from 'next/server';

type SuccessResponse<T> = {
  success: true;
  data: T;
};

type ErrorResponse = {
  success: false;
  error: string;
  code?: string;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400, code?: string): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { 
      success: false, 
      error,
      ...(code && { code }) 
    }, 
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // Manejar errores de Supabase
    if ('code' in error) {
      switch (error.code) {
        case '23505': // Violación de clave única
          return errorResponse('El correo electrónico ya está registrado', 400, 'EMAIL_EXISTS');
        case 'PGRST116': // No se encontraron resultados
          return errorResponse('Recurso no encontrado', 404, 'NOT_FOUND');
        case 'PGRST204': // Sin contenido
          return errorResponse('No se encontraron resultados', 404, 'NOT_FOUND');
      }
    }
    
    // Manejar errores de autenticación
    if (error.message.includes('Invalid login credentials')) {
      return errorResponse('Credenciales inválidas', 401, 'INVALID_CREDENTIALS');
    }
    
    // Error genérico
    return errorResponse(error.message || 'Error del servidor', 500);
  }
  
  // Error inesperado
  return errorResponse('Error interno del servidor', 500, 'INTERNAL_SERVER_ERROR');
}
