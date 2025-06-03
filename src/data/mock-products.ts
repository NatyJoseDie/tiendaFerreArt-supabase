
import type { Product, ProductReview, ProductSpecification } from '@/lib/types';

// Helper function to generate a simple SKU
const generateSku = (category: string, id: string): string => {
  const catPrefix = category.substring(0, 3).toUpperCase();
  return `${catPrefix}-${id.padStart(3, '0')}`;
};

// Existing userProducts
const userProducts: {id: number; nombre: string; costo: number; categoria: string}[] = [
    {id: 1, nombre: "Autocebantes 750ml", costo: 13000, categoria: "otros"},
    {id: 2, nombre: "Termo 1.2lts + mate", costo: 20000, categoria: "termo"},
    {id: 3, nombre: "Termo system 1.2lts + mate", costo: 20900, categoria: "termo"},
    {id: 4, nombre: "Termo 1.2lts + mate (otro modelo)", costo: 20000, categoria: "termo"}, // Modified slightly to avoid exact name collision if any
    {id: 5, nombre: "Termo media manja 1lts + mate", costo: 17500, categoria: "termo"},
    {id: 6, nombre: "Termo 1.2lts + mate (tornasolado)", costo: 20000, categoria: "termo"},
    {id: 7, nombre: "Estufa de cuarzo dos velas 800w", costo: 14500, categoria: "climatizacion"}, // Updated category
    {id: 8, nombre: "Freidora de aire 7L + pinza de regalo", costo: 88000, categoria: "freidora"},
    {id: 9, nombre: "Caloventor 2000w", costo: 14500, categoria: "climatizacion"}, // Updated category
    {id: 10, nombre: "Spray para aceite", costo: 4500, categoria: "cocina"}, // Updated category
    {id: 11, nombre: "Sarten multifuncion", costo: 12000, categoria: "cocina"}, // Updated category
    {id: 12, nombre: "Freidora de aire 3.2lts", costo: 45000, categoria: "freidora"},
    {id: 13, nombre: "Picadora manual", costo: 5000, categoria: "cocina"}, // Updated category
    {id: 14, nombre: "Freidora de aire 3.5lts tactil", costo: 55000, categoria: "freidora"},
    {id: 15, nombre: "Freidora de aire 5lts", costo: 66500, categoria: "freidora"},
    {id: 16, nombre: "Sandwichera 750w", costo: 15500, categoria: "cocina"}, // Updated category
    {id: 17, nombre: "Sandwichera 800w", costo: 17000, categoria: "cocina"}, // Updated category
    {id: 18, nombre: "Cactus bailarin", costo: 6900, categoria: "juguetes"}, // Updated category
    {id: 19, nombre: "Aro de luz 12\" 30cm", costo: 12000, categoria: "iluminacion"}, // Updated category
    {id: 20, nombre: "Secador de pelo plegable 1800W", costo: 20500, categoria: "cuidado personal"}, // Updated category
    {id: 21, nombre: "Auricular M25", costo: 5800, categoria: "auricular"},
    {id: 22, nombre: "Planchita flequillera", costo: 2600, categoria: "plancha"},
    {id: 23, nombre: "Cortadora de pelo Oryx color", costo: 8500, categoria: "cortadora"},
    {id: 24, nombre: "Lampara velador", costo: 8900, categoria: "iluminacion"}, // Updated category
    {id: 25, nombre: "Cortadora de pelo intima", costo: 24999, categoria: "cortadora"},
    {id: 26, nombre: "Cortadora de pelo patillera Oryx", costo: 8500, categoria: "cortadora"},
    {id: 27, nombre: "Cortadora de pelo con aspirado", costo: 16500, categoria: "cortadora"},
    {id: 28, nombre: "Planchita Oryx 230°", costo: 18500, categoria: "plancha"},
    {id: 29, nombre: "Planchita Osr 220°", costo: 8000, categoria: "plancha"},
    {id: 30, nombre: "Planchita Oryx 230° (modelo B)", costo: 18500, categoria: "plancha"}, // Modified slightly
    {id: 31, nombre: "Planchita nano titanium 250°", costo: 13000, categoria: "plancha"},
    {id: 32, nombre: "Cepillo 3 en 1 giratorio", costo: 19500, categoria: "cuidado personal"}, // Updated category
    {id: 33, nombre: "Secador 5 en 1 2000W", costo: 14500, categoria: "cuidado personal"}, // Updated category
    {id: 34, nombre: "Planchita buclera 2 en 1", costo: 9900, categoria: "plancha"},
    {id: 35, nombre: "Maquina para cortar pelo profesional DALING", costo: 14999, categoria: "cortadora"},
    {id: 36, nombre: "Soplador - Aspirador de hojas", costo: 53500, categoria: "herramientas"}, // Updated category
    {id: 37, nombre: "Sofa inflable 2 en 1", costo: 37500, categoria: "hogar"}, // Updated category
    {id: 38, nombre: "Lunchera hermetica con cubierto", costo: 9900, categoria: "cocina"}, // Updated category
    {id: 39, nombre: "Auricular i7 mini", costo: 5000, categoria: "auricular"},
    {id: 40, nombre: "Corta pelo profesional Daling (modelo premium)", costo: 17000, categoria: "cortadora"}, // Modified
    {id: 41, nombre: "Auricular M20", costo: 5000, categoria: "auricular"},
    {id: 42, nombre: "Juego de sabanas 4 piezas King", costo: 19000, categoria: "blanqueria"}, // Updated category
    {id: 43, nombre: "Juego de sabanas 4 piezas Queen", costo: 17500, categoria: "blanqueria"}, // Updated category
    {id: 44, nombre: "Lunchera hermetica con cubierto (modelo B)", costo: 9900, categoria: "cocina"}, // Modified
    {id: 45, nombre: "Parlante Bluetooth de diseño con luces led", costo: 28000, categoria: "tecnologia"}, // Updated category
    {id: 46, nombre: "Tira led usb 3mts", costo: 4900, categoria: "iluminacion"}, // Updated category
    {id: 47, nombre: "Auricular M20 (modelo B)", costo: 5000, categoria: "auricular"}, // Modified
    {id: 48, nombre: "Lampara silicona panda", costo: 8900, categoria: "iluminacion"}, // Updated category
    {id: 49, nombre: "Lampara animalitos", costo: 7500, categoria: "iluminacion"}, // Updated category
    {id: 50, nombre: "Auricular inalambrico M26", costo: 6000, categoria: "auricular"},
];

