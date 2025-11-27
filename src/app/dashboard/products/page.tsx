import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Mis Productos</h1>
      {/* Aquí se mostrarán los productos del usuario */}
      <Link href="/products/add">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Agregar Producto
        </button>
      </Link>
    </div>
  );
}
