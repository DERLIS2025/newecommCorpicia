import type { Metadata } from 'next';
import PresupuestoClient from './PresupuestoClient';

import { getSeoEntry } from '@/lib/repositories/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoEntry('/presupuesto');

  const defaultMeta = {
    title: 'Mi Presupuesto - Corpicia',
    description: 'Revisa tu presupuesto y solicítalo por WhatsApp. Césped natural y jardinería en Paraguay.',
    alternates: { canonical: '/presupuesto/' },
  };

  if (!seo) return defaultMeta;

  const seoTitle = seo.title || defaultMeta.title;
  const seoDescription = seo.description || defaultMeta.description;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seo.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : undefined,
    alternates: defaultMeta.alternates,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: seo.og_image ? [{ url: seo.og_image }] : undefined,
    },
    twitter: {
      title: seoTitle,
      description: seoDescription,
      images: seo.og_image ? [seo.og_image] : undefined,
    }
  };
}

export default function Page() {
  return <PresupuestoClient />;
}