// src/app/admin/announcements/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopBarForm from './TopBarForm';
import PopupForm from './PopupForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AnnouncementsAdminPage() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-corpicia-green">Pop Up y anuncios</h1>
      <Tabs defaultValue="topbar" className="w-full">
        <TabsList>
          <TabsTrigger value="topbar">Barra superior</TabsTrigger>
          <TabsTrigger value="popup">Popup promocional</TabsTrigger>
        </TabsList>
        <TabsContent value="topbar" className="mt-6">
          <TopBarForm />
        </TabsContent>
        <TabsContent value="popup" className="mt-6">
          <PopupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
