import { supabase } from '../supabase';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { productsCatalog, ProductDetail } from '@/data/productsData';

// Fallback configuration
const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'supabase';

function logFallback(reason: string) {
  // Silent log to prevent exposing sensitive errors to the client
  console.info(`[Repository: Products] Using static fallback. Reason: ${reason}`);
}

async function getSupabaseProductVisibilityMap(): Promise<Record<string, boolean>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('slug, is_active');

    if (error || !data) {
      logFallback('Could not fetch product visibility map');
      return {};
    }

    return data.reduce((map: Record<string, boolean>, product: any) => {
      if (product.slug) {
        map[product.slug] = product.is_active === true;
      }
      return map;
    }, {});
  } catch (err) {
    logFallback('Unexpected exception fetching product visibility map');
    return {};
  }
}

function filterStaticProductsByVisibility(products: ProductDetail[], visibilityMap: Record<string, boolean>) {
  return products.filter((product) => visibilityMap[product.slug] !== false);
}

export async function getProducts() {
  if (DATA_SOURCE === 'static') {
    logFallback('NEXT_PUBLIC_DATA_SOURCE is set to static');
    const visibilityMap = await getSupabaseProductVisibilityMap();
    return filterStaticProductsByVisibility(productsCatalog, visibilityMap);
  }

  if (!supabase) {
    logFallback('Supabase client is not configured');
    return productsCatalog;
  }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(slug, name), product_images(image_url, order_index)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
  
      if (error) {
        logFallback('Supabase query error');
        return productsCatalog;
      }
  
      return data.map(product => ({
        ...product,
        category: product.categories?.name,
        categorySlug: product.categories?.slug,
        images: product.product_images?.sort((a: any, b: any) => a.order_index - b.order_index).map((img: any) => img.image_url) || [],
        pricePerM2: product.price_amount,
        shortDescription: product.short_description,
      })) as any[];
    } catch (err) {
    logFallback('Unexpected exception during fetch');
    return productsCatalog;
  }
}

export async function getProduct(slug: string) {
  if (DATA_SOURCE === 'static') {
    const visibilityMap = await getSupabaseProductVisibilityMap();
    if (visibilityMap[slug] === false) return null;
    return productsCatalog.find(p => p.slug === slug) || null;
  }

  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_price_tiers(*), product_images(*), product_features(*), product_specifications(*), product_recommendations(*), categories(name, slug)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;

    // Transform Supabase data to match the public storefront format
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.short_description,
      categoryId: data.category_id,
      category: data.categories?.name,
      pricePerM2: data.price_amount,
      unit: data.unit,
      minOrderQuantity: data.min_order_quantity,
      images: data.product_images?.sort((a: any, b: any) => a.order_index - b.order_index).map((img: any) => img.image_url) || [],
      priceTiers: data.product_price_tiers?.map((t: any) => ({
        minQuantity: t.min_quantity,
        maxQuantity: t.max_quantity || null,
        isPromo: t.is_promo || false,
        price: t.price_amount,
        label: t.label,
      })) || [],
      features: data.product_features?.sort((a: any, b: any) => a.order_index - b.order_index).map((f: any) => f.feature_text) || [],
      specifications: data.product_specifications?.sort((a: any, b: any) => a.order_index - b.order_index).map((s: any) => ({
        key: s.spec_key,
        value: s.spec_value,
      })) || [],
      recommendations: data.product_recommendations?.sort((a: any, b: any) => a.order_index - b.order_index).map((r: any) => r.recommendation_text) || [],
    } as any;
  } catch (err) {
    console.error('Error fetching product:', err);
    return null;
  }
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getProductsByCategory(categorySlug: string) {
  if (DATA_SOURCE === 'static') {
    const visibilityMap = await getSupabaseProductVisibilityMap();
    return filterStaticProductsByVisibility(
      productsCatalog.filter(p => toSlug(p.category || '') === categorySlug),
      visibilityMap
    );
  }

  if (!supabase) return [];

  try {
    // We need to join with categories to filter by category slug
    const { data, error } = await supabase
      .from('products')
      .select('*, categories!inner(slug, name), product_images(image_url, order_index)')
      .eq('is_active', true)
      .eq('categories.slug', categorySlug)
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map(product => ({
      ...product,
      category: product.categories?.name,
      categorySlug: product.categories?.slug,
      images: product.product_images?.sort((a: any, b: any) => a.order_index - b.order_index).map((img: any) => img.image_url) || [],
      pricePerM2: product.price_amount,
      shortDescription: product.short_description,
    })) as any[];
  } catch (err) {
    console.error('Error fetching products by category:', err);
    return [];
  }
}

export async function getRelatedProducts(slug: string, categorySlug: string, limit = 4) {
  if (DATA_SOURCE === 'static') {
    const visibilityMap = await getSupabaseProductVisibilityMap();
    return filterStaticProductsByVisibility(
      productsCatalog.filter((p) => toSlug(p.category || '') === categorySlug && p.slug !== slug),
      visibilityMap
    ).slice(0, limit);
  }

  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories!inner(slug, name), product_images(image_url, order_index)')
      .eq('is_active', true)
      .eq('categories.slug', categorySlug)
      .neq('slug', slug)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];

    return data.map(product => ({
      ...product,
      category: product.categories?.name,
      categorySlug: product.categories?.slug,
      images: product.product_images?.sort((a: any, b: any) => a.order_index - b.order_index).map((img: any) => img.image_url) || [],
      pricePerM2: product.price_amount,
      shortDescription: product.short_description,
    })) as any[];
  } catch (err) {
    console.error('Error fetching related products:', err);
    return [];
  }
}
