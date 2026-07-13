import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Corpicia',
  description: 'Panel de Administración de Corpicia',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-corpicia-green">Corpicia Admin (En Preparación)</h1>
      </header>
      <main className="flex-1 container mx-auto p-6">{children}</main>
    </div>
  );
}
