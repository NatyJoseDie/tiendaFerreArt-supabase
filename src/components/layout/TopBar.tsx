
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';

export function TopBar() {
  return (
    <div className="bg-muted/50 text-sm text-muted-foreground">
      <div className="container mx-auto flex h-10 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Phone className="mr-1 h-4 w-4" /> 1125486394
          </span>
          <span className="flex items-center">
            <Mail className="mr-1 h-4 w-4" /> abmayorista@gmail.com
          </span>
        </div>
        <Link href="/login" className="hover:text-primary transition-colors">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
