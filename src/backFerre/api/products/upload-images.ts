import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../middleware/auth';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { supabase } from '../../lib/supabase-client';
import productService from '../../services/product-service';

// Permite solo POST y solo admin/reseller
export async function POST(req: NextRequest) {
  // Verifica autenticación y rol
  const user = await requireAuth(req, ['admin', 'reseller']);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Procesa archivos multipart/form-data
  const formData = await req.formData();
  const files = formData.getAll('files');
  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No se recibieron archivos' }, { status: 400 });
  }

  const results = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;
    const originalName = file.name;
    const [sku] = originalName.split('.');
    try {
      // Sube la imagen a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`${sku}/${originalName}`, file, { upsert: true });
      if (uploadError) throw uploadError;

      // Obtiene URL pública
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(`${sku}/${originalName}`);
      const imageUrl = publicUrlData.publicUrl;

      // Busca producto por SKU/codigo
      const product = await productService.findByCodigo(sku);
      if (!product) {
        results.push({ file: originalName, sku, success: false, error: 'Producto no encontrado' });
        continue;
      }

      // Actualiza producto con URL de imagen
      await productService.update(product.id, { imagen_url: imageUrl });
      results.push({ file: originalName, sku, success: true, productId: product.id, imageUrl });
    } catch (err: any) {
      results.push({ file: originalName, sku, success: false, error: err.message || 'Error inesperado' });
    }
  }

  return NextResponse.json({ results });
}

export const config = {
  api: {
    bodyParser: false, // Importante para manejar formData
  },
};
