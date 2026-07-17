import { getTopBarItems, getPopupSettings } from '@/lib/supabase/announcement';
import TopBarForm from './components/TopBarForm';
import PopupForm from './components/PopupForm';

export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage() {
  const [topBarItems, popupSettings] = await Promise.all([
    getTopBarItems(),
    getPopupSettings(),
  ]);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pop Up y anuncios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestioná la barra superior de anuncios y el popup promocional de la tienda.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Barra Superior</h2>
            <p className="text-sm text-gray-500">Mensajes corredizos que aparecen en la parte superior de todas las páginas.</p>
          </div>
          <TopBarForm initialItems={topBarItems} />
        </section>

        <hr className="border-gray-200" />

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Popup Promocional</h2>
            <p className="text-sm text-gray-500">Ventana emergente para promociones o avisos importantes.</p>
          </div>
          <PopupForm initialSettings={popupSettings} />
        </section>
      </div>
    </div>
  );
}
