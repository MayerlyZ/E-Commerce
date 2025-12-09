
'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './style.module.css';

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    material: '',
    imageUrl: '',
    imagePublicId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir a Cloudinary
    setIsUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir imagen');
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
        imagePublicId: data.public_id,
      }));

      toast.success('✅ Imagen subida correctamente');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      setImagePreview('');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      toast.error('Por favor sube una imagen');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          material: formData.material,
          image: formData.imageUrl,
          imagePublicId: formData.imagePublicId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el producto');
      }

      toast.success('¡Producto creado exitosamente!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        material: '',
        imageUrl: '',
        imagePublicId: '',
      });
      setImagePreview('');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Agregar Nuevo Producto</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label className={styles.label} htmlFor="name">
              Nombre del Producto
            </label>
            <input
              className={styles.input}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.group}>
            <label className={styles.label} htmlFor="description">
              Descripción
            </label>
            <textarea
              className={styles.textarea}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.group}>
            <label className={styles.label} htmlFor="price">
              Precio
            </label>
            <input
              className={styles.input}
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </div>

          <div className={styles.group}>
            <label className={styles.label} htmlFor="category">
              Categoría
            </label>
            <select
              className={styles.input}
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="productos">Productos</option>
              <option value="material">Material</option>
              <option value="descuentos">Descuentos</option>
            </select>
          </div>

          <div className={styles.group}>
            <label className={styles.label} htmlFor="material">
              Material
            </label>
            <input
              className={styles.input}
              type="text"
              id="material"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="e.g., Oro, Plata, Acero"
              required
            />
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Imagen del Producto</label>
            <div className={styles.imageUploadContainer}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className={styles.fileInput}
                id="image-input"
              />
              <label htmlFor="image-input" className={styles.imageUploadLabel}>
                {isUploadingImage ? '📤 Subiendo imagen...' : '📸 Selecciona una imagen'}
              </label>
            </div>
            {imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
              </div>
            )}
            {formData.imageUrl && (
              <p className={styles.successText}>✅ Imagen subida correctamente</p>
            )}
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Creando Producto...' : 'Crear Producto'}
          </button>
        </form>
      </div>
    </div>
  );
}
