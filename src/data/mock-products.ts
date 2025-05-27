import type { Product, ProductReview, ProductSpecification } from '@/lib/types';

// Helper function to generate a simple SKU
const generateSku = (category: string, id: string): string => {
  const catPrefix = category.substring(0, 3).toUpperCase();
  return `${catPrefix}-${id.padStart(3, '0')}`;
};

const userProducts: {id: number; nombre: string; costo: number; categoria: string}[] = [
    {id: 1, nombre: "Autocebantes 750ml", costo: 13000, categoria: "otros"},
    {id: 2, nombre: "Termo 1.2lts + mate", costo: 20000, categoria: "termo"},
    {id: 3, nombre: "Termo system 1.2lts + mate", costo: 20900, categoria: "termo"},
    {id: 4, nombre: "Termo 1.2lts + mate", costo: 20000, categoria: "termo"},
    {id: 5, nombre: "Termo media manja 1lts + mate", costo: 17500, categoria: "termo"},
    {id: 6, nombre: "Termo 1.2lts + mate (tornasolado)", costo: 20000, categoria: "termo"},
    {id: 7, nombre: "Estufa de cuarzo dos velas 800w", costo: 14500, categoria: "otros"},
    {id: 8, nombre: "Freidora de aire 7L + pinza de regalo", costo: 88000, categoria: "freidora"},
    {id: 9, nombre: "Caloventor 2000w", costo: 14500, categoria: "otros"},
    {id: 10, nombre: "Spray para aceite", costo: 4500, categoria: "otros"},
    {id: 11, nombre: "Sarten multifuncion", costo: 12000, categoria: "otros"},
    {id: 12, nombre: "Freidora de aire 3.2lts", costo: 45000, categoria: "freidora"},
    {id: 13, nombre: "Picadora manual", costo: 5000, categoria: "otros"},
    {id: 14, nombre: "Freidora de aire 3.5lts tactil", costo: 55000, categoria: "freidora"},
    {id: 15, nombre: "Freidora de aire 5lts", costo: 66500, categoria: "freidora"},
    {id: 16, nombre: "Sandwichera 750w", costo: 15500, categoria: "otros"},
    {id: 17, nombre: "Sandwichera 800w", costo: 17000, categoria: "otros"},
    {id: 18, nombre: "Cactus bailarin", costo: 6900, categoria: "otros"},
    {id: 19, nombre: "Aro de luz 12\" 30cm", costo: 12000, categoria: "lampara"},
    {id: 20, nombre: "Secador de pelo plegable 1800W", costo: 20500, categoria: "otros"},
    {id: 21, nombre: "Auricular M25", costo: 5800, categoria: "auricular"},
    {id: 22, nombre: "Planchita flequillera", costo: 2600, categoria: "plancha"},
    {id: 23, nombre: "Cortadora de pelo Oryx color", costo: 8500, categoria: "cortadora"},
    {id: 24, nombre: "Lampara velador", costo: 8900, categoria: "lampara"},
    {id: 25, nombre: "Cortadora de pelo intima", costo: 24999, categoria: "cortadora"},
    {id: 26, nombre: "Cortadora de pelo patillera Oryx", costo: 8500, categoria: "cortadora"},
    {id: 27, nombre: "Cortadora de pelo con aspirado", costo: 16500, categoria: "cortadora"},
    {id: 28, nombre: "Planchita Oryx 230°", costo: 18500, categoria: "plancha"},
    {id: 29, nombre: "Planchita Osr 220°", costo: 8000, categoria: "plancha"},
    {id: 30, nombre: "Planchita Oryx 230°", costo: 18500, categoria: "plancha"},
    {id: 31, nombre: "Planchita nano titanium 250°", costo: 13000, categoria: "plancha"},
    {id: 32, nombre: "Cepillo 3 en 1 giratorio", costo: 19500, categoria: "otros"},
    {id: 33, nombre: "Secador 5 en 1 2000W", costo: 14500, categoria: "otros"},
    {id: 34, nombre: "Planchita buclera 2 en 1", costo: 9900, categoria: "plancha"},
    {id: 35, nombre: "Maquina para cortar pelo profesional DALING", costo: 14999, categoria: "cortadora"},
    {id: 36, nombre: "Soplador - Aspirador de hojas", costo: 53500, categoria: "otros"},
    {id: 37, nombre: "Sofa inflable 2 en 1", costo: 37500, categoria: "otros"},
    {id: 38, nombre: "Lunchera hermetica con cubierto", costo: 9900, categoria: "otros"},
    {id: 39, nombre: "Auricular i7 mini", costo: 5000, categoria: "auricular"},
    {id: 40, nombre: "Corta pelo profesional Daling", costo: 17000, categoria: "cortadora"},
    {id: 41, nombre: "Auricular M20", costo: 5000, categoria: "auricular"},
    {id: 42, nombre: "Juego de sabanas 4 piezas King", costo: 19000, categoria: "otros"},
    {id: 43, nombre: "Juego de sabanas 4 piezas Queen", costo: 17500, categoria: "otros"},
    {id: 44, nombre: "Lunchera hermetica con cubierto", costo: 9900, categoria: "otros"},
    {id: 45, nombre: "Parlante Bluetooth de diseño con luces led", costo: 28000, categoria: "otros"},
    {id: 46, nombre: "Tira led usb 3mts", costo: 4900, categoria: "lampara"},
    {id: 47, nombre: "Auricular M20", costo: 5000, categoria: "auricular"},
    {id: 48, nombre: "Lampara silicona panda", costo: 8900, categoria: "lampara"},
    {id: 49, nombre: "Lampara animalitos", costo: 7500, categoria: "lampara"},
    {id: 50, nombre: "Auricular inalambrico M26", costo: 6000, categoria: "auricular"}
];

