-- ==========================================
-- SPRINT 3: ADMIN PROFILES & AUTHENTICATION
-- ==========================================

CREATE TABLE admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade not null,
  name text not null,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TRIGGER update_admin_profiles_modtime BEFORE UPDATE ON admin_profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Solo administradores (propios) pueden ver perfiles
CREATE POLICY "Admin profiles are viewable by owner and admin" ON admin_profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM admin_profiles WHERE role IN ('owner', 'admin') AND is_active = true
    )
    OR auth.uid() = user_id
  );

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_editor_or_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'editor') AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: In production we should apply RLS policies to `products`, `categories`, etc.
-- Currently, we use the Service Role Key for server actions. 
-- However, we will enforce auth checks directly in the Next.js Server Actions using Supabase Auth Session.

-- ==========================================
-- DUPLICATE PRODUCT RPC (TRANSACTIONAL)
-- ==========================================
CREATE OR REPLACE FUNCTION duplicate_product(original_product_id uuid, new_slug text) 
RETURNS uuid AS $$
DECLARE
  new_product_id uuid;
  original_record products%ROWTYPE;
BEGIN
  -- Fetch original product
  SELECT * INTO original_record FROM products WHERE id = original_product_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  -- Create copy in inactive state
  INSERT INTO products (
    name, slug, description, short_description, category_id,
    price_amount, currency, unit, min_order_quantity,
    is_active, is_featured
  ) VALUES (
    original_record.name || ' (Copia)',
    new_slug,
    original_record.description,
    original_record.short_description,
    original_record.category_id,
    original_record.price_amount,
    original_record.currency,
    original_record.unit,
    original_record.min_order_quantity,
    false,
    false
  ) RETURNING id INTO new_product_id;

  -- Copy Relations
  INSERT INTO product_price_tiers (product_id, min_quantity, price_amount, label)
  SELECT new_product_id, min_quantity, price_amount, label
  FROM product_price_tiers WHERE product_id = original_product_id;

  INSERT INTO product_features (product_id, feature_text, order_index)
  SELECT new_product_id, feature_text, order_index
  FROM product_features WHERE product_id = original_product_id;

  INSERT INTO product_specifications (product_id, spec_key, spec_value, order_index)
  SELECT new_product_id, spec_key, spec_value, order_index
  FROM product_specifications WHERE product_id = original_product_id;

  INSERT INTO product_recommendations (product_id, recommendation_text, order_index)
  SELECT new_product_id, recommendation_text, order_index
  FROM product_recommendations WHERE product_id = original_product_id;

  INSERT INTO product_images (product_id, image_url, alt_text, order_index)
  SELECT new_product_id, image_url, alt_text, order_index
  FROM product_images WHERE product_id = original_product_id;

  RETURN new_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- RLS POLICIES FOR ADMIN CRUD
-- ==========================================

-- Categories
CREATE POLICY "Admins and editors can insert categories" ON categories FOR INSERT WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins and editors can update categories" ON categories FOR UPDATE USING (is_editor_or_admin()) WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins can delete categories" ON categories FOR DELETE USING (is_admin());
CREATE POLICY "Admins and editors can view all categories" ON categories FOR SELECT USING (is_editor_or_admin());

-- Products
CREATE POLICY "Admins and editors can insert products" ON products FOR INSERT WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins and editors can update products" ON products FOR UPDATE USING (is_editor_or_admin()) WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (is_admin());
CREATE POLICY "Admins and editors can view all products" ON products FOR SELECT USING (is_editor_or_admin());

-- Product Images
CREATE POLICY "Admins and editors can insert product images" ON product_images FOR INSERT WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins and editors can update product images" ON product_images FOR UPDATE USING (is_editor_or_admin()) WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins can delete product images" ON product_images FOR DELETE USING (is_admin());
CREATE POLICY "Admins and editors can view all product images" ON product_images FOR SELECT USING (is_editor_or_admin());

-- Product Price Tiers
CREATE POLICY "Admins and editors can insert product price tiers" ON product_price_tiers FOR INSERT WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins and editors can update product price tiers" ON product_price_tiers FOR UPDATE USING (is_editor_or_admin()) WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins can delete product price tiers" ON product_price_tiers FOR DELETE USING (is_admin());
CREATE POLICY "Admins and editors can view all product price tiers" ON product_price_tiers FOR SELECT USING (is_editor_or_admin());

-- Product Features
CREATE POLICY "Admins and editors can insert product features" ON product_features FOR INSERT WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins and editors can update product features" ON product_features FOR UPDATE USING (is_editor_or_admin()) WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins can delete product features" ON product_features FOR DELETE USING (is_admin());
CREATE POLICY "Admins and editors can view all product features" ON product_features FOR SELECT USING (is_editor_or_admin());

-- Product Specifications
CREATE POLICY "Admins and editors can insert product specifications" ON product_specifications FOR INSERT WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins and editors can update product specifications" ON product_specifications FOR UPDATE USING (is_editor_or_admin()) WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins can delete product specifications" ON product_specifications FOR DELETE USING (is_admin());
CREATE POLICY "Admins and editors can view all product specifications" ON product_specifications FOR SELECT USING (is_editor_or_admin());

-- Product Recommendations
CREATE POLICY "Admins and editors can insert product recommendations" ON product_recommendations FOR INSERT WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins and editors can update product recommendations" ON product_recommendations FOR UPDATE USING (is_editor_or_admin()) WITH CHECK (is_editor_or_admin());
CREATE POLICY "Admins can delete product recommendations" ON product_recommendations FOR DELETE USING (is_admin());
CREATE POLICY "Admins and editors can view all product recommendations" ON product_recommendations FOR SELECT USING (is_editor_or_admin());

