// Script para validar que la migración a Supabase concuerda con los datos estáticos
import { createClient } from '@supabase/supabase-js';
import { productsCatalog, productCategories } from '../src/data/productsData';
import { homeHeroBanners, homeSecondaryBanners } from '../src/data/banners';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function validate() {
  console.log('--- MIGRATION VALIDATOR ---');
  let hasErrors = false;

  // 1. Validate Categories
  const { data: dbCategories, error: catError } = await supabase.from('categories').select('*');
  if (catError) throw catError;

  const staticCatCount = productCategories.filter(c => c.id !== 'all').length;
  console.log(`Categories: Expected ${staticCatCount}, Found ${dbCategories.length}`);
  if (dbCategories.length !== staticCatCount) {
    console.error('  [MISMATCH] Category count differs.');
    hasErrors = true;
  }

  // 2. Validate Products
  const { data: dbProducts, error: prodError } = await supabase.from('products').select('*');
  if (prodError) throw prodError;

  console.log(`Products: Expected ${productsCatalog.length}, Found ${dbProducts.length}`);
  if (dbProducts.length !== productsCatalog.length) {
    console.error('  [MISMATCH] Product count differs.');
    hasErrors = true;
  }

  // Verify specific data (Slugs and Prices)
  for (const staticProd of productsCatalog) {
    const dbProd = dbProducts.find(p => p.slug === staticProd.slug);
    if (!dbProd) {
      console.error(`  [MISSING] Product slug not found in DB: ${staticProd.slug}`);
      hasErrors = true;
      continue;
    }

    if (dbProd.price_amount !== staticProd.pricePerM2) {
      console.error(`  [MISMATCH] Price for ${staticProd.slug}: Expected ${staticProd.pricePerM2}, Found ${dbProd.price_amount}`);
      hasErrors = true;
    }

    if (dbProd.unit !== staticProd.unit) {
      console.error(`  [MISMATCH] Unit for ${staticProd.slug}: Expected ${staticProd.unit}, Found ${dbProd.unit}`);
      hasErrors = true;
    }
  }

  // 3. Validate Banners
  const { data: dbBanners, error: bannerError } = await supabase.from('banners').select('*');
  if (bannerError) throw bannerError;

  const totalStaticBanners = homeHeroBanners.length + homeSecondaryBanners.length;
  console.log(`Banners: Expected ${totalStaticBanners}, Found ${dbBanners.length}`);
  if (dbBanners.length !== totalStaticBanners) {
    console.error('  [MISMATCH] Banner count differs.');
    hasErrors = true;
  }

  if (hasErrors) {
    console.log('\nValidation finished with ERRORS. Please check the logs above.');
    process.exit(1);
  } else {
    console.log('\nValidation SUCCESS. Database matches static files perfectly.');
  }
}

validate().catch(err => {
  console.error('Validation script failed:', err);
  process.exit(1);
});