const newProductsRaw = `
Pulidora para autos: $61.900
Hidrolavadora inalambrica portatil: $39.000
Pulverizador a presión 5lts: Antes: $21.500, Despues: $18.499
Mandolina 22 piezas: $12.500
Anafe electrico 1000w: $12.500
Anafe vitroceramico 1500w: $37.900
Cartera capibara: $6.500
Depilador de cejas: $3.900
Corta pelo nariz 2 en 1: $5.900
Plumones doble punta x 24 unidades: $5.200
Touch 60 pc doble punta: $10.500
Touch 80 pc doble punta: $15.000
Espejo con luces led usb y a pila: $5.500
Convector electrico 2000w Con termostato regulable: $40.900
Convector electrico 2000w Con termostato regulable (Outlet): $38.900
Balanza digital hasta 180k: $8.999
Repetidor wifi: $12.000
Soporte de tv movil hasta 55": $7.900
Mini aspiradora 3 en 1: $5.900
Aspiradora industrial 15lts 1000W: $67.900
Aspiradora industrial 20lts 1000W: $76.000
Lampara Led usb: $15.500
Tira luces led color 5mt c/ fuente: $6.900
Auricular a prueba de agua: $5.500
Organizador de cocina o baño con rueditas: $14.500
Maquina de Donas: $28.900
Panquequera electrica 700w Incluye bowl y batidor: $18.000
Máquina de Cupcakes: $27.999
Pochoclera Eléctrica Oryx 1200w: $27.900
Horno electrico 10lts: $50.000
Licuadora 1.5lts jarra de vidrio: $37.000
Dispensador 6 compartimentos: $34.500
Dispensador de alimentos duo: $22.900
Picador de verdura electrico: $6.000
Pochoclera: $21.900
Pistola de pintura 650w: $21.500
Velador capibara (casa): $7.500
Velador capibara (osito): $6.900
Pulsera capibara: $6.000
Peluche capibara 20cm: $6.500
Columna de ducha monocomando (cromada, cuadrada): $65.000
Columna de ducha monocomando (negra, cuadrada): $65.000
Columna de ducha monocomando (cromada, redonda): $54.900
Canilla monocomando (negra, cuadrada): $14.900
Canilla monocomando (negra, redonda): $16.500
Sabanas Premium 4 piezas king: $20.500
Sabanas premium 4 piezas Queen: $19.000
Set de ollas x5 piezas antiadherente: $38.000
Set de ollas 9 piezas: $69.900
Kit 5pc utensilios de cocina silicona: $8.500
Freidora de aire 8 Lts, doble cajon: $85.500
Freidora de aire 10lts con parrilla para hacer spiedo: $88.000
Freidora de aire 8lts 2 en 1: $118.000
Freidora de aire 7 Lts (modelo B): $87.999
Freidora de aire 4Lts: $58.999
Parlante venus 35w 12": $79.900
Maquina de coser: $13.900
Combo dia del padre (Maquina corta pelo semi profesional + cortadora nariz y oreja 2 en 1): $20.000
Corta pelo semi profesional Daling (diseño dragón): $15.000
Corta pelo profesional Daling (diseño calavera): $17.000
Afeitadora 4 en 1: $30.000
Taladro de impacto: $35.500
Destornillador inalambrico: $51.000
Motosierra electrica: $39.000
Sierra caladora: $39.500
Soplador inalambrico: $29.500
Mixer 600w. 4 piezas: $34.500
Luz de emergencia 30leds: $4.700
Humidificador doble: $5.500
Humificador (simple): $6.000
Humidificador grande con control remoto: $19.500
`;

