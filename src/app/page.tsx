import { redirect } from 'next/navigation';

export default function HomePage() {
  // Por simplicidad, la ruta raíz siempre redirige al login.
  // El DashboardLayout se encargará de redirigir a /login si no hay sesión
  // y las páginas internas protegerán el acceso.
  redirect('/login');
}

