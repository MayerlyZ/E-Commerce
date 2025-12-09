'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import styles from './productos.module.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: string;
  sku: string;
}

export default function ProductosPage() {
  const [session, setSession] = useState<{ user?: { email: string } } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: 'productos',
    image: '',
    stock: '',
    sku: '',
  });

  useEffect(() => {
    // Verificar sesión
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        }
      } catch (err) {
        console.log('No hay sesión activa');
      }
    };

    // Cargar favoritos del localStorage
    const saveFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saveFavorites.map((fav: any) => fav.id));

    checkSession();
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/api/products?category=${selectedCategory}`
        : '/api/products';

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar productos');
      }

      setProducts(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage(null);

    try {
      if (!formData.name || !formData.description || !formData.price || !formData.stock) {
        throw new Error('Por favor, completa todos los campos requeridos');
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || null,
        stock: parseInt(formData.stock),
        sku: formData.sku || null,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el producto');
      }

      setFormMessage({
        type: 'success',
        text: '✅ Producto creado exitosamente',
      });

      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'productos',
        image: '',
        stock: '',
        sku: '',
      });

      // Recargar productos después de 1 segundo
      setTimeout(() => {
        fetchProducts();
        setShowModal(false);
      }, 1000);
    } catch (error: any) {
      setFormMessage({
        type: 'error',
        text: `❌ ${error.message}`,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const categories = [
    { value: '', label: 'Todos los productos' },
    { value: 'productos', label: 'Productos' },
    { value: 'material', label: 'Material' },
    { value: 'descuentos', label: 'Descuentos' },
    { value: 'novedades', label: 'Novedades' },
  ];

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleToggleFavorite = (product: Product) => {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorite = favorites.includes(product._id);

    if (isFavorite) {
      favs = favs.filter((fav: any) => fav.id !== product._id);
      setFavorites(favorites.filter(id => id !== product._id));
      toast.success(`${product.name} removido de favoritos`);
    } else {
      favs.push({
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
      });
      setFavorites([...favorites, product._id]);
      toast.success(`${product.name} agregado a favoritos`);
    }

    localStorage.setItem('favorites', JSON.stringify(favs));
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nuestros Productos</h1>
        <p className={styles.subtitle}>Descubre nuestras colecciones exclusivas</p>
      </div>

      {/* Filtros de categoría */}
      <div className={styles.filterSection}>
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.filterBtn} ${
                selectedCategory === cat.value ? styles.active : ''
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className={styles.loading}>
          <p>Cargando productos...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>❌ {error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay productos disponibles en esta categoría.</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              {product.image ? (
                <div className={styles.imageContainer}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={styles.productImage}
                  />
                </div>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <p>Sin imagen</p>
                </div>
              )}

              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>{product.description}</p>

                <div className={styles.productFooter}>
                  <div className={styles.priceStock}>
                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                    <span
                      className={`${styles.stock} ${
                        product.stock > 0 ? styles.inStock : styles.outOfStock
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                    </span>
                  </div>

                  <div className={styles.actions}>
                    <button
                      className={styles.addToCart}
                      disabled={product.stock === 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.stock > 0 ? '🛒 Añadir' : 'Agotado'}
                    </button>
                    <button
                      className={styles.favoriteBtn}
                      onClick={() => handleToggleFavorite(product)}
                      title={favorites.includes(product._id) ? 'Remover de favoritos' : 'Agregar a favoritos'}
                    >
                      {favorites.includes(product._id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón flotante + (solo para admin) */}
      {session?.user && (
        <>
          <button
            className={styles.floatingButton}
            onClick={() => setShowModal(true)}
            title="Crear nuevo producto"
          >
            +
          </button>

          {/* Modal */}
          {showModal && (
            <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>Crear Nuevo Producto</h2>
                  <button
                    className={styles.closeBtn}
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className={styles.formModal}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Nombre *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Nombre del producto"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description">Descripción *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Descripción"
                      rows={3}
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="price">Precio ($) *</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="stock">Stock *</label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleFormChange}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="category">Categoría *</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="productos">Productos</option>
                        <option value="material">Material</option>
                        <option value="descuentos">Descuentos</option>
                        <option value="novedades">Novedades</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="sku">SKU</label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleFormChange}
                        placeholder="Código"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="image">URL Imagen</label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      placeholder="https://..."
                    />
                  </div>

                  {formMessage && (
                    <div
                      className={`${styles.message} ${
                        formMessage.type === 'success'
                          ? styles.successMessage
                          : styles.errorMessage
                      }`}
                    >
                      {formMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formLoading}
                    className={styles.submitBtn}
                  >
                    {formLoading ? 'Creando...' : '✨ Crear Producto'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
