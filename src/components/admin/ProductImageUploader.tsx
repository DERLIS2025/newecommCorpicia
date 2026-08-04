'use client';

import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { ImagePlus, Loader2, Star, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export interface ProductImageItem {
  image_url: string;
  is_main: boolean;
  order_index?: number;
}

interface ProductImageUploaderProps {
  images: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function sanitizeFileName(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() || 'webp';

  const baseName = fileName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${baseName || 'producto'}-${Date.now()}.${extension}`;
}

export default function ProductImageUploader({
  images,
  onChange,
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSelectFiles = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    if (!supabase) {
      setMessage('Supabase no está configurado.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const uploadedImages: ProductImageItem[] = [];

      for (const file of files) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(
            `${file.name}: solamente se permiten JPG, PNG o WebP.`
          );
        }

        if (file.size > MAX_FILE_SIZE) {
          throw new Error(
            `${file.name}: la imagen supera el máximo de 5 MB.`
          );
        }

        const fileName = sanitizeFileName(file.name);
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '31536000',
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedImages.push({
          image_url: data.publicUrl,
          is_main: false,
        });
      }

      const validCurrentImages = images.filter(
        (image) => image.image_url?.trim()
      );

      const combined = [...validCurrentImages, ...uploadedImages].map(
        (image, index) => ({
          ...image,
          is_main:
            validCurrentImages.length === 0
              ? index === 0
              : image.is_main,
          order_index: index,
        })
      );

      onChange(combined);
      setMessage(
        uploadedImages.length === 1
          ? 'Imagen subida correctamente.'
          : `${uploadedImages.length} imágenes subidas correctamente.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo subir la imagen.'
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const setMainImage = (selectedIndex: number) => {
    onChange(
      images.map((image, index) => ({
        ...image,
        is_main: index === selectedIndex,
        order_index: index,
      }))
    );
  };

  const removeImage = (selectedIndex: number) => {
    const remaining = images
      .filter((_, index) => index !== selectedIndex)
      .map((image, index) => ({
        ...image,
        order_index: index,
      }));

    if (
      remaining.length > 0 &&
      !remaining.some((image) => image.is_main)
    ) {
      remaining[0].is_main = true;
    }

    onChange(remaining);
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleSelectFiles}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-300 bg-green-50 px-6 py-8 text-center transition hover:border-green-500 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="mb-3 h-9 w-9 animate-spin text-green-700" />
        ) : (
          <ImagePlus className="mb-3 h-10 w-10 text-green-700" />
        )}

        <span className="font-medium text-gray-900">
          {uploading
            ? 'Subiendo imágenes...'
            : 'Hacé clic para subir imágenes'}
        </span>

        <span className="mt-1 text-sm text-gray-500">
          JPG, PNG o WebP · máximo 5 MB por imagen
        </span>
      </button>

      {message && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            message.includes('correctamente')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={`${image.image_url}-${index}`}
              className={`overflow-hidden rounded-xl border bg-white ${
                image.is_main
                  ? 'border-green-500 ring-2 ring-green-100'
                  : 'border-gray-200'
              }`}
            >
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={image.image_url}
                  alt={`Imagen ${index + 1} del producto`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain"
                />

                {image.is_main && (
                  <span className="absolute left-2 top-2 rounded-full bg-green-700 px-3 py-1 text-xs font-medium text-white">
                    Principal
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 p-3">
                <Button
                  type="button"
                  size="sm"
                  variant={image.is_main ? 'secondary' : 'outline'}
                  disabled={image.is_main}
                  onClick={() => setMainImage(index)}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {image.is_main
                    ? 'Imagen principal'
                    : 'Elegir principal'}
                </Button>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => removeImage(index)}
                  aria-label="Eliminar imagen"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Agregar más imágenes
      </Button>
    </div>
  );
}
