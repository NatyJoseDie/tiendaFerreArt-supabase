
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card

// No longer needed as category is directly from product data
// const obtenerNombreCategoria = (codigo: string) => {
//   const categorias: Record<string, string> = {
//     termo: "Termos",
//     freidora: "Freidoras",
//     plancha: "Planchitas",
//     cortadora: "Cortadoras",
//     auricular: "Auriculares",
//     lampara: "Lámparas",
//     otros: "Otros",
//   };
//   return categorias[codigo.toLowerCase()] || "Otros";
// };

export default function CatalogoPublicoPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProductos(getAllProducts());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // You can add a more sophisticated loading skeleton here
    return (
      <div className="app-container text-center py-10">
        <p>Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="app-container"> {/* Ensure this class provides necessary layout if needed */}
      <header className="catalogo-header">
        <Image
          src="https://placehold.co/200x80.png?text=AB+Mayorista+Logo"
          alt="AB Mayorista Logo"
          width={200}
          height={80}
          className="logo" // Ensure this class is defined in estilos.css
          data-ai-hint="company logo"
        />
        <h1>Catálogo de Productos</h1>
        <p>Conocé nuestros productos disponibles</p>
      </header>

      <div className="catalogo"> {/* Ensure this class is defined for grid layout */}
        {productos.map((p) => {
          const imageSrc = p.images && p.images.length > 0 ? p.images[0] : 'https://placehold.co/300x300.png?text=No+Imagen';
          const imageHint = imageSrc.includes('placehold.co') ? p.category.toLowerCase() + " " + p.name.split(" ")[0].toLowerCase() : undefined;
          return (
            <Card className="producto" key={p.id}> {/* Using Card for structure, styled by .producto */}
              <div className="producto-img">
                <Image
                  src={imageSrc}
                  alt={p.name}
                  width={250} // Adjust as needed
                  height={250} // Adjust as needed
                  style={{ objectFit: 'contain', maxWidth: "100%", maxHeight: "180px" }}
                  data-ai-hint={imageHint}
                />
              </div>
              <CardContent className="producto-body"> {/* Using CardContent, styled by .producto-body */}
                <h4>{p.name}</h4>
                <p>$ {p.price.toLocaleString("es-AR")}</p>
                <span style={{ fontSize: 12, color: "#555" }}>
                  {p.category} {/* Directly use capitalized category */}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-8">
        <Button asChild variant="outline" className="login-btn" style={{margin: 0}}>
          <Link href="/login">
            Iniciar sesión para ver precios mayoristas
          </Link>
        </Button>
      </div>

      <footer className="mt-12"> {/* Ensure this footer is styled by estilos.css or Tailwind */}
        © {new Date().getFullYear()} - AB Mayorista | Tu Tienda Online
      </footer>
    </div>
  );
}
