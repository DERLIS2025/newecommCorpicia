'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { BannerFormModal } from './BannerFormModal';
import { deleteBanner, toggleBannerStatus } from '@/lib/actions/admin-banners';
import { useRouter } from 'next/navigation';

export function BannerListClient({ banners }: { banners: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const heroBanners = banners.filter(b => b.type === 'hero').sort((a, b) => a.order_index - b.order_index);
  const secondaryBanners = banners.filter(b => b.type === 'secondary').sort((a, b) => a.order_index - b.order_index);

  const handleNew = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este banner? Esta acción no se puede deshacer.')) {
      setIsDeleting(id);
      await deleteBanner(id);
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleBannerStatus(id, currentStatus);
  };

  const renderBannerRow = (banner: any) => (
    <div key={banner.id} className={`flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors ${!banner.is_active ? 'opacity-60' : ''}`}>
      <GripVertical className="w-5 h-5 text-gray-300 cursor-move hidden sm:block" />
      
      <div className="w-24 h-16 sm:w-32 sm:h-20 rounded bg-gray-100 flex-shrink-0 relative overflow-hidden border">
        {banner.image_desktop ? (
          <Image src={banner.image_desktop} alt={banner.title || 'Banner'} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <ImageIcon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{banner.title || <span className="italic text-gray-400">Sin título</span>}</h3>
        <p className="text-sm text-gray-500 truncate">{banner.subtitle || <span className="italic text-gray-400">Sin subtítulo</span>}</p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <button 
            onClick={() => handleToggleStatus(banner.id, banner.is_active)}
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium transition-colors hover:opacity-80 ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
          >
            {banner.is_active ? 'Activo' : 'Inactivo'}
          </button>
          <span className="text-xs font-mono text-gray-400 bg-gray-50 px-1 rounded">Orden: {banner.order_index}</span>
          {banner.cta_text && (
            <span className="text-xs text-blue-600 bg-blue-50 px-1 rounded truncate max-w-[120px]">CTA: {banner.cta_text}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-1 sm:gap-2 border-l pl-2 sm:pl-4">
        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(banner.id, banner.is_active)} className="text-xs hidden md:flex">
          {banner.is_active ? 'Desactivar' : 'Activar'}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleEdit(banner)} className="h-8 w-8 text-gray-500 hover:text-corpicia-green hover:bg-green-50">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleDelete(banner.id)} disabled={isDeleting === banner.id} className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
          <p className="text-gray-500">Administra las imágenes y llamadas a la acción de la portada.</p>
        </div>
        <Button onClick={handleNew} className="w-full sm:w-auto gap-2 bg-corpicia-green hover:bg-green-700">
          <Plus className="w-4 h-4" /> Nuevo Banner
        </Button>
      </div>

      <div className="space-y-8">
        {banners.length === 0 && (
          <div className="bg-white border rounded-xl shadow-sm p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No hay banners cargados todavía.</h3>
            <p className="text-gray-500 mt-1">Hacé clic en "Nuevo Banner" para empezar a personalizar tu portada.</p>
          </div>
        )}

        {/* HERO BANNERS */}
        {heroBanners.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Hero Banners (Principal) 
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{heroBanners.length}</span>
            </h2>
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden divide-y">
              {heroBanners.map(renderBannerRow)}
            </div>
          </div>
        )}

        {/* SECONDARY BANNERS */}
        {secondaryBanners.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Banners Secundarios (Secciones)
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{secondaryBanners.length}</span>
            </h2>
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden divide-y">
              {secondaryBanners.map(renderBannerRow)}
            </div>
          </div>
        )}
      </div>

      <BannerFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        banner={editingBanner} 
      />
    </>
  );
}
