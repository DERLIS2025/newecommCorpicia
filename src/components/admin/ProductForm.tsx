'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { createProduct, updateProduct } from '@/lib/actions/admin-products';
import Link from 'next/link';

export default function ProductForm({ product = null, categories = [] }: { product?: any, categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(product?.unit || 'm2');

  // Complex fields states
  const [images, setImages] = useState<any[]>(
    product?.product_images?.map((img: any) => ({ ...img, is_main: img.order_index === 0 })) || [{ image_url: '', is_main: true }]
  );
  const [tiers, setTiers] = useState<any[]>(
    product?.product_price_tiers?.map((t: any) => ({
      id: t.id,
      min_quantity: Number(t.min_quantity),
      max_quantity: t.max_quantity === null ? '' : Number(t.max_quantity),
      price: Number(t.price_amount),
      label: t.label || '',
      is_promo: Boolean(t.is_promo)
    })) || []
  );
  const [features, setFeatures] = useState<any[]>(
    product?.product_features || []
  );
  const [specs, setSpecs] = useState<any[]>(
    product?.product_specifications || []
  );
  const [recs, setRecs] = useState<any[]>(
    product?.product_recommendations || []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const formData = new FormData(e.currentTarget);

    // Validate Tiers
    if (tiers.length > 0) {
      for (const t of tiers) {
        if (t.min_quantity < 1) {
          setErrorMsg('El valor "Desde" debe ser mayor a 0 en todas las escalas de precio.');
          setLoading(false);
          return;
        }
        if (t.price <= 0) {
          setErrorMsg('El "Precio por unidad" debe ser mayor a 0 en todas las escalas de precio.');
          setLoading(false);
          return;
        }
        if (t.max_quantity !== null && t.max_quantity !== '' && t.max_quantity < t.min_quantity) {
          setErrorMsg('El valor "Hasta" no puede ser menor que "Desde".');
          setLoading(false);
          return;
        }
      }

      // Check overlapping
      const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
      for (let i = 0; i < sortedTiers.length - 1; i++) {
        const current = sortedTiers[i];
        const next = sortedTiers[i + 1];
        
        const currentMax = (current.max_quantity === null || current.max_quantity === '') ? Infinity : current.max_quantity;
        
        if (next.min_quantity <= currentMax) {
          setErrorMsg('Hay escalas que se cruzan. Revisá los rangos.');
          setLoading(false);
          return;
        }
      }
    }

    const validImages = images.filter(i => i.image_url.trim() !== '');
    const validTiers = tiers; // Already validated
    const validFeatures = features.filter(f => f.feature_text.trim() !== '');
    const validSpecs = specs.filter(s => s.spec_key.trim() !== '' && s.spec_value.trim() !== '');
    const validRecs = recs.filter(r => r.recommendation_text.trim() !== '');

    formData.append('images', JSON.stringify(validImages));
    formData.append('price_tiers', JSON.stringify(validTiers));
    formData.append('features', JSON.stringify(validFeatures));
    formData.append('specifications', JSON.stringify(validSpecs));
    formData.append('recommendations', JSON.stringify(validRecs));

    try {
      let res;
      if (product) {
        res = await updateProduct(product.id, null, formData);
      } else {
        res = await createProduct(null, formData);
      }
      
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        router.push('/admin/productos');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 border-b pb-4">
        <Link href="/admin/productos">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{product ? 'Editar Producto' : 'Nuevo Producto'}</h1>
          <p className="text-gray-500">{product ? 'Actualiza los datos del producto' : 'Agrega un nuevo producto al catálogo'}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLUMNA PRINCIPAL */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <Input name="name" defaultValue={product?.name || ''} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <Input name="slug" defaultValue={product?.slug || ''} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción Corta</label>
              <textarea 
                name="short_description" 
                defaultValue={product?.short_description || ''} 
                className="w-full flex min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción Completa</label>
              <textarea 
                name="description" 
                defaultValue={product?.description || ''} 
                className="w-full flex min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Imágenes (URLs)</h2>
            <p className="text-xs text-gray-500">Durante este Sprint se utilizan URLs directas a las imágenes.</p>
            {images.map((img, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input 
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={img.image_url} 
                  onChange={e => {
                    const newImages = [...images];
                    newImages[idx].image_url = e.target.value;
                    setImages(newImages);
                  }} 
                />
                <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                  <input 
                    type="radio" 
                    name="main_image" 
                    checked={img.is_main} 
                    onChange={() => {
                      const newImages = images.map((i, iIdx) => ({ ...i, is_main: idx === iIdx }));
                      setImages(newImages);
                    }} 
                  />
                  Principal
                </label>
                <Button type="button" variant="ghost" size="icon" className="text-red-600 shrink-0" onClick={() => setImages(images.filter((_, i) => i !== idx))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setImages([...images, { image_url: '', is_main: images.length === 0 }])}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Imagen
            </Button>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Características</h2>
            {features.map((feat, idx) => (
              <div key={idx} className="flex gap-2">
                <Input 
                  value={feat.feature_text} 
                  onChange={e => {
                    const newFeatures = [...features];
                    newFeatures[idx].feature_text = e.target.value;
                    setFeatures(newFeatures);
                  }} 
                />
                <Button type="button" variant="ghost" size="icon" className="text-red-600 shrink-0" onClick={() => setFeatures(features.filter((_, i) => i !== idx))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setFeatures([...features, { feature_text: '' }])}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Característica
            </Button>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Especificaciones (Clave/Valor)</h2>
            {specs.map((spec, idx) => (
              <div key={idx} className="flex gap-2">
                <Input 
                  placeholder="Ej: Material"
                  value={spec.spec_key} 
                  onChange={e => {
                    const newSpecs = [...specs];
                    newSpecs[idx].spec_key = e.target.value;
                    setSpecs(newSpecs);
                  }} 
                />
                <Input 
                  placeholder="Ej: Cerámica"
                  value={spec.spec_value} 
                  onChange={e => {
                    const newSpecs = [...specs];
                    newSpecs[idx].spec_value = e.target.value;
                    setSpecs(newSpecs);
                  }} 
                />
                <Button type="button" variant="ghost" size="icon" className="text-red-600 shrink-0" onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setSpecs([...specs, { spec_key: '', spec_value: '' }])}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Especificación
            </Button>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Recomendaciones</h2>
            {recs.map((rec, idx) => (
              <div key={idx} className="flex gap-2">
                <textarea 
                  value={rec.recommendation_text} 
                  onChange={e => {
                    const newRecs = [...recs];
                    newRecs[idx].recommendation_text = e.target.value;
                    setRecs(newRecs);
                  }} 
                  className="w-full flex min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <Button type="button" variant="ghost" size="icon" className="text-red-600 shrink-0 mt-2" onClick={() => setRecs(recs.filter((_, i) => i !== idx))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setRecs([...recs, { recommendation_text: '' }])}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Recomendación
            </Button>
          </div>

        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Organización y Estado</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Categoría *</label>
              <select name="category_id" defaultValue={product?.category_id || ''} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required>
                <option value="" disabled>Seleccione una categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" name="is_active" value="true" defaultChecked={product ? product.is_active : true} className="w-4 h-4" />
                Producto Activo (Visible)
              </label>
              
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" name="is_featured" value="true" defaultChecked={product ? product.is_featured : false} className="w-4 h-4" />
                Destacado (Home)
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Precios y Cantidades</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Precio base por {selectedUnit === 'm2' ? 'm²' : selectedUnit} (PYG) *
              </label>
              <Input name="price_amount" type="number" defaultValue={product?.price_amount || ''} required min="0" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unidad *</label>
              <select name="unit" defaultValue={product?.unit || 'm2'} onChange={e => setSelectedUnit(e.target.value)} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required>
                <option value="m2">m²</option>
                <option value="unidad">Unidad</option>
                <option value="docena">Docena</option>
                <option value="visita">Visita</option>
                <option value="servicio">Servicio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cantidad Mínima Pedido *</label>
              <Input name="min_order_quantity" type="number" defaultValue={product?.min_order_quantity || 1} required min="1" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Precios por cantidad</h2>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm border border-blue-100 space-y-2">
              <p><strong>Definí cuánto se cobra según la cantidad que compra el cliente.</strong> Si compra más, podés asignar otro precio.</p>
              <p>Completá Desde, Hasta y Precio. Si no hay límite máximo, dejá Hasta vacío.</p>
              <div className="bg-white/60 p-3 rounded mt-2 text-xs font-mono text-gray-800">
                <p className="font-semibold mb-1">Ejemplo:</p>
                <p>1 a 25 m² → Gs. 48.000</p>
                <p>26 a 50 m² → Gs. 43.000</p>
                <p>51 o más → Gs. 31.000</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {tiers.map((tier, idx) => (
                <div key={idx} className="p-4 border rounded-md space-y-4 bg-gray-50 relative">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-red-600 h-8 w-8 hover:bg-red-100" title="Eliminar escala" aria-label="Eliminar escala" onClick={() => setTiers(tiers.filter((_, i) => i !== idx))}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-10">
                    <div>
                      <label className="block text-sm font-medium mb-1">Desde</label>
                      <Input type="number" value={tier.min_quantity} onChange={e => {
                        const newTiers = [...tiers];
                        newTiers[idx].min_quantity = parseInt(e.target.value || '0', 10);
                        setTiers(newTiers);
                      }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Hasta</label>
                      <Input type="number" placeholder="Ej: 50" value={tier.max_quantity || ''} onChange={e => {
                        const newTiers = [...tiers];
                        newTiers[idx].max_quantity = e.target.value ? parseInt(e.target.value, 10) : null;
                        setTiers(newTiers);
                      }} />
                      <p className="text-[11px] text-gray-500 mt-1">Dejá vacío si no tiene límite máximo.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Precio por {selectedUnit === 'm2' ? 'm²' : selectedUnit}
                      </label>
                      <Input type="number" value={tier.price === 0 ? '' : tier.price} onChange={e => {
                        const newTiers = [...tiers];
                        newTiers[idx].price = parseInt(e.target.value || '0', 10);
                        setTiers(newTiers);
                      }} />
                      <p className="text-[11px] text-gray-500 mt-1">Ingresá el precio que se cobrará por cada unidad de venta.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Texto visible (opcional)</label>
                      <Input value={tier.label} onChange={e => {
                        const newTiers = [...tiers];
                        newTiers[idx].label = e.target.value;
                        setTiers(newTiers);
                      }} />
                      <p className="text-[11px] text-gray-500 mt-1">Ejemplo: Más de 50 m², Precio mayorista, Promo.</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer w-fit">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-corpicia-green focus:ring-corpicia-green" checked={tier.is_promo} onChange={e => {
                          const newTiers = [...tiers];
                          newTiers[idx].is_promo = e.target.checked;
                          setTiers(newTiers);
                        }} />
                      Marcar como promoción
                    </label>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full text-corpicia-green border-corpicia-green/30 hover:bg-corpicia-green/5" onClick={() => setTiers([...tiers, { min_quantity: 1, max_quantity: null, price: 0, label: '', is_promo: false }])}>
                <Plus className="w-4 h-4 mr-2" /> + Agregar otra escala de precio
              </Button>
            </div>

            {/* Resumen */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-semibold mb-3">Resumen de precios</h3>
              {tiers.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Aún no cargaste precios por cantidad.</p>
              ) : (
                <ul className="space-y-2">
                  {[...tiers].sort((a, b) => a.min_quantity - b.min_quantity).map((t, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-corpicia-green/60"></span>
                      {t.max_quantity ? (
                        <span>{t.min_quantity} a {t.max_quantity} → {t.price > 0 ? `Gs. ${t.price.toLocaleString('es-PY')}` : 'Precio pendiente'}</span>
                      ) : (
                        <span>Desde {t.min_quantity} en adelante → {t.price > 0 ? `Gs. ${t.price.toLocaleString('es-PY')}` : 'Precio pendiente'}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg flex justify-end gap-4 z-40 lg:pl-64">
        <Link href="/admin/productos">
          <Button type="button" variant="outline" disabled={loading}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </div>
    </form>
  );
}
