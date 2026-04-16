import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad - Corpicia',
  description: 'Política de privacidad y protección de datos de Corpicia.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Política de Privacidad
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Información que Recopilamos</h2>
            <p className="text-gray-600 mb-4">
              En Corpicia, recopilamos la siguiente información cuando utilizás nuestro sitio web:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Nombre y apellido</li>
              <li>Correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Información sobre tu proyecto o consulta</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Uso de la Información</h2>
            <p className="text-gray-600 mb-4">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Responder a tus consultas y solicitudes de presupuesto</li>
              <li>Procesar y coordinar la entrega de productos</li>
              <li>Enviar información sobre nuestros productos y servicios (con tu consentimiento)</li>
              <li>Mejorar nuestros servicios y la experiencia del usuario</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Protección de Datos</h2>
            <p className="text-gray-600 mb-4">
              Implementamos medidas de seguridad apropiadas para proteger tu información personal 
              contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Cookies</h2>
            <p className="text-gray-600 mb-4">
              Nuestro sitio utiliza cookies para mejorar la experiencia del usuario. 
              Podés configurar tu navegador para rechazar cookies, aunque esto puede 
              afectar la funcionalidad del sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Tus Derechos</h2>
            <p className="text-gray-600 mb-4">
              Tenés derecho a:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Acceder a tu información personal</li>
              <li>Solicitar la corrección de datos incorrectos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al procesamiento de tus datos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Contacto</h2>
            <p className="text-gray-600">
              Para ejercer tus derechos o realizar consultas sobre esta política, contactanos:
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
