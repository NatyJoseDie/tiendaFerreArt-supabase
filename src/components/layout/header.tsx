import Link from 'next/link';
import { Package2, Home, LayoutGrid, Wand2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package2 className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-xl">ShopVision</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4 lg:space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Home className="mr-1 inline-block h-4 w-4" />
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <LayoutGrid className="mr-1 inline-block h-4 w-4" />
            Products
          </Link>
          <Link
            href="/ai-copywriter"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Wand2 className="mr-1 inline-block h-4 w-4" />
            AI Copywriter
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
           {/* Placeholder for future cart functionality */}
          <Button variant="ghost" size="icon" aria-label="Shopping Cart">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
