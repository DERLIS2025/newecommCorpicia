'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin, assertAdminWritesEnabled } from '@/lib/supabase/admin';
import type { Database } from '@/types/database';

export type ActionState = {
  success: boolean;
  message: string;
};

type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type TierInsert = Database['public']['Tables']['product_price_tiers']['Insert'];
type FeatureInsert = Database['public']['Tables']['product_features']['Insert'];
type SpecInsert = Database['public']['Tables']['product_specifications']['Insert'];
type RecInsert = Database['public']['Tables']['product_recommendations']['Insert'];
type ImageInsert = Database['public']['Tables']['product_images']['Insert'];

// Types for complex data passed as JSON strings in FormData
export type PriceTierPayload = {
  min_quantity: number;
  max_quantity: number | null;
  price: number;
  label: string;
  is_promo: boolean;
};

export type FeaturePayload = {
  feature_text: string;
};

export type SpecificationPayload = {
  spec_key: string;
  spec_value: string;
};

export type RecommendationPayload = {
  recommendation_text: string;
};

export type ImagePayload = {
  image_url: string;
  is_main: boolean;
};

async function syncProductRelations(productId: string, formData: FormData) {
  // Parse relations from FormData
  const tiersJson = formData.get('price_tiers') as string;
  const featuresJson = formData.get('features') as string;
  const specsJson = formData.get('specifications') as string;
  const recsJson = formData.get('recommendations') as string;
  const imagesJson = formData.get('images') as string;

  const tiers: TierInsert[] = tiersJson ? JSON.parse(tiersJson) : [];
  const features: FeatureInsert[] = featuresJson ? JSON.parse(featuresJson) : [];
  const specs: SpecInsert[] = specsJson ? JSON.parse(specsJson) : [];
  const recs: RecInsert[] = recsJson ? JSON.parse(recsJson) : [];
  const images: ImageInsert[] = imagesJson ? JSON.parse(imagesJson) : [];

  // Tiers
  await supabaseAdmin.from('product_price_tiers').delete().eq('product_id', productId);
  if (tiers.length > 0) {
    const tiersPayload: TierInsert[] = tiers.map(t => ({
      product_id: productId,
      min_quantity: t.min_quantity,
      price_amount: (t as any).price || t.price_amount, // fallback for legacy payload naming
      label: t.label,
    }));
    await supabaseAdmin.from('product_price_tiers').insert(tiersPayload);
  }

  // Features
  await supabaseAdmin.from('product_features').delete().eq('product_id', productId);
  if (features.length > 0) {
    const featuresPayload: FeatureInsert[] = features.map((f, i) => ({
      product_id: productId,
      feature_text: f.feature_text,
      order_index: i,
    }));
    await supabaseAdmin.from('product_features').insert(featuresPayload);
  }

  // Specifications
  await supabaseAdmin.from('product_specifications').delete().eq('product_id', productId);
  if (specs.length > 0) {
    const specsPayload: SpecInsert[] = specs.map((s, i) => ({
      product_id: productId,
      spec_key: s.spec_key,
      spec_value: s.spec_value,
      order_index: i,
    }));
    await supabaseAdmin.from('product_specifications').insert(specsPayload);
  }

  // Recommendations
  await supabaseAdmin.from('product_recommendations').delete().eq('product_id', productId);
  if (recs.length > 0) {
    const recsPayload: RecInsert[] = recs.map((r, i) => ({
      product_id: productId,
      recommendation_text: r.recommendation_text,
      order_index: i,
    }));
    await supabaseAdmin.from('product_recommendations').insert(recsPayload);
  }

  // Images
  await supabaseAdmin.from('product_images').delete().eq('product_id', productId);
  if (images.length > 0) {
    const imagesPayload: ImageInsert[] = images.map((img, i) => ({
      product_id: productId,
      image_url: img.image_url,
      alt_text: img.alt_text || null,
      order_index: (img as any).is_main ? 0 : (i + 1),
    }));
    await supabaseAdmin.from('product_images').insert(imagesPayload);
  }
}

export async function createProduct(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    assertAdminWritesEnabled();

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string | null;
    const short_description = formData.get('short_description') as string | null;
    const category_id = formData.get('category_id') as string | null;
    const price_amount = parseInt((formData.get('price_amount') as string) || '0', 10);
    const unit = formData.get('unit') as string;
    const min_order_quantity = parseInt((formData.get('min_order_quantity') as string) || '1', 10);
    const is_active = formData.get('is_active') === 'on';
    const is_featured = formData.get('is_featured') === 'on';

    if (!name || !slug || !unit || price_amount < 0 || min_order_quantity <= 0) {
      return { success: false, message: 'Datos obligatorios faltantes o inválidos' };
    }

    const payload: ProductInsert = {
      name,
      slug,
      description,
      short_description,
      category_id: category_id || null,
      price_amount,
      currency: 'PYG',
      unit,
      min_order_quantity,
      is_active,
      is_featured,
    };

    // Insert Product
    const { data: product, error } = await supabaseAdmin.from('products').insert(payload).select('id').single();

    if (error) {
      if (error.code === '23505') return { success: false, message: 'El slug ya existe' };
      throw error;
    }

    // Sync Relations
    await syncProductRelations(product.id, formData);

    revalidatePath('/admin/productos');
    revalidatePath('/productos');
    revalidatePath('/');
    return { success: true, message: 'Producto creado exitosamente' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error al crear producto' };
  }
}

