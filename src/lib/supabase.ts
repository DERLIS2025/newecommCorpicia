import { createClient } from '@supabase/supabase-js';
import { Product, Category } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Manejo seguro del cliente cuando faltan las variables de entorno
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    console.warn('Falta configuración de Supabase.');
    return [];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) {
    console.warn('Falta configuración de Supabase.');
    return null;
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!supabase) {
    console.warn('Falta configuración de Supabase.');
    return [];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

export async function getCategories(): Promise<Category[]> {
  if (!supabase) {
    console.warn('Falta configuración de Supabase.');
    return [];
  }
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}
