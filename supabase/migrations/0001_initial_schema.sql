-- ==========================================
-- SPRINT 2A - DATA FOUNDATION (CORPICIA)
-- ==========================================
-- Estructura principal de base de datos para el ecommerce.
-- RLS estricto, claves primarias UUID, tipos de datos correctos.

-- Función genérica para actualizar el timestamp `updated_at`
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- 1. CATÁLOGO DE PRODUCTOS
-- ==========================================

CREATE TABLE categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    description text,
    image_url text,
    order_index integer default 0 check (order_index >= 0),
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = true);

CREATE TABLE products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    description text,
    short_description text,
    price_amount bigint not null check (price_amount >= 0),
    currency char(3) default 'PYG' not null,
    unit text not null,
    min_order_quantity integer default 1 check (min_order_quantity >= 0),
    category_id uuid references categories(id) on delete set null,
    is_active boolean default true,
    is_featured boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);

CREATE TABLE product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    image_url text not null,
    alt_text text,
    order_index integer default 0 check (order_index >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product images" ON product_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_active = true)
);

CREATE TABLE product_features (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    feature_text text not null,
    order_index integer default 0 check (order_index >= 0)
);
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product features" ON product_features FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_features.product_id AND products.is_active = true)
);

CREATE TABLE product_specifications (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    spec_key text not null,
    spec_value text not null,
    order_index integer default 0 check (order_index >= 0)
);
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product specs" ON product_specifications FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_specifications.product_id AND products.is_active = true)
);

CREATE TABLE product_recommendations (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    recommendation_text text not null,
    order_index integer default 0 check (order_index >= 0)
);
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product recommendations" ON product_recommendations FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_recommendations.product_id AND products.is_active = true)
);

CREATE TABLE product_price_tiers (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    min_quantity integer not null check (min_quantity >= 0),
    price_amount bigint not null check (price_amount >= 0),
    label text not null
);
ALTER TABLE product_price_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product price tiers" ON product_price_tiers FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_price_tiers.product_id AND products.is_active = true)
);


-- ==========================================
-- 2. CONTENIDO E INICIO
-- ==========================================