const parsePrice = (priceString: string): number => {
  return parseFloat(priceString.replace(/\./g, '').replace(',', '.'));
};

const inferCategory = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('pulidora') || lowerName.includes('hidrolavadora') || lowerName.includes('pulverizador') || lowerName.includes('pistola de pintura') || lowerName.includes('taladro') || lowerName.includes('destornillador') || lowerName.includes('motosierra') || lowerName.includes('sierra') || lowerName.includes('soplador') || lowerName.includes('industrial')) return 'Herramientas';
  if (lowerName.includes('mandolina') || lowerName.includes('anafe') || lowerName.includes('sandwichera') || lowerName.includes('dona') || lowerName.includes('panquequera') || lowerName.includes('cupcake') || lowerName.includes('pochoclera') || lowerName.includes('horno') || lowerName.includes('licuadora') || lowerName.includes('dispensador') || lowerName.includes('picador') || lowerName.includes('olla') || lowerName.includes('utensilio') || lowerName.includes('sarten') || lowerName.includes('bowl') || lowerName.includes('batidor') || lowerName.includes('cocina') || lowerName.includes('lunchera')) return 'Cocina';
  if (lowerName.includes('freidora')) return 'Freidora';
  if (lowerName.includes('termo')) return 'Termo';
  if (lowerName.includes('cartera') || lowerName.includes('pulsera')) return 'Accesorios';
  if (lowerName.includes('depilador') || lowerName.includes('corta pelo') || lowerName.includes('afeitadora') || lowerName.includes('ceja') || lowerName.includes('nariz') || lowerName.includes('secador de pelo') || lowerName.includes('planchita') || lowerName.includes('cepillo')) return 'Cuidado Personal';
  if (lowerName.includes('plumon') || lowerName.includes('touch') || lowerName.includes('libreria')) return 'Libreria';
  if (lowerName.includes('espejo') || lowerName.includes('balanza') || lowerName.includes('soporte tv') || lowerName.includes('organizador') || lowerName.includes('sofa') || lowerName.includes('maquina de coser')) return 'Hogar';
  if (lowerName.includes('convector') || lowerName.includes('estufa') || lowerName.includes('caloventor') || lowerName.includes('humidificador')) return 'Climatizacion';
  if (lowerName.includes('repetidor wifi') || lowerName.includes('parlante') || lowerName.includes('auricular')) return 'Tecnologia';
  if (lowerName.includes('lampara') || lowerName.includes('tira luces') || lowerName.includes('luz de emergencia') || lowerName.includes('velador') || lowerName.includes('aro de luz')) return 'Iluminacion';
  if (lowerName.includes('capibara')) return 'Capibara';
  if (lowerName.includes('columna de ducha') || lowerName.includes('canilla') || lowerName.includes('baño')) return 'Baño';
  if (lowerName.includes('sabana')) return 'Blanqueria';
  if (lowerName.includes('combo')) return 'Combos';
  if (lowerName.includes('cactus') || lowerName.includes('peluche')) return 'Juguetes';
  return 'Otros';
};

let maxId = userProducts.reduce((max, p) => Math.max(max, p.id), 0);
const existingProductNames = new Set(userProducts.map(p => p.nombre.trim().toLowerCase()));
const productsToAdd: {id: number; nombre: string; costo: number; categoria: string}[] = [];

