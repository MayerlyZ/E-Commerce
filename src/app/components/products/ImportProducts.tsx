'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from '@/app/components/admin/admin.module.css';

interface ImportedProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku?: string;
}

interface ImportProductsProps {
  onImportSuccess: () => void;
}

export default function ImportProducts({ onImportSuccess }: ImportProductsProps) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const parseCSV = (content: string): ImportedProduct[] => {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const products: ImportedProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length === 1 && values[0] === '') continue;

      const product: ImportedProduct = {
        name: values[headers.indexOf('name')] || '',
        description: values[headers.indexOf('description')] || '',
        price: parseFloat(values[headers.indexOf('price')]) || 0,
        stock: parseInt(values[headers.indexOf('stock')]) || 0,
        category: values[headers.indexOf('category')] || 'productos',
        sku: values[headers.indexOf('sku')] || undefined,
      };

      if (product.name) {
        products.push(product);
      }
    }

    return products;
  };

  const parseJSON = (content: string): ImportedProduct[] => {
    try {
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw new Error('JSON inválido');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const content = await file.text();
      let products: ImportedProduct[] = [];

      if (file.name.endsWith('.csv')) {
        products = parseCSV(content);
      } else if (file.name.endsWith('.json')) {
        products = parseJSON(content);
      } else {
        throw new Error('Formato no soportado. Usa .csv o .json');
      }

      if (products.length === 0) {
        throw new Error('No se encontraron productos en el archivo');
      }

      // Enviar productos al servidor
      const response = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al importar productos');
      }

      toast.success(`✅ ${result.imported} productos importados exitosamente`);
      onImportSuccess();
      setFileName('');
      
      // Limpiar input
      e.target.value = '';
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.importSection}>
      <h3 className={styles.importTitle}>📥 Importar Productos desde Archivo</h3>
      
      <div className={styles.importContainer}>
        <div className={styles.fileInputWrapper}>
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            disabled={loading}
            id="file-input"
            className={styles.fileInput}
          />
          <label htmlFor="file-input" className={styles.fileInputLabel}>
            {loading ? 'Importando...' : fileName || 'Selecciona un archivo CSV o JSON'}
          </label>
        </div>
      </div>

      <div className={styles.importInfo}>
        <p><strong>Formato CSV:</strong></p>
        <code>name,description,price,stock,category,sku</code>
        
        <p style={{ marginTop: '1rem' }}><strong>Formato JSON:</strong></p>
        <code>
          {`[
  {
    "name": "Producto",
    "description": "Descripción",
    "price": 99.99,
    "stock": 10,
    "category": "productos",
    "sku": "SKU123"
  }
]`}
        </code>

        <p style={{ marginTop: '1rem' }}><strong>📸 Para las imágenes:</strong></p>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Carga las imágenes de los productos de forma individual en el formulario "Crear Producto".
        </p>
      </div>
    </div>
  );
}