CREATE TABLE banners (
    id uuid primary key default gen_random_uuid(),
    type text not null check (type in ('hero', 'secondary')),
    image_desktop text not null,
    image_mobile text,
    title text,
    subtitle text,
    cta_text text,
    cta_link text,
    order_index integer default 0 check (order_index >= 0),
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_banners_modtime BEFORE UPDATE ON banners FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active banners" ON banners FOR SELECT USING (is_active = true);

CREATE TABLE home_benefits (
    id uuid primary key default gen_random_uuid(),
    icon_name text,
    title text not null,
    description text,
    order_index integer default 0 check (order_index >= 0),
    is_active boolean default true
);
ALTER TABLE home_benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active home benefits" ON home_benefits FOR SELECT USING (is_active = true);

CREATE TABLE services (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text unique not null,
    description text,
    image_url text,
    order_index integer default 0 check (order_index >= 0),
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_services_modtime BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active services" ON services FOR SELECT USING (is_active = true);

CREATE TABLE projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text unique not null,
    category text,
    location text,
    description text,
    image_url text,
    project_date date,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active projects" ON projects FOR SELECT USING (is_active = true);


-- ==========================================
-- 3. CONFIGURACIÓN Y SEO
-- ==========================================

CREATE TABLE site_settings (
    key text primary key,
    value jsonb not null,
    is_public boolean default false not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_site_settings_modtime BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read public site settings" ON site_settings FOR SELECT USING (is_public = true);

CREATE TABLE social_links (
    id uuid primary key default gen_random_uuid(),
    platform text not null,
    url text not null,
    is_active boolean default true,
    order_index integer default 0 check (order_index >= 0)
);
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active social links" ON social_links FOR SELECT USING (is_active = true);

CREATE TABLE legal_pages (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text unique not null,
    content text not null,
    is_published boolean default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_legal_pages_modtime BEFORE UPDATE ON legal_pages FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published legal pages" ON legal_pages FOR SELECT USING (is_published = true);

CREATE TABLE seo_entries (
    id uuid primary key default gen_random_uuid(),
    route text unique not null,
    title text,
    description text,
    keywords text,
    og_image text,
    is_active boolean default true
);
ALTER TABLE seo_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active seo entries" ON seo_entries FOR SELECT USING (is_active = true);


-- ==========================================
-- 4. MULTIMEDIA
-- ==========================================

CREATE TABLE media_assets (
    id uuid primary key default gen_random_uuid(),
    file_name text not null,
    file_type text not null,
    file_size_bytes bigint check (file_size_bytes >= 0),
    dimensions text,
    url text not null,
    alt_text text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
-- Los assets se leen libremente si su URL se conoce (o si están activos en la web), 
-- pero por defecto no crearemos política de listado público general para evitar scraping masivo de assets huérfanos.
-- Para simplificar el acceso público a imágenes por ahora permitimos SELECT:
CREATE POLICY "Public read media assets" ON media_assets FOR SELECT USING (true);


-- ==========================================
-- 5. CRM Y PRESUPUESTOS (DATOS PRIVADOS)
-- ==========================================

CREATE TABLE clients (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    phone text,
    email text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_clients_modtime BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- SIN POLÍTICA PÚBLICA (Completamente privado)

CREATE TABLE quotes (
    id uuid primary key default gen_random_uuid(),
    request_number text unique not null,
    client_id uuid references clients(id) on delete set null,
    total_amount bigint not null check (total_amount >= 0),
    currency char(3) default 'PYG' not null,
    notes text,
    status text not null default 'Nuevo',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_quotes_modtime BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
-- SIN POLÍTICA PÚBLICA

CREATE TABLE quote_items (
    id uuid primary key default gen_random_uuid(),
    quote_id uuid references quotes(id) on delete cascade not null,
    product_id uuid references products(id) on delete set null,
    product_name_snapshot text not null,
    unit_snapshot text not null,
    unit_price_amount bigint not null check (unit_price_amount >= 0),
    quantity integer not null check (quantity >= 0),
    subtotal_amount bigint not null check (subtotal_amount >= 0),
    metadata jsonb
);
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
-- SIN POLÍTICA PÚBLICA

CREATE TABLE quote_status_history (
    id uuid primary key default gen_random_uuid(),
    quote_id uuid references quotes(id) on delete cascade not null,
    status text not null,
    notes text,
    changed_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE quote_status_history ENABLE ROW LEVEL SECURITY;
-- SIN POLÍTICA PÚBLICA


-- ==========================================
-- 6. OTRAS TABLAS DE CONTENIDO Y CONFIG
-- ==========================================

CREATE TABLE navigation_links (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    url text not null,
    order_index integer default 0 check (order_index >= 0),
    is_active boolean default true
);
ALTER TABLE navigation_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active nav links" ON navigation_links FOR SELECT USING (is_active = true);

CREATE TABLE footer_links (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    url text not null,
    order_index integer default 0 check (order_index >= 0),
    is_active boolean default true
);
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active footer links" ON footer_links FOR SELECT USING (is_active = true);

CREATE TABLE home_sections (
    id uuid primary key default gen_random_uuid(),
    section_key text unique not null,
    title text,
    description text,
    is_active boolean default true,
    order_index integer default 0 check (order_index >= 0)
);
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active home sections" ON home_sections FOR SELECT USING (is_active = true);

CREATE TABLE calculator_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER update_calculator_settings_modtime BEFORE UPDATE ON calculator_settings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
ALTER TABLE calculator_settings ENABLE ROW LEVEL SECURITY;
-- Mantenemos privada la lógica interna de calculadora si no queremos exponerla directamente, o la hacemos pública si es necesaria en el cliente
CREATE POLICY "Public read calculator settings" ON calculator_settings FOR SELECT USING (true);

CREATE TABLE project_images (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete cascade not null,
    image_url text not null,
    alt_text text,
    order_index integer default 0 check (order_index >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read project images" ON project_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.is_active = true)
);

-- ==========================================
-- 7. SISTEMA Y LOGS
-- ==========================================

CREATE TABLE admin_activity (
    id uuid primary key default gen_random_uuid(),
    user_id uuid, -- Para futura integración con auth.users
    action text not null,
    entity_type text not null,
    entity_id uuid,
    details jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;
-- SIN POLÍTICA PÚBLICA
