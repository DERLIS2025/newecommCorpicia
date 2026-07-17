'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tags,
  Calculator,
  ShoppingCart,
  Wrench,
  FolderKanban,
  Users,
  Image as ImageIcon,
  Globe,
  Settings,
  UserCircle,
  Activity,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { group: 'Principal', items: [
    { name: 'Inicio', href: '/admin/inicio', icon: LayoutDashboard },
    { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'Pop Up y anuncios', href: '/admin/announcements', icon: Settings },
  ]},
  { group: 'Catálogo', items: [
    { name: 'Productos', href: '/admin/productos', icon: Package },
    { name: 'Categorías', href: '/admin/categorias', icon: Tags },
  ]},
  { group: 'Comercial', items: [
    { name: 'Calculadora', href: '/admin/calculadora', icon: Calculator },
    { name: 'Presupuestos', href: '/admin/presupuestos', icon: ShoppingCart },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
  ]},
  { group: 'Contenido', items: [
    { name: 'Servicios', href: '/admin/servicios', icon: Wrench },
    { name: 'Proyectos', href: '/admin/proyectos', icon: FolderKanban },
    { name: 'Multimedia', href: '/admin/multimedia', icon: ImageIcon },
  ]},
  { group: 'Sistema', items: [
    { name: 'Dashboard Comercial', href: '/admin/dashboard-comercial', icon: LineChart },
    { name: 'SEO', href: '/admin/seo', icon: Globe },
    { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
    { name: 'Usuarios', href: '/admin/usuarios', icon: UserCircle },
    { name: 'Actividad', href: '/admin/actividad', icon: Activity },
  ]}
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-corpicia-green tracking-tight">Corpicia Admin</h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-8">
        {navItems.map((group) => (
          <div key={group.group}>
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-corpicia-green/10 text-corpicia-green" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isActive ? "text-corpicia-green" : "text-gray-400")} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
