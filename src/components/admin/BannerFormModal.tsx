'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBanner, updateBanner } from '@/lib/actions/admin-banners';
import { X, Save } from 'lucide-react';

type BannerFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  banner?: any;
};

export function BannerFormModal({ isOpen, onClose, banner }: BannerFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [type, setType] = useState('hero');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageDesktop, setImageDesktop] = useState('');
  const [imageMobile, setImageMobile] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (banner) {
      setType(banner.type || 'hero');
      setTitle(banner.title || '');
      setSubtitle(banner.subtitle || '');
      setImageDesktop(banner.image_desktop || '');
      setImageMobile(banner.image_mobile || '');
      setCtaText(banner.cta_text || '');
      setCtaLink(banner.cta_link || '');
      setOrderIndex(banner.order_index || 0);
      setIsActive(banner.is_active ?? true);
    } else {
      setType('hero');
      setTitle('');
      setSubtitle('');
      setImageDesktop('');
      setImageMobile('');
      setCtaText('');
      setCtaLink('');
      setOrderIndex(0);
      setIsActive(true);
    }
    setErrorMsg('');
  }, [banner, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const formData = new FormData();
    if (banner?.id) formData.append('id', banner.id);
    formData.append('type', type);
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('image_desktop', imageDesktop);
    formData.append('image_mobile', imageMobile);
    formData.append('cta_text', ctaText);
    formData.append('cta_link', ctaLink);
    formData.append('order_index', orderIndex.toString());
    formData.append('is_active', isActive.toString());

    const result = banner?.id 
      ? await updateBanner(null, formData)
      : await createBanner(null, formData);

    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.message || 'Error al guardar el banner');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{banner ? 'Editar Banner' : 'Nuevo Banner'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo / Ubicación *</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option value="hero">Hero (Principal arriba)</option>
                  <option value="secondary">Secondary (Entre secciones)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <label className="flex items-center gap-2 h-10">
                  <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-corpicia-green focus:ring-corpicia-green" 
                  />
                  <span className="text-sm font-medium">Activo (Visible)</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t">
              <h3 className="font-semibold text-sm text-gray-900">Textos</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Transformamos tu espacio verde" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subtítulo</label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Ej: Especialistas en jardinería" />
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t">
              <h3 className="font-semibold text-sm text-gray-900">Multimedia</h3>
              <div>
                <label className="block text-sm font-medium mb-1">URL de Imagen (Desktop) *</label>
                <Input value={imageDesktop} onChange={(e) => setImageDesktop(e.target.value)} placeholder="Ej: /images/hero/hero-1.webp" required />
                <p className="text-xs text-gray-500 mt-1">Pegá la URL directa de la imagen. El upload de archivos queda para una fase posterior.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL de Imagen (Mobile) Opcional</label>
                <Input value={imageMobile} onChange={(e) => setImageMobile(e.target.value)} placeholder="Ej: /images/hero/hero-1-mobile.webp" />
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t">
              <h3 className="font-semibold text-sm text-gray-900">Llamada a la acción (Botón)</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Texto del botón</label>
                  <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Ej: Ver Servicios" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Enlace del botón</label>
                  <Input value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="Ej: /productos/mantenimiento" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-2 border-t">
              <h3 className="font-semibold text-sm text-gray-900">Visualización</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Orden de aparición</label>
                <Input type="number" value={orderIndex} onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)} min="0" className="w-32" />
                <p className="text-xs text-gray-500 mt-1">Menor número = se muestra primero.</p>
              </div>
            </div>

            <div className="pt-6 border-t flex gap-3 justify-end sticky bottom-0 bg-white">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-corpicia-green hover:bg-green-700">
                {isSubmitting ? 'Guardando...' : <><Save className="w-4 h-4 mr-2" /> Guardar Banner</>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