export const mockProducts: Product[] = userProducts.map((p) => {
  const nameParts = p.nombre.split(' ');
  const hint = nameParts.length > 1 ? nameParts[0].toLowerCase() + " " + nameParts[1].toLowerCase() : nameParts[0].toLowerCase();

  return {
    id: p.id.toString(),
    name: p.nombre,
    description: `Descripción detallada de ${p.nombre}. Ideal para ${p.categoria}.`,
    longDescription: `Una descripción más larga y completa sobre ${p.nombre}, sus características principales, usos y beneficios. Perfecto para quienes buscan calidad en ${p.categoria}.`,
    price: p.costo,
    currency: '$',
    category: p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1), // Capitalize category
    images: [`https://placehold.co/600x400.png?text=${encodeURIComponent(p.nombre)}`, `https://placehold.co/600x400.png?text=${encodeURIComponent(p.nombre)}+view2`],
    stock: 5, // Default stock set to 5
    featured: p.id % 5 === 0, // Feature roughly every 5th product
    brand: 'Marca Ejemplo',
    sku: generateSku(p.categoria, p.id.toString()),
    tags: [p.categoria, nameParts[0].toLowerCase(), ...(nameParts.length > 1 ? [nameParts[1].toLowerCase()] : [])],
    specifications: [
        { key: 'Material', value: 'Material de ejemplo' },
        { key: 'Origen', value: 'Origen de ejemplo' },
    ] as ProductSpecification[],
    reviews: [] as ProductReview[], // Placeholder for reviews
  };
});

// Ensure data-ai-hint is added for placeholder images
mockProducts.forEach(product => {
  product.images = product.images.map(imgUrl => {
    if (imgUrl.startsWith('https://placehold.co/')) {
      const nameKeywords = product.name.toLowerCase().split(' ').slice(0, 2).join(' ');
      // Ensure data-ai-hint is part of the query string correctly
      if (imgUrl.includes('?')) {
        return `${imgUrl}&data-ai-hint=${encodeURIComponent(nameKeywords)}`;
      }
      return `${imgUrl}?data-ai-hint=${encodeURIComponent(nameKeywords)}`;
    }
    return imgUrl;
  });
});


export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.featured);
};

export const getAllProducts = (): Product[] => {
  return mockProducts;
};

export const getCategories = (): string[] => {
  const categories = new Set(mockProducts.map(p => p.category));
  return Array.from(categories).sort();
};
