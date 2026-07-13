'use client';

import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Button } from '@/components/ui/button';
import { homeHeroBanners, homeSecondaryBanners } from '@/data/banners';
import { Plus, Edit, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
          <p className="text-gray-500">Administra las imágenes y llamadas a la acción de la portada.</p>
        </div>
        <Button className="w-full sm:w-auto gap-2" disabled>
          <Plus className="w-4 h-4" /> Nuevo Banner
        </Button>
      </div>

      <ConnectionNotice />

      <div className="space-y-8">
        {/* HERO BANNERS */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Hero Banners (Principal)</h2>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden divide-y">
            {homeHeroBanners.map((banner, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50/50">
                <GripVertical className="w-5 h-5 text-gray-300 cursor-move hidden sm:block" />
                
                <div className="w-24 h-16 sm:w-32 sm:h-20 rounded bg-gray-100 flex-shrink-0 relative overflow-hidden">
                  <Image src={banner.imageDesktop} alt={banner.title} fill className="object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{banner.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{banner.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                      {banner.active ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className="text-xs text-gray-400">CTA: {banner.CTA}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-corpicia-green" disabled>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" disabled>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECONDARY BANNERS */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Banners Secundarios (Secciones)</h2>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden divide-y">
            {homeSecondaryBanners.map((banner, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50/50">
                <GripVertical className="w-5 h-5 text-gray-300 cursor-move hidden sm:block" />
                
                <div className="w-24 h-16 sm:w-32 sm:h-20 rounded bg-gray-100 flex-shrink-0 relative overflow-hidden">
                  <Image src={banner.imageDesktop} alt={banner.title} fill className="object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{banner.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{banner.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                      {banner.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-corpicia-green" disabled>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" disabled>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
