'use client';

import Link from 'next/link';
import { UserCircle, LogOut, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminMobileNav } from './AdminMobileNav';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <AdminMobileNav />
        <Link 
          href="/" 
          target="_blank" 
          className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Ver tienda pública
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <UserCircle className="w-5 h-5 text-gray-400" />
          <span className="font-medium hidden sm:inline-block">Administrador</span>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 gap-2">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline-block">Salir</span>
        </Button>
      </div>
    </header>
  );
}
