import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const heroImages = [
  { src: 'https://placehold.co/400x600.png', alt: 'Winter Fashion Model', hint: 'winter fashion' },
  { src: 'https://placehold.co/400x300.png', alt: 'Cozy Winter Accessories', hint: 'winter accessories' },
  { src: 'https://placehold.co/400x300.png', alt: 'Warm Winter Scarf', hint: 'winter scarf' },
  { src: 'https://placehold.co/400x600.png', alt: 'Stylish Winter Beanie', hint: 'winter beanie' },
  { src: 'https://placehold.co/400x300.png', alt: 'Hot Coffee Mug', hint: 'winter coffee' },
  { src: 'https://placehold.co/400x300.png', alt: 'Comfy Winter Sweater', hint: 'winter sweater' },
];

const categories = [
  'INVIERNO', 'BEAUTY', 'HOME', 'BAZAR', 'LUCES', 
  'TECNO', 'LIBRERIA', 'VERANO', 'SOQUETES', 'MODA'
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative w-full aspect-[16/7] overflow-hidden rounded-lg shadow-lg">
        <div className="grid grid-cols-3 grid-rows-2 h-full">
          {heroImages.map((image, index) => (
            <div key={index} className={`relative ${index === 0 || index === 3 ? 'row-span-2' : ''} ${ (index === 0 || index === 3) ? 'aspect-[2/3]' : 'aspect-video' } `}>
               <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint={image.hint}
                priority={index < 3}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
          <h1 className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            INVIERNO
          </h1>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          <span className="h-2.5 w-2.5 bg-white/70 rounded-full"></span>
          <span className="h-2.5 w-2.5 bg-primary rounded-full"></span>
          <span className="h-2.5 w-2.5 bg-white/70 rounded-full"></span>
        </div>
      </section>

      {/* Main Categories Section */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-center mb-8">
          CATEGORÍAS PRINCIPALES
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button key={category} variant="default" size="lg" className="rounded-md" asChild>
              {/* In a real app, these links would go to category pages */}
              <Link href={`/products?category=${category.toLowerCase()}`}> 
                {category}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {/* Placeholder for other sections from original app if needed */}
      <section className="bg-secondary/50 p-8 rounded-lg shadow mt-12">
         <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Herramientas de IA</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            También puedes probar nuestro redactor de descripciones de productos potenciado por IA.
          </p>
          <Button asChild size="lg">
            <Link href="/ai-copywriter">
              Probar Redactor IA <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
