import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Product from '@/models/product';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { products } = await request.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'No products provided' },
        { status: 400 }
      );
    }

    // Validar y procesar productos
    const validProducts = products.map((product: any) => ({
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price) || 0,
      stock: parseInt(product.stock) || 0,
      category: product.category || 'productos',
      sku: product.sku || `SKU-${Date.now()}-${Math.random()}`,
      image: product.image || '',
      isActive: true,
      createdAt: new Date(),
    }));

    // Insertar múltiples productos
    const result = await Product.insertMany(validProducts);

    return NextResponse.json(
      {
        success: true,
        imported: result.length,
        message: `${result.length} productos importados exitosamente`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al importar productos',
      },
      { status: 500 }
    );
  }
}
