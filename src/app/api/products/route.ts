import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/backFerre/services/product-service';

// Evitar cacheo en el servidor
export const revalidate = 0;

const productService = ProductService.getInstance();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const modo = searchParams.get('modo');
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '150', 10);

    if (modo === 'costosPrivados') {
      const products = await productService.getCostosPrivadosProducts({ offset, limit });
      
      return NextResponse.json(products, { status: 200 });
    }

    // Modo por defecto: obtener todos los productos con paginación
    const products = await productService.getAllProducts({ offset, limit });
    return NextResponse.json(products, { status: 200 });

  } catch (error: any) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { message: 'Error al obtener los productos', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const productData: any = {};
    let imageFile: File | null = null;

    formData.forEach((value, key) => {
      if (key === 'image') {
        imageFile = value as File;
      } else {
        productData[key] = value;
      }
    });

    // Lógica para subir imagen y crear producto (se completará en el siguiente paso)
    const newProduct = await productService.createProductWithImage(productData, imageFile);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error en POST /api/products:", error);
    return NextResponse.json(
      { message: "Error al crear producto", error: error.message },
      { status: 500 }
    );
  }
}

