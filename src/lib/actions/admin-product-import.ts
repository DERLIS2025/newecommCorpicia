'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import * as XLSX from 'xlsx';

export type BulkProductRow = {
  name: string;
  slug: string;
  category?: string;
  description?: string;
  short_description?: string;
  price_amount: number;
  unit: string;
  min_order_quantity?: number;
  is_active?: boolean;
  is_featured?: boolean;
  image_url?: string;
};

export type ImportResult = {
  success: boolean;
  created: number;
  updated: number;
  failed: number;
  rows: Array<{
    row: number;
    slug?: string;
    status: 'created' | 'updated' | 'error';
    message: string;
  }>;
};

function normalizeBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;

  const normalized = String(value ?? '').trim().toLowerCase();

  if (['true', '1', 'sí', 'si', 'yes', 'activo'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'inactivo'].includes(normalized)) {
    return false;
  }

  return fallback;
}

function normalizeRow(row: Record<string, unknown>): BulkProductRow {
  return {
    name: String(row.name ?? row.nombre ?? '').trim(),
    slug: String(row.slug ?? '').trim().toLowerCase(),
    category: String(row.category ?? row.categoria ?? '').trim(),
    description: String(row.description ?? row.descripcion ?? '').trim(),
    short_description: String(
      row.short_description ?? row.descripcion_corta ?? ''
    ).trim(),
    price_amount: Number(
      row.price_amount ?? row.precio ?? row.precio_base ?? 0
    ),
    unit: String(row.unit ?? row.unidad ?? '').trim(),
    min_order_quantity: Number(
      row.min_order_quantity ?? row.cantidad_minima ?? 1
    ),
    is_active: normalizeBoolean(row.is_active ?? row.activo, true),
    is_featured: normalizeBoolean(
      row.is_featured ?? row.destacado,
      false
    ),
    image_url: String(row.image_url ?? row.imagen ?? '').trim(),
  };
}

async function verifyAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autorizado. Iniciá sesión nuevamente.');
  }

  if (process.env.ADMIN_WRITES_ENABLED !== 'true') {
    throw new Error('Las escrituras están deshabilitadas.');
  }

  if (!supabaseAdmin) {
    throw new Error('Supabase administrativo no está configurado.');
  }
}

export async function importProducts(
  inputRows: BulkProductRow[]
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    created: 0,
    updated: 0,
    failed: 0,
    rows: [],
  };

  try {
    await verifyAdmin();

    const workingResult: ImportResult = {
      success: true,
      created: 0,
      updated: 0,
      failed: 0,
      rows: [],
    };

    const result = workingResult;

  const { data: categories, error: categoryError } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug');

  if (categoryError) {
    throw new Error('No se pudieron consultar las categorías.');
  }

  const categoryMap = new Map<string, string>();

  for (const category of categories ?? []) {
    categoryMap.set(category.slug.toLowerCase(), category.id);
    categoryMap.set(category.name.toLowerCase(), category.id);
  }

  for (let index = 0; index < inputRows.length; index += 1) {
    const rowNumber = index + 2;
    const row = normalizeRow(inputRows[index] as unknown as Record<string, unknown>);

    try {
      if (!row.name) throw new Error('Falta el nombre.');
      if (!row.slug) throw new Error('Falta el slug.');
      if (!row.unit) throw new Error('Falta la unidad.');

      if (!Number.isFinite(row.price_amount) || row.price_amount < 0) {
        throw new Error('El precio es inválido.');
      }

      if (
        !Number.isFinite(row.min_order_quantity) ||
        Number(row.min_order_quantity) < 1
      ) {
        throw new Error('La cantidad mínima es inválida.');
      }

      let categoryId: string | null = null;

      if (row.category) {
        categoryId = categoryMap.get(row.category.toLowerCase()) ?? null;

        if (!categoryId) {
          throw new Error(`No existe la categoría "${row.category}".`);
        }
      }

      const productPayload = {
        name: row.name,
        slug: row.slug,
        description: row.description || null,
        short_description: row.short_description || null,
        price_amount: Math.round(row.price_amount),
        currency: 'PYG',
        unit: row.unit,
        min_order_quantity: Math.round(row.min_order_quantity ?? 1),
        category_id: categoryId,
        is_active: false,
        is_featured: row.is_featured ?? false,
      };

      const { data: existing, error: existingError } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', row.slug)
        .maybeSingle();

      if (existingError) throw existingError;

      let productId: string;

      if (existing) {
        const { error } = await supabaseAdmin
          .from('products')
          .update(productPayload)
          .eq('id', existing.id);

        if (error) throw error;

        productId = existing.id;
        result.updated += 1;
        result.rows.push({
          row: rowNumber,
          slug: row.slug,
          status: 'updated',
          message: 'Producto actualizado.',
        });
      } else {
        const { data: product, error } = await supabaseAdmin
          .from('products')
          .insert(productPayload)
          .select('id')
          .single();

        if (error || !product) {
          throw error ?? new Error('No se pudo crear el producto.');
        }

        productId = product.id;
        result.created += 1;
        result.rows.push({
          row: rowNumber,
          slug: row.slug,
          status: 'created',
          message: 'Producto creado.',
        });
      }

      if (row.image_url) {
        const { error: deleteImageError } = await supabaseAdmin
          .from('product_images')
          .delete()
          .eq('product_id', productId)
          .eq('order_index', 0);

        if (deleteImageError) throw deleteImageError;

        const { error: imageError } = await supabaseAdmin
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: row.image_url,
            alt_text: row.name,
            order_index: 0,
          });

        if (imageError) throw imageError;
      }
    } catch (error) {
      result.failed += 1;
      result.success = false;
      result.rows.push({
        row: rowNumber,
        slug: row.slug,
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Error desconocido.',
      });
    }
  }

  revalidatePath('/admin/productos');
  revalidatePath('/productos');
  revalidatePath('/');

    return result;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error desconocido antes de iniciar la importación.';

    console.error('Error fatal en importProducts:', error);

    return {
      success: false,
      created: 0,
      updated: 0,
      failed: inputRows.length,
      rows: [
        {
          row: 0,
          status: 'error',
          message,
        },
      ],
    };
  }
}

export async function readGoogleSheet(
  url: string
): Promise<{ success: boolean; rows?: BulkProductRow[]; message?: string }> {
  await verifyAdmin();

  try {
    let exportUrl = url.trim();

    const match = exportUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);

    if (match) {
      const gidMatch = exportUrl.match(/[?&#]gid=([0-9]+)/);
      const gid = gidMatch?.[1] ?? '0';

      exportUrl =
        `https://docs.google.com/spreadsheets/d/${match[1]}` +
        `/export?format=csv&gid=${gid}`;
    }

    const response = await fetch(exportUrl, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(
        'No se pudo descargar la hoja. Confirmá que sea pública.'
      );
    }

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
      defval: '',
    });

    return {
      success: true,
      rows: rows.map(normalizeRow),
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Error leyendo Google Sheets.',
    };
  }
}
