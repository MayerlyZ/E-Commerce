import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Product from '@/models/product';

// GET - Obtener todos los productos o filtrar por categoría
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = {};
    if (category) {
      query = { category, isActive: true };
    } else {
      query = { isActive: true };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const product = new Product({
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      image: body.image,
      stock: body.stock || 0,
      sku: body.sku,
    });

    const savedProduct = await product.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Producto creado exitosamente',
        data: savedProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 }
    );
  }
}
