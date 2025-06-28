import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Función para generar SKU
function generateSKU(categoria: string, index: number): string {
  const categoryMap: { [key: string]: string } = {
    'freidora': 'FRE',
    'termo': 'TER',
    'cocina': 'COC',
    'climatizacion': 'CLI',
    'auricular': 'AUR',
    'plancha': 'PLA',
    'cortadora': 'COR',
    'iluminacion': 'ILU',
    'herramientas': 'HER',
    'tecnologia': 'TEC',
    'otros': 'OTR'
  };
  
  const prefix = categoryMap[categoria] || 'GEN';
  return `${prefix}-${index.toString().padStart(4, '0')}`;
}

// Función para generar descripción básica
function generateDescription(nombre: string, categoria: string): string {
  return `${nombre} - Producto de alta calidad en la categoría ${categoria}.`;
}

// Función para asignar imagen por defecto
// Función para asignar imagen por defecto
function getDefaultImageUrl(categoria: string): string {
  const imageMap: Record<string, string> = {
    'Climatizacion': '/images/placeholders/climatizacion.jpg',
    'Cocina': '/images/placeholders/cocina.jpg',
    'Iluminacion': '/images/placeholders/iluminacion.jpg',
    'Blanqueria': '/images/placeholders/blanqueria.jpg',
    'Tecnologia': '/images/placeholders/tecnologia.jpg',
    'Herramientas': '/images/placeholders/herramientas.jpg',
    'Decoracion': '/images/placeholders/decoracion.jpg',
    'Jardin': '/images/placeholders/jardin.jpg'
  };
  
  return imageMap[categoria] || '/images/placeholders/producto-default.jpg';
}

async function migrateProducts() {
  // Importar productos desde mock-products.ts
  const { userProducts, newProductsRaw } = await import('../data/mock-products');
  
  // Migrar productos existentes
  for (let i = 0; i < userProducts.length; i++) {
    const product = userProducts[i];
    const sku = generateSKU(product.categoria, i + 1);
    
    const { error } = await supabase.from('products').insert({
      sku,
      name: product.nombre,
      description: generateDescription(product.nombre, product.categoria),
      cost_price: product.costo,
      category: product.categoria,
      stock: 10, // Stock inicial por defecto
      image_url: getDefaultImageUrl(product.categoria)
    });
    
    if (error) {
      console.error(`Error insertando producto ${product.nombre}:`, error);
    } else {
      console.log(`✅ Migrado: ${sku} - ${product.nombre}`);
    }
  }
  
  console.log('🎉 Migración completada!');
}

migrateProducts();