export async function updateProduct(
  id: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    assertAdminWritesEnabled();

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string | null;
    const short_description = formData.get('short_description') as string | null;
    const category_id = formData.get('category_id') as string | null;
    const price_amount = parseInt((formData.get('price_amount') as string) || '0', 10);
    const unit = formData.get('unit') as string;
    const min_order_quantity = parseInt((formData.get('min_order_quantity') as string) || '1', 10);
    const is_active = formData.get('is_active') === 'on';
    const is_featured = formData.get('is_featured') === 'on';

    if (!name || !slug || !unit || price_amount < 0 || min_order_quantity <= 0) {
      return { success: false, message: 'Datos obligatorios faltantes o inválidos' };
    }

    const payload: ProductUpdate = {
      name,
      slug,
      description,
      short_description,
      category_id: category_id || null,
      price_amount,
      unit,
      min_order_quantity,
      is_active,
      is_featured,
    };

    const { error } = await supabaseAdmin
      .from('products')
      .update(payload)
      .eq('id', id);

    if (error) {
      if (error.code === '23505') return { success: false, message: 'El slug ya existe' };
      throw error;
    }

    await syncProductRelations(id, formData);

    revalidatePath('/admin/productos');
    revalidatePath('/productos');
    revalidatePath(`/productos/${slug}`);
    revalidatePath('/');
    return { success: true, message: 'Producto actualizado exitosamente' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error al actualizar producto' };
  }
}

export async function deleteProduct(id: string): Promise<ActionState> {
  try {
    assertAdminWritesEnabled();

    // The foreign keys have ON DELETE CASCADE so related tables will clean themselves up.
    // However, if the product is linked in budgets/quotes, it might be restricted.
    // The current quote_items does not link directly to products via foreign key (wait, let's check. 
    // quote_items usually just store snapshot or link. Let's assume it's safe to try).

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (error) {
      if (error.code === '23503') { // foreign key violation
        return { success: false, message: 'No se puede eliminar. El producto está en presupuestos históricos. Desactívelo en su lugar.' };
      }
      throw error;
    }

    revalidatePath('/admin/productos');
    revalidatePath('/productos');
    revalidatePath('/');
    return { success: true, message: 'Producto eliminado exitosamente' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error al eliminar producto' };
  }
}

export async function duplicateProduct(id: string): Promise<ActionState> {
  try {
    assertAdminWritesEnabled();

    // 1. Fetch original product
    const { data: original, error: origError } = await supabaseAdmin
      .from('products')
      .select('*, product_price_tiers(*), product_images(*), product_features(*), product_specifications(*), product_recommendations(*)')
      .eq('id', id)
      .single();

    if (origError || !original) {
      return { success: false, message: 'Producto original no encontrado' };
    }

    // 2. Create copy
    const newSlug = `${original.slug}-copia-${Date.now().toString().slice(-4)}`;
    
    const copyPayload: ProductInsert = {
      name: `${original.name} (Copia)`,
      slug: newSlug,
      description: original.description,
      short_description: original.short_description,
      category_id: original.category_id,
      price_amount: original.price_amount,
      currency: original.currency,
      unit: original.unit,
      min_order_quantity: original.min_order_quantity,
      is_active: false, // inactive by default
      is_featured: false,
    };

    const { data: copy, error: copyError } = await supabaseAdmin.from('products').insert(copyPayload).select('id').single();

    if (copyError) throw copyError;

    // 3. Copy relations
    const newId = copy.id;

    if (original.product_price_tiers?.length > 0) {
      const tiersPayload: TierInsert[] = original.product_price_tiers.map((t: any) => ({
        product_id: newId,
        min_quantity: t.min_quantity,
        price_amount: t.price_amount,
        label: t.label,
      }));
      await supabaseAdmin.from('product_price_tiers').insert(tiersPayload);
    }
    if (original.product_images?.length > 0) {
      const imagesPayload: ImageInsert[] = original.product_images.map((img: any) => ({
        product_id: newId,
        image_url: img.image_url,
        alt_text: img.alt_text,
        order_index: img.order_index,
      }));
      await supabaseAdmin.from('product_images').insert(imagesPayload);
    }
    if (original.product_features?.length > 0) {
      const featuresPayload: FeatureInsert[] = original.product_features.map((f: any) => ({
        product_id: newId,
        feature_text: f.feature_text,
        order_index: f.order_index,
      }));
      await supabaseAdmin.from('product_features').insert(featuresPayload);
    }
    if (original.product_specifications?.length > 0) {
      const specsPayload: SpecInsert[] = original.product_specifications.map((s: any) => ({
        product_id: newId,
        spec_key: s.spec_key,
        spec_value: s.spec_value,
        order_index: s.order_index,
      }));
      await supabaseAdmin.from('product_specifications').insert(specsPayload);
    }
    if (original.product_recommendations?.length > 0) {
      const recsPayload: RecInsert[] = original.product_recommendations.map((r: any) => ({
        product_id: newId,
        recommendation_text: r.recommendation_text,
        order_index: r.order_index,
      }));
      await supabaseAdmin.from('product_recommendations').insert(recsPayload);
    }

    revalidatePath('/admin/productos');
    return { success: true, message: 'Producto duplicado exitosamente' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error al duplicar producto' };
  }
}

export async function toggleProductStatus(id: string, newStatus: boolean): Promise<ActionState> {
  try {
    assertAdminWritesEnabled();

    const { error } = await supabaseAdmin
      .from('products')
      .update({ is_active: newStatus })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/productos');
    revalidatePath('/productos');
    revalidatePath('/');
    return { success: true, message: 'Estado del producto actualizado' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error al actualizar estado' };
  }
}
