
"use client";

import { useState } from 'react';
import styles from './dashboard.module.css';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: string;
  sku: string;
}

export default function DashboardPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: 'productos',
    image: '',
    stock: '',
    sku: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validar campos requeridos
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

      setMessage({
        type: 'success',
        text: '✅ Producto creado exitosamente',
      });

      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'productos',
        image: '',
        stock: '',
        sku: '',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `❌ ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard - Crear Producto</h1>
        <p className={styles.subtitle}>Agrega nuevos productos a tu tienda</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre del Producto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Pulsera de perlas"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el producto"
              className={styles.textarea}
              rows={4}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Precio ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="stock" className={styles.label}>
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="productos">Productos</option>
                <option value="material">Material</option>
                <option value="descuentos">Descuentos</option>
                <option value="novedades">Novedades</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="sku" className={styles.label}>
                SKU (Opcional)
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Código de producto"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              URL de Imagen (Opcional)
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className={styles.input}
            />
          </div>

          {message && (
            <div
              className={`${styles.message} ${
                message.type === 'success' ? styles.successMessage : styles.errorMessage
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'Creando producto...' : '✨ Crear Producto'}
          </button>
        </form>
      </div>
    </main>
  );
}

