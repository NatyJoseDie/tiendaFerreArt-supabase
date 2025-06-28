import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { productService } from '@/backFerre/services/product-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Sólo admin y reseller pueden ver un producto
  const user = await requireAuth(req, ['admin', 'reseller']);
  if (user instanceof NextResponse) return user;
  try {
    const product = await productService.getProductById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error in GET /api/products/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
}

import { ProductSchema } from '@/backFerre/types/zod-schemas';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Sólo admin puede actualizar un producto
  const user = await requireAuth(req, ['admin']);
  if (user instanceof NextResponse) return user;
  try {
    const updateData = await req.json();
    const parsed = ProductSchema.partial().safeParse(updateData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updatedProduct = await productService.updateProduct(
      params.id,
      parsed.data
    );
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Error in PATCH /api/products/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Sólo admin puede eliminar un producto
  const user = await requireAuth(req, ['admin']);
  if (user instanceof NextResponse) return user;
  try {
    const success = await productService.deleteProduct(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo eliminar el producto' },
        { status: 400 }
      );
    }
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error in DELETE /api/products/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
}
