'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar favoritos del localStorage
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(favs);
    setLoading(false);
  }, []);

  const handleRemoveFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(item => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    toast.success('Removido de favoritos');
  };

  const handleAddToCart = (item: FavoriteItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find((cartItem: any) => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Agregado al carrito');
  };

  const handleClearFavorites = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar los favoritos?')) {
      setFavorites([]);
      localStorage.setItem('favorites', JSON.stringify([]));
      toast.success('Favoritos limpiados');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando favoritos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-olas-light to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-playfair mb-8 text-olas-dark text-center">Mis Favoritos</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-6">No tienes favoritos aún</p>
            <a
              href="/productos"
              className="inline-block bg-olas-dark text-olas-light px-8 py-3 rounded-full hover:bg-opacity-90 transition"
            >
              Explorar Productos
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  {item.image && (
                    <div className="h-48 bg-olas-light flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-olas-dark mb-2">
                      {item.name}
                    </h3>
                    
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-playfair text-olas-dark">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveFavorite(item.id)}
                        className="text-red-500 hover:text-red-700 text-xl transition"
                        title="Remover de favoritos"
                      >
                        ❤️
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-olas-dark text-olas-light py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleClearFavorites}
                className="bg-gray-300 text-olas-dark px-8 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Limpiar Favoritos
              </button>
              <a
                href="/productos"
                className="bg-olas-light text-olas-dark px-8 py-3 rounded-lg hover:bg-opacity-80 transition font-semibold"
              >
                Seguir Comprando
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
