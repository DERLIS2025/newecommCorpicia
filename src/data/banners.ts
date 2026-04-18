import { getWhatsAppUrl } from '@/lib/utils';

export type HomeBanner = {
  title: string;
  subtitle: string;
  imageDesktop: string;
  imageMobile: string;
  CTA: string;
  link: string;
  active: boolean;
  order: number;
};

export const homeHeroBanners: HomeBanner[] = [
  {
    title: 'Césped natural premium para transformar tus espacios',
    subtitle: 'Asesoría personalizada, instalación profesional y entrega en todo Paraguay.',
    imageDesktop: '/banners/hero-cesped-desktop.jpg',
    imageMobile: '/banners/hero-cesped-mobile.jpg',
    CTA: 'Ver productos',
    link: '/productos/',
    active: true,
    order: 1,
  },
  {
    title: 'Armá tu presupuesto por m² y enviá por WhatsApp',
    subtitle: 'Proceso simple, rápido y pensado para que cotices sin fricción.',
    imageDesktop: '/banners/hero-presupuesto-desktop.jpg',
    imageMobile: '/banners/hero-presupuesto-mobile.jpg',
    CTA: 'Ir a mi presupuesto',
    link: '/presupuesto/',
    active: true,
    order: 2,
  },
  {
    title: 'Soluciones para jardines residenciales y comerciales',
    subtitle: 'Productos confiables y acompañamiento en cada etapa de tu proyecto.',
    imageDesktop: '/banners/hero-soluciones-desktop.jpg',
    imageMobile: '/banners/hero-soluciones-mobile.jpg',
    CTA: 'Conocer servicios',
    link: '/servicios/',
    active: true,
    order: 3,
  },
];

export const homeSecondaryBanners: HomeBanner[] = [
  {
    title: 'Instalación profesional en Asunción y Gran Asunción',
    subtitle: 'Equipo técnico con experiencia en proyectos residenciales y corporativos.',
    imageDesktop: '/banners/instalacion-desktop.jpg',
    imageMobile: '/banners/instalacion-mobile.jpg',
    CTA: 'Solicitar asesoría',
    link: getWhatsAppUrl(),
    active: true,
    order: 1,
  },
  {
    title: 'Elegí productos destacados para tu jardín',
    subtitle: 'Catálogo curado para resultados duraderos y mantenimiento eficiente.',
    imageDesktop: '/banners/productos-desktop.jpg',
    imageMobile: '/banners/productos-mobile.jpg',
    CTA: 'Explorar catálogo',
    link: '/productos/',
    active: true,
    order: 2,
  },
];
