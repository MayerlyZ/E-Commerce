'use client';

import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError: (error: string) => void;
}

export default function CloudinaryUpload({ onUploadSuccess, onUploadError }: CloudinaryUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir a Cloudinary
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error uploading file');
      }

      toast.success('Imagen subida exitosamente');
      onUploadSuccess(data.url, data.public_id);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al subir la imagen';
      toast.error(errorMessage);
      onUploadError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        style={{
          padding: '12px 20px',
          backgroundColor: isLoading ? '#999' : '#6F1A07',
          color: '#FFFAEF',
          border: 'none',
          borderRadius: '8px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
          transition: 'all 300ms ease-in-out',
          opacity: isLoading ? '0.6' : '1',
        }}
      >
        {isLoading ? 'Subiendo...' : 'Seleccionar Imagen'}
      </button>

      {preview && (
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px', height: '200px' }}>
          <Image
            src={preview}
            alt="Preview"
            fill
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
}
