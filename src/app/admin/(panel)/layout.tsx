import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/server';

type AdminProfile = {
  name?: string | null;
  role?: string | null;
  email?: string | null;
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: AdminProfile | null = null;

  if (user) {
    const { data } = await supabase
      .from('admin_profiles')
      .select('name, role, email')
      .eq('user_id', user.id)
      .maybeSingle();

    profile = data as AdminProfile | null;
  }

  const userName = profile?.name || user?.email || 'Admin';
  const userRole = profile?.role || 'admin';

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
