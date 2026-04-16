import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Corpicia',
  description: 'Términos y condiciones de uso del sitio web de Corpicia.',
  alternates: {
    canonical: '/terminos/',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Términos y Condiciones
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Generalidades</h2>
            <p className="text-gray-600 mb-4">
              Al acceder y utilizar este sitio web, aceptás los siguientes términos y condiciones. 
              Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices nuestro sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Productos y Servicios</h2>
            <p className="text-gray-600 mb-4">
              Corpicia se especializa en la venta de césped natural y productos de jardinería. 
              Todos los precios mostrados en el sitio son estimaciones por metro cuadrado y pueden 
              variar según la ubicación y requerimientos específicos del proyecto.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Presupuestos</h2>
            <p className="text-gray-600 mb-4">
              Los presupuestos generados a través del sitio web son estimaciones preliminares. 
              El precio final se confirmará mediante comunicación directa con nuestro equipo. 
              Los presupuestos tienen una validez de 15 días desde su emisión.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Envíos</h2>
            <p className="text-gray-600 mb-4">
              Realizamos envíos a todo Paraguay. Los costos y tiempos de entrega varían según 
              la ubicación y se coordinarán directamente con el cliente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Garantía</h2>
            <p className="text-gray-600 mb-4">
              Ofrecemos garantía en la instalación de césped natural, sujeta a condiciones de 
              mantenimiento adecuado. La garantía no cubre daños por mal uso, plagas no controladas 
              o condiciones climáticas extremas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Contacto</h2>
            <p className="text-gray-600">
              Para cualquier consulta sobre estos términos, podés contactarnos a través de:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Email: info@corpicia.com</li>
              <li>WhatsApp: +595 992 588 770</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