const lines = newProductsRaw.trim().split('\n');
const skippedProducts: string[] = [];

lines.forEach(line => {
  line = line.replace('•', '').trim();
  if (!line) return;

  const parts = line.split(':');
  let nombre = parts[0].trim();
  let priceString = parts.slice(1).join(':').trim();
  let costo = 0;

  const antesDespuesMatch = priceString.match(/Antes: \$([\d\.]+),\s*Despues: \$([\d\.]+)/i);
  if (antesDespuesMatch) {
    costo = parsePrice(antesDespuesMatch[2]);
  } else {
    const priceMatch = priceString.match(/\$([\d\.]+)/);
    if (priceMatch) {
      costo = parsePrice(priceMatch[1]);
    } else {
      console.warn(`Could not parse price for: ${line}`);
      return; // Skip if price cannot be parsed
    }
  }

  let finalName = nombre;
  if (existingProductNames.has(finalName.toLowerCase())) {
      if (finalName.toLowerCase().includes("convector electrico 2000w con termostato regulable") && costo === 38900) {
          finalName = "Convector electrico 2000w Con termostato regulable (Outlet)";
      } else if (finalName.toLowerCase().includes("freidora de aire 7 lts") && costo === 87999) {
          finalName = "Freidora de aire 7 Lts (Alternativa)"; // Example, adjust as needed
      } else {
        // Check against original userProducts again, as finalName might have changed
        if (userProducts.some(up => up.nombre.trim().toLowerCase() === nombre.trim().toLowerCase())) {
            skippedProducts.push(nombre + " (Already in original list)");
            return;
        }
      }
  }

  // Check if the (potentially modified) finalName is already in the products to be added or existing ones
  if (!productsToAdd.some(pta => pta.nombre.trim().toLowerCase() === finalName.trim().toLowerCase()) &&
      !userProducts.some(up => up.nombre.trim().toLowerCase() === finalName.trim().toLowerCase())) {
    maxId++;
    const categoria = inferCategory(finalName);
    productsToAdd.push({ id: maxId, nombre: finalName, costo, categoria });
  } else {
     skippedProducts.push(nombre + " (Duplicate in new list or already exists with same final name)");
  }
});

userProducts.push(...productsToAdd);

export const mockProducts: Product[] = userProducts.map((p) => {
  const nameParts = p.nombre.split(' ');
  // Basic placeholder hint generation (was causing an error previously)
  let hintKeywords = p.category.toLowerCase(); // Use p.category
  if (nameParts.length > 0) {
    hintKeywords += " " + nameParts[0].toLowerCase();
  }

  const defaultImage = `https://placehold.co/600x400.png?text=${encodeURIComponent(p.nombre)}`;
  const defaultImage2 = `https://placehold.co/600x400.png?text=${encodeURIComponent(p.nombre)}+view2`;

  return {
    id: p.id.toString(),
    name: p.nombre,
    description: `Descripción detallada de ${p.nombre}. Ideal para ${p.categoria}.`,
    longDescription: `Una descripción más larga y completa sobre ${p.nombre}, sus características principales, usos y beneficios. Perfecto para quienes buscan calidad en ${p.categoria}.`,
    price: p.costo,
    currency: '$',
    category: p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1),
    images: [defaultImage, defaultImage2],
    stock: 5,
    featured: p.id % 7 === 0,
    brand: 'Marca Ejemplo',
    sku: generateSku(p.categoria, p.id.toString()),
    tags: [p.categoria.toLowerCase(), nameParts[0].toLowerCase(), ...(nameParts.length > 1 ? [nameParts[1].toLowerCase()] : [])].filter(tag => tag),
    specifications: [
        { key: 'Material', value: 'Material de ejemplo' },
        { key: 'Origen', value: 'Origen de ejemplo' },
    ] as ProductSpecification[],
    reviews: [] as ProductReview[],
  };
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

console.log(`Total products after additions: ${userProducts.length}`);
console.log(`Last product ID: ${maxId}`);
if (skippedProducts.length > 0) {
    console.warn("Skipped products due to duplication or being already present:", skippedProducts);
}
// console.log("Newly added products:", productsToAdd.map(p => `${p.id}: ${p.nombre} (${p.categoria}) - $${p.costo}`).join('\n'));
// console.log("Full product list for verification:", userProducts.map(p => `${p.id}: ${p.nombre}`).join('\n'));
    