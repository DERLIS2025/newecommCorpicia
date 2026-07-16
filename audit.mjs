import fs from 'fs';

const SUPABASE_URL = "https://olhfogbudkfkuqqoqjan.supabase.co";
const SUPABASE_KEY = "sb_publishable_aAixl5xzC4BfYTL07qOLYQ_SzZVW3qY";

async function fetchSupabase(table, query = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return res.json();
}

async function run() {
  const products = await fetchSupabase('products', 'select=*');
  const tiers = await fetchSupabase('product_price_tiers', 'select=*');
  
  fs.writeFileSync('audit.json', JSON.stringify({ products, tiers }, null, 2));
  console.log("Audit data saved to audit.json");
}

run().catch(console.error);
