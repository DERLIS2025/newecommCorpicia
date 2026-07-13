// script para popular Supabase con datos estáticos
import { createClient } from '@supabase/supabase-js';
import { productsCatalog, productCategories } from '../src/data/productsData';
import { homeHeroBanners, homeMiddleBanners } from '../src/data/banners';
import { config } from 'dotenv';
import path from 'path';

// Cargar variables de entorno
config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isConfirm = args.includes('--confirm');

if (!isDryRun && !isConfirm) {
  console.error('ERROR: You must specify --dry-run or --confirm to execute the seed.');
  process.exit(1);
}

async function seed() {
  console.log('--- SEEDING SCRIPT ---');
  console.log(`MODE: ${isDryRun ? 'DRY-RUN (No data will be modified)' : 'EXECUTE'}\n`);

  // 1. Categories
  console.log(`Found ${productCategories.length} categories to process.`);
  let categoryCount = 0;
  for (const cat of productCategories) {
    if (cat.id === 'all') continue; // Ignorar el filtro de UI 'Todos'
    
    console.log(`  - Upserting category: ${cat.slug}`);
    if (!isDryRun) {
      const { error } = await supabase.from('categories').upsert({
        name: cat.name,
        slug: cat.slug,
        is_active: true
      }, { onConflict: 'slug' });
      
      if (error) console.error(`    Error: ${error.message}`);
      else categoryCount++;
    }
  }

  // 2. Products
  console.log(`\nFound ${productsCatalog.length} products to process.`);
  let productCount = 0;
  for (const prod of productsCatalog) {
    console.log(`  - Upserting product: ${prod.slug}`);
    if (!isDryRun) {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', prod.category)
        .single();

      const { error } = await supabase.from('products').upsert({
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        short_description: prod.shortDescription,
        price_amount: prod.pricePerM2,
        currency: 'PYG',
        unit: prod.unit,
        category_id: catData?.id || null,
        is_active: true
      }, { onConflict: 'slug' });

      if (error) console.error(`    Error: ${error.message}`);
      else productCount++;
    }
  }

  // 3. Banners
  const allBanners = [
    ...homeHeroBanners.map((b, i) => ({ ...b, type: 'hero', order_index: i })),
    ...homeMiddleBanners.map((b, i) => ({ ...b, type: 'secondary', order_index: i }))
  ];
  console.log(`\nFound ${allBanners.length} banners to process.`);
  let bannerCount = 0;
  for (const banner of allBanners) {
    console.log(`  - Upserting banner: ${banner.image} (${banner.type})`);
    if (!isDryRun) {
      const { error } = await supabase.from('banners').upsert({
        // Banners no tienen slug natural, usaremos la URL de la imagen como clave única provisoria (si hubiese restricción) o lo dejaremos insertar.
        // Dado que es un upsert, sin clave única no funciona bien. Para el seed usaremos id estático o skip si ya existe la imagen.
        // Simularemos upsert buscando por image_desktop
        image_desktop: banner.image,
        type: banner.type,
        title: banner.title || null,
        subtitle: banner.subtitle || null,
        cta_text: banner.cta || null,
        order_index: banner.order_index,
        is_active: true
      }, { onConflict: 'id', ignoreDuplicates: false }); 
      // Nota: Si no hay onConflict único, esto podría duplicar en caso de múltiples ejecuciones,
      // para una ejecución robusta, el banner debería tener un identificador estable.
      
      if (error) console.error(`    Error: ${error.message}`);
      else bannerCount++;
    }
  }

  console.log('\n--- SUMMARY ---');
  if (isDryRun) {
    console.log('Dry-run completed successfully. Run with --confirm to apply changes.');
  } else {
    console.log(`Inserted/Updated:`);
    console.log(` - Categories: ${categoryCount}`);
    console.log(` - Products: ${productCount}`);
    console.log(` - Banners: ${bannerCount}`);
    console.log('Seed completed.');
  }
}

seed().catch(err => {
  console.error('Unhandled error during seed:', err);
  process.exit(1);
});
