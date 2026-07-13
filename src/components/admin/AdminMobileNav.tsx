'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Package, Tags, Calculator, ShoppingCart, Wrench, FolderKanban, Users, Image as ImageIcon, Images, Globe, Settings, UserCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Inicio', href: '/admin/inicio', icon: LayoutDashboard },
  { name: 'Banners', href: '/admin/banners', icon: Images },
  { name: 'Productos', href: '/admin/productos', icon: Package },
  { name: 'Categorías', href: '/admin/categorias', icon: Tags },
  { name: 'Calculadora', href: '/admin/calculadora', icon: Calculator },
  { name: 'Presupuestos', href: '/admin/presupuestos', icon: ShoppingCart },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Servicios', href: '/admin/servicios', icon: Wrench },
  { name: 'Proyectos', href: '/admin/proyectos', icon: FolderKanban },
  { name: 'Multimedia', href: '/admin/multimedia', icon: ImageIcon },
  { name: 'SEO & Analytics', href: '/admin/seo', icon: Globe },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
  { name: 'Usuarios', href: '/admin/usuarios', icon: UserCircle },
  { name: 'Actividad', href: '/admin/actividad', icon: Activity },
];

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="w-6 h-6" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex">
          <div className="w-64 bg-white h-full shadow-xl flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-bold text-lg text-corpicia-green">Corpicia Admin</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-corpicia-green/10 text-corpicia-green" 
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-corpicia-green" : "text-gray-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
