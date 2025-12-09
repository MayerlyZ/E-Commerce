'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar carrito del localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setLoading(false);
  }, []);

  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Producto removido del carrito');
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      setCartItems([]);
      localStorage.setItem('cart', JSON.stringify([]));
      toast.success('Carrito vaciado');
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-olas-light to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-playfair mb-8 text-olas-dark text-center">Mi Carrito</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-6">Tu carrito está vacío</p>
            <a
              href="/productos"
              className="inline-block bg-olas-dark text-olas-light px-8 py-3 rounded-full hover:bg-opacity-90 transition"
            >
              Continuar Comprando
            </a>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-olas-light">
                    <th className="text-left py-4 text-olas-dark">Producto</th>
                    <th className="text-center py-4 text-olas-dark">Cantidad</th>
                    <th className="text-right py-4 text-olas-dark">Precio</th>
                    <th className="text-right py-4 text-olas-dark">Total</th>
                    <th className="text-center py-4 text-olas-dark">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-olas-light hover:bg-opacity-30 transition">
                      <td className="py-4 text-olas-dark">{item.name}</td>
                      <td className="text-center py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="bg-olas-light text-olas-dark px-2 py-1 rounded hover:bg-opacity-80 transition"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 border border-olas-light rounded">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="bg-olas-light text-olas-dark px-2 py-1 rounded hover:bg-opacity-80 transition"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-right py-4 text-olas-dark">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="text-right py-4 text-olas-dark font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="text-center py-4">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 font-semibold transition"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl text-olas-dark font-semibold">Total:</span>
                <span className="text-3xl font-playfair text-olas-dark">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleClearCart}
                  className="flex-1 bg-gray-300 text-olas-dark py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Vaciar Carrito
                </button>
                <a
                  href="/productos"
                  className="flex-1 bg-olas-light text-olas-dark py-3 rounded-lg hover:bg-opacity-80 transition font-semibold text-center"
                >
                  Continuar Comprando
                </a>
                <button
                  className="flex-1 bg-olas-dark text-olas-light py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
                >
                  Proceder al Pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
