
'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Send, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Simple inline SVG for TikTok icon
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 0 .17.01.23.05.56.39.96.96 1.14 1.58.08.29.1 1.2.09 1.57-.02 1.12-.01 2.23-.03 3.35-.01.36-.04.71-.08 1.07-.09.71-.25 1.4-.48 2.05-.66 1.8-1.94 3.24-3.75 4.02-1.11.47-2.33.66-3.54.52-.08 0-.17-.01-.24-.04-.58-.27-.98-.77-1.14-1.36-.12-.44-.11-2.05-.09-2.53.03-1.11.02-2.23.03-3.35.01-.36.03-.71.07-1.06.08-.72.24-1.41.47-2.06.66-1.81 1.94-3.25 3.75-4.02.36-.15.75-.25 1.15-.31.04-.01.08-.01.12-.02ZM7.99 6.45c.01.05.01.1.02.14.02.36.03.73.03 1.09.01.65.03 1.3.02 1.95-.02.9-.1 1.79-.21 2.67-.15 1.16-.44 2.3-.91 3.36-.25.55-.57 1.07-.96 1.53-.23.26-.53.46-.87.59-.46.17-.97.22-1.46.17-1.08-.12-2.02-.63-2.67-1.41-.41-.5-.71-1.08-.91-1.72-.06-.19-.1-.38-.13-.58-.16-1.13-.16-2.25-.16-3.38.01-1.22.01-2.45.01-3.67.01-1.02.07-2.03.19-3.04.11-.91.3-1.8.61-2.63.26-.68.6-1.31 1.03-1.85.22-.27.49-.49.79-.66.45-.25.97-.4 1.5-.44.79-.07 1.56.12 2.2.53.33.2.62.45.86.75.26.34.48.71.64 1.11.15.39.26.8.33 1.22.03.2.04.39.05.59Z" />
  </svg>
);

const paymentMethodsLogos = [
  { src: 'https://placehold.co/50x30.png?text=Uala', alt: 'Ualá Bis', hint: 'uala logo' },
  { src: 'https://placehold.co/50x30.png?text=MC', alt: 'Mastercard', hint: 'mastercard logo' },
  { src: 'https://placehold.co/50x30.png?text=Visa', alt: 'Visa', hint: 'visa logo' },
  { src: 'https://placehold.co/50x30.png?text=Amex', alt: 'American Express', hint: 'amex logo' },
  { src: 'https://placehold.co/50x30.png?text=NX', alt: 'Naranja X', hint: 'naranja x logo' },
  { src: 'https://placehold.co/50x30.png?text=Cabal', alt: 'Cabal', hint: 'cabal logo' },
  { src: 'https://placehold.co/50x30.png?text=Maestro', alt: 'Maestro', hint: 'maestro logo' },
  { src: 'https://placehold.co/50x30.png?text=Diners', alt: 'Diners Club', hint: 'diners club logo' },
  { src: 'https://placehold.co/50x30.png?text=EFT', alt: 'Efectivo', hint: 'cash icon' },
  { src: 'https://placehold.co/50x30.png?text=TR', alt: 'Transferencia', hint: 'bank transfer icon' },
];

const shippingMethodsLogos = [
  { src: 'https://placehold.co/60x35.png?text=Correo', alt: 'Correo Argentino', hint: 'correo argentino logo' },
  { src: 'https://placehold.co/50x35.png?text=Moto', alt: 'Moto Mensajería', hint: 'motorcycle delivery icon' },
  { src: 'https://placehold.co/50x35.png?text=Local', alt: 'Retiro en Local', hint: 'store icon' },
];


export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      console.log('Newsletter signup (footer):', { email: newsletterEmail });
      toast({
        title: "¡Gracias por suscribirte!",
        description: "Recibirás nuestras últimas novedades pronto.",
      });
      setNewsletterEmail('');
    } else {
      toast({
        title: "Error",
        description: "Por favor, completa tu email.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="border-t bg-muted/20 pt-10 pb-8 mt-12 text-sm">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Columna Izquierda: Medios de Pago y Envío (Ocupa más espacio) */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3 uppercase tracking-wider">Medios de Pago</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {paymentMethodsLogos.map((logo) => (
                  <Image
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.alt === 'Ualá Bis' ? 60 : 50} // Uala logo is wider in example
                    height={30}
                    className="object-contain h-[30px]"
                    data-ai-hint={logo.hint}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3 uppercase tracking-wider">Medios de Envío</h3>
              <div className="flex flex-wrap gap-3 items-center">
                {shippingMethodsLogos.map((logo) => (
                  <Image
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.alt === 'Correo Argentino' ? 70 : 50}
                    height={35}
                    className="object-contain h-[35px]"
                    data-ai-hint={logo.hint}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Redes, Contacto, Newsletter */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wider">Nuestras Redes Sociales</h3>
              <div className="flex space-x-3">
                <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="TikTok" className="text-muted-foreground hover:text-primary transition-colors">
                  <TikTokIcon className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wider">Contacto</h3>
              <ul className="space-y-1.5 text-muted-foreground">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  <a href="mailto:distriferreart@gmail.com" className="hover:text-primary transition-colors break-all">
                    distriferreart@gmail.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  <span>1139587201</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  <span>Florencio Varela</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1 text-primary flex-shrink-0" />
                  <Link href="/refund-policy" className="hover:text-primary transition-colors">
                    Botón de arrepentimiento
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wider">Newsletter</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-grow h-10 bg-background"
                  aria-label="Email para newsletter"
                />
                <Button type="submit" className="bg-foreground text-background hover:bg-foreground/80 h-10 px-4">
                  SUSCRIBIRME
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AB Mayorista. Todos los derechos reservados.</p>
          <p className="mt-1">Desarrollado con Next.js y ShadCN UI.</p>
        </div>
      </div>
    </footer>
  );
}
