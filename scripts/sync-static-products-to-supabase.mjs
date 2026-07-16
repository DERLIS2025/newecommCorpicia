import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local (avoid exposing keys in logs)
const envPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...rest] = line.trim().split('=');
    const value = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') supabaseServiceKey = value;
  });
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL or SERVICE_ROLE_KEY missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const isApply = process.argv.includes('--apply');

console.log(`\n=== INICIANDO MIGRACIÓN DE DATOS ${isApply ? '[APPLY MODE]' : '[DRY RUN]'} ===\n`);

// Counters for final report
let counters = {
  productsFound: 0,
  productsNotFound: 0,
  tiersInserted: 0,
  tiersSkipped: 0,
  tiersFailed: 0,
  imagesInserted: 0,
  imagesSkipped: 0,
  imagesFailed: 0,
  featuresInserted: 0,
  featuresSkipped: 0,
  featuresFailed: 0,
  specsInserted: 0,
  specsSkipped: 0,
  specsFailed: 0,
  recsInserted: 0,
  recsSkipped: 0,
  recsFailed: 0,
};

async function runMigration() {
  try {
    const { productsCatalog } = await import('../src/data/productsData.ts');
    const { data: dbProducts, error: prodErr } = await supabase.from('products').select('id, slug, name');
    if (prodErr) throw prodErr;
    for (const staticProduct of productsCatalog) {
      const dbProd = dbProducts.find(p => p.slug === staticProduct.slug);
      if (!dbProd) {
        console.warn(`[NO ENCONTRADO] ${staticProduct.name} (slug: ${staticProduct.slug})`);
        counters.productsNotFound++;
        continue;
      }
      counters.productsFound++;
      console.log(`\n[ANALIZANDO] ${staticProduct.name} (ID: ${dbProd.id})`);

      // Helper to insert with validation
      async function safeInsert(table, payload, label) {
        if (!Array.isArray(payload) || payload.length === 0) return { inserted: 0, skipped: 0, failed: 0 };
        // Check if any rows already exist for this product & table (simple existence check)
        const { data: existing, error: existErr } = await supabase.from(table).select('id').eq('product_id', dbProd.id);
        if (existErr) {
          console.error(`  - ${label}: error checking existing rows – ${existErr.message}`);
          return { inserted: 0, skipped: 0, failed: payload.length };
        }
        if (existing && existing.length > 0) {
          console.log(`  - ${label}: Ya existen (${existing.length}). NO CAMBIAR.`);
          return { inserted: 0, skipped: existing.length, failed: 0 };
        }
        if (!isApply) {
          console.log(`  - ${label}: Faltan ${payload.length}. INSERTAR FALTANTE (dry‑run).`);
          return { inserted: 0, skipped: 0, failed: 0 };
        }
        const { data, error } = await supabase.from(table).insert(payload).select();
        if (error) {
          console.error(`  - ${label}: INSERT FAILED – ${error.message}`);
          return { inserted: 0, skipped: 0, failed: payload.length };
        }
        if (!data || data.length !== payload.length) {
          console.error(`  - ${label}: INSERT RETURNNED ${data?.length ?? 0} rows (expected ${payload.length}).`);
          return { inserted: data?.length ?? 0, skipped: 0, failed: payload.length - (data?.length ?? 0) };
        }
        console.log(`  - ${label}: ¡Insertados ${data.length}!`);
        return { inserted: data.length, skipped: 0, failed: 0 };
      }

      // 1. Price Tiers
      if (staticProduct.priceTiers && staticProduct.priceTiers.length) {
        const tiersPayload = staticProduct.priceTiers.map(t => ({
          product_id: dbProd.id,
          min_quantity: t.min,
          max_quantity: t.max ?? null,
          price_amount: t.price,
          label: t.label ?? '',
          is_promo: t.isPromo ?? false
        }));
        const res = await safeInsert('product_price_tiers', tiersPayload, 'Tiers');
        counters.tiersInserted += res.inserted;
        counters.tiersSkipped += res.skipped;
        counters.tiersFailed += res.failed;
        if (res.failed) { process.exitCode = 1; }
      }

      // 2. Images
      if (staticProduct.images && staticProduct.images.length) {
        const imgPayload = staticProduct.images.map((img, i) => ({
          product_id: dbProd.id,
          image_url: img,
          order_index: i
        }));
        const res = await safeInsert('product_images', imgPayload, 'Images');
        counters.imagesInserted += res.inserted;
        counters.imagesSkipped += res.skipped;
        counters.imagesFailed += res.failed;
        if (res.failed) { process.exitCode = 1; }
      }

      // 3. Features
      if (staticProduct.features && staticProduct.features.length) {
        const featPayload = staticProduct.features.map((f, i) => ({
          product_id: dbProd.id,
          feature_text: f,
          order_index: i
        }));
        const res = await safeInsert('product_features', featPayload, 'Features');
        counters.featuresInserted += res.inserted;
        counters.featuresSkipped += res.skipped;
        counters.featuresFailed += res.failed;
        if (res.failed) { process.exitCode = 1; }
      }

      // 4. Specifications
      if (staticProduct.specifications) {
        const keys = Object.keys(staticProduct.specifications);
        if (keys.length) {
          const specPayload = keys.map((k, i) => ({
            product_id: dbProd.id,
            spec_key: k,
            spec_value: staticProduct.specifications[k],
            order_index: i
          }));
          const res = await safeInsert('product_specifications', specPayload, 'Specs');
          counters.specsInserted += res.inserted;
          counters.specsSkipped += res.skipped;
          counters.specsFailed += res.failed;
          if (res.failed) { process.exitCode = 1; }
        }
      }

      // 5. Recommendations
      if (staticProduct.recommendations && staticProduct.recommendations.length) {
        const recPayload = staticProduct.recommendations.map((r, i) => ({
          product_id: dbProd.id,
          recommendation_text: r,
          order_index: i
        }));
        const res = await safeInsert('product_recommendations', recPayload, 'Recs');
        counters.recsInserted += res.inserted;
        counters.recsSkipped += res.skipped;
        counters.recsFailed += res.failed;
        if (res.failed) { process.exitCode = 1; }
      }
    }

    // Final summary
    console.log('\n=== RESUMEN MIGRACIÓN ===');
    console.log(`Productos encontrados: ${counters.productsFound}`);
    console.log(`Productos no encontrados: ${counters.productsNotFound}`);
    console.log(`Tiers - Insertados: ${counters.tiersInserted}, Omitidos: ${counters.tiersSkipped}, Fallidos: ${counters.tiersFailed}`);
    console.log(`Images - Insertados: ${counters.imagesInserted}, Omitidos: ${counters.imagesSkipped}, Fallidos: ${counters.imagesFailed}`);
    console.log(`Features - Insertados: ${counters.featuresInserted}, Omitidos: ${counters.featuresSkipped}, Fallidos: ${counters.featuresFailed}`);
    console.log(`Specs - Insertados: ${counters.specsInserted}, Omitidos: ${counters.specsSkipped}, Fallidos: ${counters.specsFailed}`);
    console.log(`Recs - Insertados: ${counters.recsInserted}, Omitidos: ${counters.recsSkipped}, Fallidos: ${counters.recsFailed}`);

    const totalFailed = counters.tiersFailed + counters.imagesFailed + counters.featuresFailed + counters.specsFailed + counters.recsFailed;
    if (totalFailed === 0) {
      console.log('\nMIGRACIÓN APLICADA EXITOSAMENTE');
    } else {
      console.error('\nMIGRACIÓN CON FALLAS. Revise los mensajes anteriores.');
      process.exitCode = 1;
    }

  } catch (err) {
    console.error('Error durante la migración:', err);
    process.exitCode = 1;
  }
}

runMigration();
