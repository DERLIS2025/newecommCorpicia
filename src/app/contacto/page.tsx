import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contacto - Corpicia | Césped Natural en Paraguay',
  description: 'Contactanos para solicitar tu presupuesto. Atendemos Asunción y todo Paraguay. WhatsApp: +595 992 588 770',
  alternates: {
    canonical: '/contacto/',
  },
};

const contactInfo = [
  {
    icon: Phone,
    title: 'Teléfono / WhatsApp',
    content: '+595 992 588 770',
    link: getWhatsAppUrl(),
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'info@corpicia.com',
    link: 'mailto:info@corpicia.com',
  },
  {
    icon: MapPin,
    title: 'Ubicación',
    content: 'Asunción, Paraguay',
    link: '#',
  },
  {
    icon: Clock,
    title: 'Horario de Atención',
    content: 'Lun - Vie: 8:00 - 18:00',
    link: null,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-corpicia-green text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contactanos
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Solicitá tu presupuesto o consultanos 
            sobre nuestros productos y servicios.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envianos un mensaje
            </h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <Input placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <Input placeholder="Tu apellido" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input type="email" placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <Input placeholder="+595 XXX XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-corpicia-green focus:border-transparent resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>
                <a
                  href={getWhatsAppUrl('Hola, quiero hacer una consulta desde el formulario de contacto.')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full h-12">
                    Enviar Mensaje
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Información de Contacto
            </h2>
            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-corpicia-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-corpicia-green" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{info.title}</h3>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </div>
                );

                return info.link ? (
                  <a
                    key={info.title}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        {content}
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <Card key={info.title}>
                    <CardContent className="p-4">
                      {content}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <Card className="mt-6 bg-green-500 text-white border-0">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">
                  ¿Preferís escribirnos por WhatsApp?
                </h3>
                <p className="text-white/90 mb-4">
                  Respondemos más rápido por mensaje
                </p>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white text-green-500 hover:bg-gray-100">
                    <Phone className="w-5 h-5 mr-2" />
                    Escribir por WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
