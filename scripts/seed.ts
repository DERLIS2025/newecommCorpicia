// script para popular Supabase con datos estáticos
import { createClient } from '@supabase/supabase-js';
import { productsCatalog, productCategories } from '../src/data/productsData';
import { homeHeroBanners, homeSecondaryBanners, HomeBanner } from '../src/data/banners';

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
  const realCategories = productCategories.filter(cat => cat.id !== 'all');
  console.log(`Found ${realCategories.length} categories to process.`);

  let categoryCount = 0;
  const categorySlugs = new Set();

  for (const cat of realCategories) {
    if (categorySlugs.has(cat.slug)) {
      console.warn(`  [WARNING] Duplicate category slug detected: ${cat.slug}`);
    }
    categorySlugs.add(cat.slug);

    console.log(`  - ${isDryRun ? 'Checking' : 'Upserting'} category: ${cat.slug}`);
    if (!isDryRun) {
      const { error } = await supabase.from('categories').upsert({
        name: cat.name,
        slug: cat.slug,
        is_active: true
      }, { onConflict: 'slug' });

      if (error) console.error(`    Error: ${error.message}`);
      else categoryCount++;
    } else {
      categoryCount++;
    }
  }

  // 2. Products
  console.log(`\nFound ${productsCatalog.length} products to process.`);
  let productCount = 0;
  const productSlugs = new Set();
  let invalidPrices = 0;
  let invalidMins = 0;

  for (const prod of productsCatalog) {
    if (productSlugs.has(prod.slug)) {
      console.warn(`  [WARNING] Duplicate product slug detected: ${prod.slug}`);
    }
    productSlugs.add(prod.slug);

    // Mapeo seguro de la propiedad real según la tienda
    const minQ = typeof prod.minQuantity === 'number' ? prod.minQuantity : 1;

    if (typeof prod.pricePerM2 !== 'number' || prod.pricePerM2 <= 0) {
      console.warn(`  [WARNING] Invalid price for ${prod.slug}: ${prod.pricePerM2}`);
      invalidPrices++;
    }
    if (minQ <= 0) {
      console.warn(`  [WARNING] Invalid min quantity for ${prod.slug}: ${minQ}`);
      invalidMins++;
    }

    const tierCount = prod.priceTiers ? prod.priceTiers.length : 0;
    console.log(`  - ${isDryRun ? 'Checking' : 'Upserting'} product: ${prod.slug} | Unit: ${prod.unit} | Min: ${minQ} | Base Price: ${prod.pricePerM2} | Tiers: ${tierCount}`);
    
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
        min_order_quantity: minQ,
        category_id: catData?.id || null,
        is_active: true
      }, { onConflict: 'slug' });

      if (error) console.error(`    Error: ${error.message}`);
      else productCount++;
    } else {
      productCount++;
    }
  }

  // 3. Banners
  type BannerInsert = HomeBanner & { type: 'hero' | 'secondary', order_index: number, seed_key: string };

  const allBanners: BannerInsert[] = [
    ...homeHeroBanners.map((b: HomeBanner, i: number) => ({ ...b, type: 'hero' as const, order_index: i, seed_key: `hero-${i}` })),
    ...homeSecondaryBanners.map((b: HomeBanner, i: number) => ({ ...b, type: 'secondary' as const, order_index: i, seed_key: `secondary-${i}` }))
  ];

  console.log(`\nFound ${allBanners.length} banners to process.`);
  let bannerCount = 0;
  const bannerSeedKeys = new Set();
  const bannerImages = new Set();

  for (const banner of allBanners) {
    if (bannerSeedKeys.has(banner.seed_key)) {
      console.warn(`  [WARNING] Duplicate banner seed_key detected: ${banner.seed_key}`);
    }
    bannerSeedKeys.add(banner.seed_key);

    if (bannerImages.has(banner.imageDesktop)) {
      console.info(`  [INFO] Reused image detected for banner ${banner.seed_key}: ${banner.imageDesktop}`);
    }
    bannerImages.add(banner.imageDesktop);

    console.log(`  - ${isDryRun ? 'Checking' : 'Upserting'} banner: ${banner.seed_key} (${banner.type})`);
    if (!isDryRun) {
      const { error } = await supabase.from('banners').upsert({
        seed_key: banner.seed_key,
        image_desktop: banner.imageDesktop,
        type: banner.type,
        title: banner.title || null,
        subtitle: banner.subtitle || null,
        cta_text: banner.CTA || null,
        order_index: banner.order_index,
        is_active: true
      }, { onConflict: 'seed_key', ignoreDuplicates: false });

      if (error) console.error(`    Error: ${error.message}`);
      else bannerCount++;
    } else {
      bannerCount++;
    }
  }

  console.log('\n--- SUMMARY ---');
  if (isDryRun) {
    console.log('Dry-run completed successfully.');
    console.log(` - Categories checked: ${categoryCount}`);
    console.log(` - Products checked: ${productCount}`);
    console.log(` - Banners checked: ${bannerCount} (${homeHeroBanners.length} hero, ${homeSecondaryBanners.length} secondary)`);
    console.log(` - Warnings: ${invalidPrices} invalid prices, ${invalidMins} invalid min quantities.`);
    console.log('0 modifications were made to the database. Run with --confirm to apply changes.');
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
