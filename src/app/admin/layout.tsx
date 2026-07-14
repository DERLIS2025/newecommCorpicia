import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

import { createClient } from '@/lib/supabase/server';

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

  type AdminProfile = {
    name?: string | null;
    role?: string | null;
    email?: string | null;
  };

  let profile: AdminProfile | null = null;

  if (user) {
    const { data } = await supabase
      .from('admin_profiles')
      .select('name, role')
      .eq('user_id', user.id)
      .single();
    
    profile = data as AdminProfile | null;
  }

  const userName = profile?.name || user?.email || 'Admin';
  const userRole = profile?.role || 'admin';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader userName={userName} userRole={userRole} />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
