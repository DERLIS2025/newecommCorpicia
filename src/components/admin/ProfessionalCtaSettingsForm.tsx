'use client';

import Image from 'next/image';
import {
  ChangeEvent,
  useRef,
  useState,
} from 'react';
import {
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { supabase } from '@/lib/supabase';

import {
  saveProfessionalCta,
} from '@/lib/actions/admin-professional-cta';

import type {
  ProfessionalCtaSettings,
} from '@/lib/repositories/professional-cta';

type ImageType = 'desktop' | 'mobile';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export function ProfessionalCtaSettingsForm({
  initialData,
}: {
  initialData: ProfessionalCtaSettings;
}) {
  const [data, setData] =
    useState<ProfessionalCtaSettings>(
      initialData
    );

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState<ImageType | null>(null);

  const [message, setMessage] =
    useState('');

  const [imageMessage, setImageMessage] =
    useState('');

  const desktopInputRef =
    useRef<HTMLInputElement>(null);

  const mobileInputRef =
    useRef<HTMLInputElement>(null);

  const update = (
    key: keyof ProfessionalCtaSettings,
    value: string | boolean
  ) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function uploadImage(
    file: File,
    type: ImageType
  ) {
    if (!supabase) {
      throw new Error(
        'Supabase no está configurado.'
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        'Solamente se permiten imágenes JPG, PNG o WebP.'
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        'La imagen supera el máximo de 5 MB.'
      );
    }

    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase() || 'webp';

    const fileName =
      `${type}-${crypto.randomUUID()}.${extension}`;

    const filePath =
      `professional-cta/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(
        filePath,
        file,
        {
          cacheControl: '31536000',
          upsert: false,
          contentType: file.type,
        }
      );

    if (error) {
      throw error;
    }

    const { data: publicData } =
      supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

    return publicData.publicUrl;
  }

  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
    type: ImageType
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageMessage('');
    setUploading(type);

    try {
      const publicUrl =
        await uploadImage(file, type);

      setData((current) => ({
        ...current,

        ...(type === 'desktop'
          ? {
              desktop_image_url:
                publicUrl,

              // Compatibilidad anterior
              image_url: publicUrl,
            }
          : {
              mobile_image_url:
                publicUrl,
            }),
      }));

      setImageMessage(
        type === 'desktop'
          ? 'Imagen Desktop subida correctamente.'
          : 'Imagen Mobile subida correctamente.'
      );
    } catch (error) {
      setImageMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo subir la imagen.'
      );
    } finally {
      setUploading(null);

      if (desktopInputRef.current) {
        desktopInputRef.current.value = '';
      }

      if (mobileInputRef.current) {
        mobileInputRef.current.value = '';
      }
    }
  }

  function removeImage(
    type: ImageType
  ) {
    setData((current) => ({
      ...current,

      ...(type === 'desktop'
        ? {
            desktop_image_url: '',
            image_url: '',
          }
        : {
            mobile_image_url: '',
          }),
    }));

    setImageMessage(
      type === 'desktop'
        ? 'Imagen Desktop quitada.'
        : 'Imagen Mobile quitada.'
    );
  }

  async function save() {
    if (saving) {
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const result =
        await saveProfessionalCta(data);

      if (result.success) {
        setMessage(
          '✅ Configuración guardada correctamente.'
        );
      } else {
        setMessage(
          result.error ||
            'No se pudo guardar.'
        );
      }
    } catch {
      setMessage(
        'No se pudo guardar la configuración.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-7">
      <label className="flex items-center gap-3 rounded-xl border bg-gray-50 p-4 text-sm font-medium">
        <input
          type="checkbox"
          checked={data.enabled}
          onChange={(event) =>
            update(
              'enabled',
              event.target.checked
            )
          }
          className="h-4 w-4"
        />

        Mostrar sección en la página principal
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label>
            Texto superior
          </Label>

          <Input
            value={data.eyebrow}
            onChange={(event) =>
              update(
                'eyebrow',
                event.target.value
              )
            }
            className="mt-1"
            placeholder="Beneficios para profesionales"
          />
        </div>

        <div>
          <Label>
            Texto del botón
          </Label>

          <Input
            value={data.button_text}
            onChange={(event) =>
              update(
                'button_text',
                event.target.value
              )
            }
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>
          Título principal
        </Label>

        <Input
          value={data.title}
          onChange={(event) =>
            update(
              'title',
              event.target.value
            )
          }
          className="mt-1"
        />
      </div>

      <div>
        <Label>
          Descripción
        </Label>

        <textarea
          value={data.description}
          onChange={(event) =>
            update(
              'description',
              event.target.value
            )
          }
          rows={4}
          className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <Label>
          Mensaje automático de WhatsApp
        </Label>

        <textarea
          value={data.whatsapp_message}
          onChange={(event) =>
            update(
              'whatsapp_message',
              event.target.value
            )
          }
          rows={3}
          className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="border-t pt-7">
        <h2 className="text-lg font-semibold">
          Imágenes responsive
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Cargá una imagen horizontal para escritorio y otra adaptada para celulares.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ImageUploaderCard
          title="Imagen Desktop"
          description="Recomendado: horizontal, aproximadamente 1600 × 1000 px."
          imageUrl={
            data.desktop_image_url
          }
          aspectClass="aspect-[16/10]"
          inputRef={desktopInputRef}
          loading={
            uploading === 'desktop'
          }
          onSelect={(event) =>
            handleImageChange(
              event,
              'desktop'
            )
          }
          onRemove={() =>
            removeImage('desktop')
          }
        />

        <ImageUploaderCard
          title="Imagen Mobile"
          description="Recomendado: vertical, aproximadamente 1080 × 1350 px."
          imageUrl={
            data.mobile_image_url
          }
          aspectClass="aspect-[4/5]"
          inputRef={mobileInputRef}
          loading={
            uploading === 'mobile'
          }
          onSelect={(event) =>
            handleImageChange(
              event,
              'mobile'
            )
          }
          onRemove={() =>
            removeImage('mobile')
          }
        />
      </div>

      {imageMessage ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            imageMessage.includes(
              'correctamente'
            )
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-gray-200 bg-gray-50 text-gray-700'
          }`}
        >
          {imageMessage}
        </div>
      ) : null}

      {message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.includes('✅')
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      ) : null}

      <Button
        type="button"
        onClick={save}
        disabled={
          saving ||
          uploading !== null
        }
        className="min-h-12 w-full"
      >
        {saving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}

        {saving
          ? 'Guardando...'
          : 'Guardar sección'}
      </Button>
    </div>
  );
}

function ImageUploaderCard({
  title,
  description,
  imageUrl,
  aspectClass,
  inputRef,
  loading,
  onSelect,
  onRemove,
}: {
  title: string;
  description: string;
  imageUrl: string;
  aspectClass: string;
  inputRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
  onSelect: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>{title}</Label>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onSelect}
      />

      {imageUrl ? (
        <div className="overflow-hidden rounded-xl border bg-gray-50">
          <div
            className={`relative w-full ${aspectClass}`}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex gap-2 p-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() =>
                inputRef.current?.click()
              }
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}

              Reemplazar
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onRemove}
              disabled={loading}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            inputRef.current?.click()
          }
          className={`flex w-full ${aspectClass} flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-6 text-center transition hover:border-green-500 hover:bg-green-100 disabled:opacity-60`}
        >
          {loading ? (
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-green-700" />
          ) : (
            <ImagePlus className="mb-3 h-9 w-9 text-green-700" />
          )}

          <span className="font-medium text-gray-900">
            {loading
              ? 'Subiendo...'
              : `Subir ${title}`}
          </span>

          <span className="mt-1 text-xs text-gray-500">
            JPG, PNG o WebP · máximo 5 MB
          </span>
        </button>
      )}
    </div>
  );
}
