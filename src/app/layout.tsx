
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import './estilos.css'; // Import custom styles
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/context/cart-context'; // Import CartProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AB Mayorista - Tu Tienda Online',
  description: 'Descubre productos increíbles y novedades todas las semanas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <CartProvider> {/* Wrap with CartProvider */}
          <Header />
          <main className="flex-grow container py-8">
            {children}
          </main>
          <Toaster />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
