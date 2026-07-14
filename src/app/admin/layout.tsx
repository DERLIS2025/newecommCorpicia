import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Panel | Corpicia',
  description: 'Panel de Administración de Corpicia',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  type AdminProfile = {
    name?: string | null;
    role?: string | null;
    email?: string | null;
  };

  const { data } = await supabase
    .from('admin_profiles')
    .select('name, role')
    .eq('user_id', user.id)
    .single();

  const profile: AdminProfile | null = data as AdminProfile | null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader userName={profile?.name || user.email} userRole={profile?.role || 'user'} />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
