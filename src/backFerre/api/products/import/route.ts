import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { ProductService } from '../../../services/product-service';
import { CreateProductDTO } from '../../../types/product';
import { ProductSchema } from '../../../types/zod-schemas';

const productService = ProductService.getInstance();

import { requireAuth } from '../../../../middleware/auth';

export async function POST(req: NextRequest) {
  // Sólo admin puede importar productos
  const user = await requireAuth(req, ['admin']);
  if (user instanceof Response) return user;
  try {
    const formData = await req.formData();
    const file = formData.get('excel') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }
    
    // Leer archivo Excel
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    const results = [];
    
    for (const row of data as Record<string, any>[]) {
      try {
        // Mapear columnas Excel a estructura backFerre
        const productData = {
          name: row['nombre'] || row['Nombre'] || '',
          description: row['descripcion'] || row['Descripcion'] || null,
          cost_price: parseFloat(row['precio_compra'] || row['Precio_Compra'] || '0') || null,
          stock: parseInt(row['stock'] || row['Stock'] || '0'),
          category: row['categoria'] || row['Categoria'] || 'General',
          image_url: row['imagen_url'] || row['Imagen_URL'] || null,
          sku: row['codigo'] || row['Codigo'] || null
        };
        
        // Validar producto con Zod
        const parsed = ProductSchema.safeParse(productData);
        if (!parsed.success) {
          results.push({ success: false, error: parsed.error.flatten(), row });
          continue;
        }
        
        const data = parsed.data as CreateProductDTO;

        // Buscar producto existente por SKU (código)
        const existingProduct = data.sku ? await productService.findBySku(data.sku) : null;
        if (existingProduct) {
          // Actualizar producto existente
          await productService.updateProduct(existingProduct.id, data);
          results.push({ success: true, updated: true, sku: data.sku });
        } else {
          // Crear producto nuevo
          const newProduct = await productService.createProduct(data);
          results.push({ success: true, created: true, sku: newProduct.sku });
        }
      } catch (error: any) {
        results.push({ 
          success: false, 
          error: error.message,
          row: row 
        });
      }
    }
    
    return NextResponse.json({
      message: `Procesados ${results.length} productos`,
      results: results
    });
    
  } catch (error: any) {
    console.error('Error en importación:', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo Excel' },
      { status: 500 }
    );
  }
}