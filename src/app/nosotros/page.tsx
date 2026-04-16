import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Users, Award, Heart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nosotros - Corpicia | Césped Natural en Paraguay',
  description: 'Conocé a Corpicia, especialistas en césped natural y jardinería en Paraguay. Más de 10 años de experiencia transformando espacios verdes.',
  alternates: {
    canonical: '/nosotros/',
  },
};

const values = [
  {
    icon: Leaf,
    title: 'Calidad',
    description: 'Seleccionamos los mejores productos para garantizar resultados excepcionales.',
  },
  {
    icon: Users,
    title: 'Compromiso',
    description: 'Trabajamos cerca de nuestros clientes para entender y cumplir sus necesidades.',
  },
  {
    icon: Award,
    title: 'Experiencia',
    description: 'Más de 10 años en el mercado nos respaldan.',
  },
  {
    icon: Heart,
    title: 'Pasión',
    description: 'Amamos lo que hacemos y eso se refleja en cada proyecto.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-corpicia-green text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sobre Corpicia
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Especialistas en césped natural y soluciones de jardinería en Paraguay.
            Transformamos espacios verdes con pasión y profesionalismo.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Nuestra Historia
          </h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-4">
              Corpicia nació de la pasión por los espacios verdes y el deseo de llevar 
              la mejor calidad en césped natural a los hogares y empresas de Paraguay.
            </p>
            <p className="mb-4">
              Desde nuestros inicios, nos hemos dedicado a seleccionar las mejores variedades 
              de césped, adaptadas al clima paraguayo, para garantizar jardines hermosos 
              y duraderos.
            </p>
            <p>
              Hoy, con más de 10 años de experiencia, seguimos comprometidos con la calidad 
              y la satisfacción de nuestros clientes, ofreciendo no solo productos de excelencia, 
              sino también asesoramiento profesional y servicios de instalación.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-corpicia-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-corpicia-green" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-gray-500 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-corpicia-green mb-2">10+</p>
            <p className="text-gray-600">Años de experiencia</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-corpicia-green mb-2">1000+</p>
            <p className="text-gray-600">Clientes satisfechos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-corpicia-green mb-2">50000+</p>
            <p className="text-gray-600">m² instalados</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-corpicia-green mb-2">50+</p>
            <p className="text-gray-600">Proyectos corporativos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
