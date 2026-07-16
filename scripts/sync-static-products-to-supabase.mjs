import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Extract keys from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    if (line.trim().startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim().replace(/"/g, '').replace(/'/g, '');
    }
    if (line.trim().startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1].trim().replace(/"/g, '').replace(/'/g, '');
    }
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("No se encontraron claves de Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const isApply = process.argv.includes('--apply');

console.log(`\n=== INICIANDO MIGRACIÓN DE DATOS ${isApply ? '[APPLY MODE]' : '[DRY RUN]'} ===\n`);

async function runMigration() {
  try {
    // Note: We use dynamic import via `tsx` or a pre-compiled version if running pure Node.
    // Assuming this is run via `npx tsx scripts/sync-static-products-to-supabase.mjs`
    const { productsCatalog } = await import('../src/data/productsData.ts');

    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, slug, name');

    if (error) throw error;

    for (const staticProduct of productsCatalog) {
      const dbProd = dbProducts.find(p => p.slug === staticProduct.slug);
      
      if (!dbProd) {
        console.log(`[SALTADO] ${staticProduct.name} - No encontrado en Supabase.`);
        continue;
      }

      console.log(`\n[ANALIZANDO] ${staticProduct.name} (ID: ${dbProd.id})`);

      // 1. Tiers
      if (staticProduct.priceTiers && staticProduct.priceTiers.length > 0) {
        const { data: existingTiers, error: tError } = await supabase
          .from('product_price_tiers')
          .select('id')
          .eq('product_id', dbProd.id);

        if (existingTiers && existingTiers.length > 0) {
          console.log(`  - Tiers: Ya existen (${existingTiers.length}). NO CAMBIAR.`);
        } else {
          console.log(`  - Tiers: Faltan ${staticProduct.priceTiers.length}. INSERTAR FALTANTE.`);
          if (isApply) {
            const tiersPayload = staticProduct.priceTiers.map(t => ({
              product_id: dbProd.id,
              min_quantity: t.min,
              max_quantity: t.max || null,
              price_amount: t.price,
              label: t.label || '',
              is_promo: t.isPromo || false
            }));
            await supabase.from('product_price_tiers').insert(tiersPayload);
            console.log(`    -> ¡Insertados!`);
          }
        }
      }

      // 2. Features
      if (staticProduct.features && staticProduct.features.length > 0) {
        const { data: existingFeatures } = await supabase.from('product_features').select('id').eq('product_id', dbProd.id);
        if (existingFeatures && existingFeatures.length > 0) {
          console.log(`  - Features: Ya existen (${existingFeatures.length}). NO CAMBIAR.`);
        } else {
          console.log(`  - Features: Faltan ${staticProduct.features.length}. INSERTAR FALTANTE.`);
          if (isApply) {
            const payload = staticProduct.features.map((f, i) => ({
              product_id: dbProd.id,
              feature_text: f,
              order_index: i
            }));
            await supabase.from('product_features').insert(payload);
            console.log(`    -> ¡Insertados!`);
          }
        }
      }

      // 3. Specifications
      if (staticProduct.specifications) {
        const keys = Object.keys(staticProduct.specifications);
        if (keys.length > 0) {
          const { data: existingSpecs } = await supabase.from('product_specifications').select('id').eq('product_id', dbProd.id);
          if (existingSpecs && existingSpecs.length > 0) {
            console.log(`  - Specs: Ya existen (${existingSpecs.length}). NO CAMBIAR.`);
          } else {
            console.log(`  - Specs: Faltan ${keys.length}. INSERTAR FALTANTE.`);
            if (isApply) {
              const payload = keys.map((k, i) => ({
                product_id: dbProd.id,
                spec_key: k,
                spec_value: staticProduct.specifications[k],
                order_index: i
              }));
              await supabase.from('product_specifications').insert(payload);
              console.log(`    -> ¡Insertados!`);
            }
          }
        }
      }

      // 4. Recommendations
      if (staticProduct.recommendations && staticProduct.recommendations.length > 0) {
        const { data: existingRecs } = await supabase.from('product_recommendations').select('id').eq('product_id', dbProd.id);
        if (existingRecs && existingRecs.length > 0) {
          console.log(`  - Recs: Ya existen (${existingRecs.length}). NO CAMBIAR.`);
        } else {
          console.log(`  - Recs: Faltan ${staticProduct.recommendations.length}. INSERTAR FALTANTE.`);
          if (isApply) {
            const payload = staticProduct.recommendations.map((r, i) => ({
              product_id: dbProd.id,
              recommendation_text: r,
              order_index: i
            }));
            await supabase.from('product_recommendations').insert(payload);
            console.log(`    -> ¡Insertados!`);
          }
        }
      }
      
      // 5. Images
      if (staticProduct.images && staticProduct.images.length > 0) {
        const { data: existingImgs } = await supabase.from('product_images').select('id').eq('product_id', dbProd.id);
        if (existingImgs && existingImgs.length > 0) {
          console.log(`  - Images: Ya existen (${existingImgs.length}). NO CAMBIAR.`);
        } else {
          console.log(`  - Images: Faltan ${staticProduct.images.length}. INSERTAR FALTANTE.`);
          if (isApply) {
            const payload = staticProduct.images.map((img, i) => ({
              product_id: dbProd.id,
              image_url: img,
              order_index: i
            }));
            await supabase.from('product_images').insert(payload);
            console.log(`    -> ¡Insertados!`);
          }
        }
      }
    }
    
    if (!isApply) {
      console.log(`\n=== DRY RUN FINALIZADO. Ningún dato fue modificado. ===`);
      console.log(`Ejecute con '--apply' para persistir los datos faltantes en Supabase.\n`);
    } else {
      console.log(`\n=== MIGRACIÓN APLICADA EXITOSAMENTE ===\n`);
    }

  } catch (err) {
    console.error('Error durante la migración:', err);
  }
}

runMigration();
