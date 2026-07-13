# Políticas RLS (Row Level Security) - Sprint 2A

El esquema de Corpicia ha sido configurado bajo el principio de "Seguridad por Defecto". 

## Tablas Protegidas Totalmente (Privadas)
Las siguientes tablas tienen RLS habilitado pero **ninguna** política pública, lo que significa que el cliente público y el navegador no tienen ningún acceso a ellas bajo ninguna circunstancia. Solo son accesibles mediante `SUPABASE_SERVICE_ROLE_KEY` o un rol administrador futuro.

- `clients`
- `quotes`
- `quote_items`
- `quote_status_history`
- `admin_activity`

## Políticas de Lectura Pública (Solo Lectura, Activos)
Las tablas que contienen datos consumidos por la web pública tienen explícitamente políticas de tipo `SELECT`.
No existen políticas de `INSERT`, `UPDATE` o `DELETE` para el rol anónimo.

| Tabla | Condición de Lectura Pública |
|---|---|
| `categories` | `is_active = true` |
| `products` | `is_active = true` |
| `banners` | `is_active = true` |
| `services` | `is_active = true` |
| `projects` | `is_active = true` |
| `site_settings` | `is_public = true` |
| `legal_pages` | `is_published = true` |

### Integridad Relacional Pública
Tablas adjuntas como `product_images`, `product_features`, `product_specifications`, etc., condicionan su lectura pública a que el producto subyacente esté activo, previniendo la fuga de datos asociados a un producto desactivado:
```sql
CREATE POLICY "Public read product images" ON product_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_active = true)
);
```
