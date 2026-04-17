import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { productsData, productsCatalog } from './productsData';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return productsCatalog.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = productsData[params.slug];

  if (!product) {
    return {
      title: 'Producto no encontrado | Corpicia',
      description: 'El producto solicitado no existe.',
    };
  }

  return {
    title: `${product.name} | Corpicia`,
    description: product.shortDescription || product.description,
    alternates: {
      canonical: `/productos/${product.slug}/`,
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = productsData[params.slug];

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b bg-[#f8faf8]">
        <div className="container mx-auto px-4 py-10">
          <Link
            href="/productos/"
            className="text-sm text-corpicia-green font-medium"
          >
            ← Volver a productos
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="rounded-2xl border bg-gray-50 min-h-[320px] flex items-center justify-center">
              <span className="text-gray-400">Imagen del producto</span>
            </div>

            <div>
              <p className="text-sm font-medium text-corpicia-green uppercase tracking-wide">
                {product.category}
              </p>

              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              <p className="mt-4 text-gray-600">
                {product.description}
              </p>

              <div className="mt-6">
                <p className="text-3xl font-bold text-corpicia-green">
                  Gs. {product.pricePerM2.toLocaleString('es-PY')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Unidad: {product.unit}
                </p>
                <p className="text-sm text-gray-500">
                  Mínimo: {product.minQuantity}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/presupuesto/">
                  <Button>
                    Agregar al presupuesto
                  </Button>
                </Link>

                <a
                  href="https://wa.me/595992588770"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>

              {product.features?.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Características
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {product.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Especificaciones
                  </h2>
                  <div className="rounded-xl border overflow-hidden">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-2 border-b last:border-b-0"
                      >
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-700">
                          {key}
                        </div>
                        <div className="px-4 py-3 text-gray-600">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
