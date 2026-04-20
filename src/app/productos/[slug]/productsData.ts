import type { Product } from '@/types';

export type ProductDetail = Product & {
  features: string[];
  specifications: Record<string, string>;
  recommendations: string[];
  relatedSlugs?: string[];
};

const baseProductsCatalog: ProductDetail[] = [
  {
    id: '1',
    name: 'Césped Esmeralda m²',
    slug: 'cesped-esmeralda',
    description:
      'Césped natural premium de alta densidad y color verde intenso, ideal para jardines residenciales y zonas decorativas que buscan una apariencia uniforme, elegante y de rápida cobertura.',
    shortDescription:
      'Césped premium de color intenso, cobertura uniforme y excelente presentación visual.',
    pricePerM2: 31000,
    unit: 'm2',
    minQuantity: 1,
    priceTiers: [
      { min: 1, max: 25, price: 48000, label: '1 a 25 m²' },
      { min: 26, max: 50, price: 43000, label: '26 a 50 m²' },
      { min: 51, max: null, price: 31000, label: 'Más de 50 m²', isPromo: true },
    ],
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Color verde uniforme',
      'Recuperación rápida',
      'Ideal para Asunción y Gran Asunción',
      'Bajo mantenimiento',
    ],
    recommendations: [
      'Ideal para jardines frontales, patios residenciales y áreas decorativas con buena exposición solar.',
      'Se recomienda instalar sobre superficie nivelada y con riego regular durante las primeras semanas.',
      'Combina muy bien con senderos ecológicos, bordes decorativos y sistemas de riego automático.',
      'Un corte periódico ayuda a conservar su color, densidad y presentación uniforme.',
    ],
    relatedSlugs: [
      'cesped-siempre-verde',
      'cesped-kavaju',
      'servicio-mantenimiento-jardin',
      'mini-rotor-rain-bird-3500',
    ],
    specifications: {
      Tipo: 'Césped natural',
      Presentación: 'm²',
      Resistencia: 'Alta',
      Uso: 'Residencial y comercial',
    },
  },
  {
    id: '2',
    name: 'Césped Siempre Verde m²',
    slug: 'cesped-siempre-verde',
    description:
      'Césped natural versátil y adaptable para proyectos residenciales, con cobertura verde constante y buena respuesta en climas cálidos durante gran parte del año.',
    shortDescription:
      'Césped adaptable con cobertura estable y apariencia verde durante todo el año.',
    pricePerM2: 25000,
    unit: 'm2',
    minQuantity: 1,
    priceTiers: [
      { min: 1, max: 25, price: 38000, label: '1 a 25 m²' },
      { min: 26, max: 50, price: 34000, label: '26 a 50 m²' },
      { min: 51, max: null, price: 25000, label: 'Más de 50 m²', isPromo: true },
    ],
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Alta adaptabilidad',
      'Textura agradable',
      'Crecimiento uniforme',
      'Buena tolerancia al sol',
    ],
    recommendations: [
      'Recomendado para jardines familiares, zonas de descanso y espacios de tránsito moderado.',
      'Funciona bien en superficies con exposición solar parcial o completa y suelo aireado.',
      'Puede combinarse con césped Esmeralda en sectores decorativos para un acabado más premium.',
      'Riego y fertilización programada ayudan a sostener su color y densidad en el tiempo.',
    ],
    relatedSlugs: [
      'cesped-esmeralda',
      'cesped-kavaju',
      'servicio-mantenimiento-jardin',
      'difusor-riego',
    ],
    specifications: {
      Tipo: 'Césped natural',
      Presentación: 'm²',
      Resistencia: 'Media/Alta',
      Uso: 'Residencial',
    },
  },
  {
    id: '3',
    name: 'Césped Kavaju m²',
    slug: 'cesped-kavaju',
    description:
      'Césped natural de perfil rústico y alta resistencia, recomendado para zonas amplias que requieren una opción durable, funcional y de mantenimiento práctico.',
    shortDescription:
      'Césped rústico y resistente para zonas amplias y proyectos de uso exigente.',
    pricePerM2: 25000,
    unit: 'm2',
    minQuantity: 1,
    priceTiers: [
      { min: 1, max: 25, price: 38000, label: '1 a 25 m²' },
      { min: 26, max: 50, price: 34000, label: '26 a 50 m²' },
      { min: 51, max: null, price: 25000, label: 'Más de 50 m²', isPromo: true },
    ],
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Rápida implantación',
      'Cobertura amplia',
      'Buena resistencia',
      'Mantenimiento simple',
    ],
    recommendations: [
      'Uso recomendado en áreas amplias, jardines de alto uso y espacios exteriores de mantenimiento sencillo.',
      'Para mejor desempeño, instalar sobre base compacta y capa de tierra fértil bien nivelada.',
      'Se complementa con pisos ecológicos en accesos para reducir barro y mejorar circulación.',
      'Necesita riego regular durante la implantación y cortes según ritmo de crecimiento.',
    ],
    relatedSlugs: [
      'cesped-esmeralda',
      'cesped-siempre-verde',
      'servicio-mantenimiento-jardin',
      'aspersor-rain-bird-5004',
    ],
    specifications: {
      Tipo: 'Césped natural',
      Presentación: 'm²',
      Resistencia: 'Alta',
      Uso: 'Zonas amplias',
    },
  },
  {
    id: '4',
    name: 'Césped Maní por Docena',
    slug: 'cesped-mani-docena',
    description:
      'Planta tapizante ornamental ideal para cubrir espacios decorativos, canteros y bordes verdes de bajo porte con una presentación prolija y natural.',
    shortDescription:
      'Tapizante ornamental por docena para canteros, bordes y espacios decorativos.',
    pricePerM2: 18000,
    unit: 'docena',
    minQuantity: 1,
    images: [],
    category: 'ornamentales',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Formato por docena',
      'Cobertura decorativa',
      'Bajo porte',
      'Ideal para canteros',
    ],
    recommendations: [
      'Ideal para bordes de jardín, canteros y zonas ornamentales con necesidad de cobertura baja.',
      'Se recomienda plantar en suelos sueltos, con buena humedad inicial y exposición solar moderada.',
      'Puede combinarse con piedras decorativas y separadores para lograr un paisajismo más prolijo.',
      'Requiere control periódico de malezas para mantener su presentación uniforme.',
    ],
    relatedSlugs: [
      'granza-blanca-fina-decorativa',
      'canto-rodado',
      'separador-cesped-caminos',
    ],
    specifications: {
      Tipo: 'Planta tapizante',
      Presentación: 'Docena',
      Resistencia: 'Media',
      Uso: 'Decorativo',
    },
  },
  {
    id: '5',
    name: 'Granza Blanca Fina Decorativa',
    slug: 'granza-blanca-fina-decorativa',
    description:
      'Piedra decorativa blanca para diseño de jardines modernos, senderos y terminaciones de paisajismo con un acabado limpio, luminoso y elegante.',
    shortDescription:
      'Piedra decorativa blanca para paisajismo moderno y terminaciones premium.',
    pricePerM2: 45000,
    unit: 'm2',
    minQuantity: 2,
    images: [],
    category: 'decorativos',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Color blanco fino',
      'Acabado elegante',
      'Bajo mantenimiento',
      'Ideal para contraste',
    ],
    recommendations: [
      'Ideal para senderos, terminaciones decorativas y jardines con diseño contemporáneo.',
      'Se recomienda colocar sobre manta antihierbas o base nivelada para mejor acabado.',
      'Combina muy bien con césped natural, bordes separadores y pisos exteriores.',
      'Una limpieza periódica ayuda a conservar su color claro y aspecto prolijo.',
    ],
    relatedSlugs: [
      'canto-rodado',
      'separador-cesped-caminos',
      'piso-ecologico-40x60',
    ],
    specifications: {
      Tipo: 'Piedra decorativa',
      Presentación: 'Bolsa/por m²',
      Uso: 'Paisajismo',
      Origen: 'Paraguay',
    },
  },
  {
    id: '6',
    name: 'Canto Rodado',
    slug: 'canto-rodado',
    description:
      'Piedra redondeada para drenajes, decoración de jardines y terminaciones en zonas de alto tránsito con aspecto natural y gran durabilidad.',
    shortDescription:
      'Piedra versátil para jardín, drenaje y terminaciones paisajísticas durables.',
    pricePerM2: 42000,
    unit: 'm2',
    minQuantity: 2,
    images: [],
    category: 'decorativos',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Buena drenabilidad',
      'Aspecto natural',
      'Alta durabilidad',
      'Uso múltiple',
    ],
    recommendations: [
      'Recomendado para drenajes, bordes de jardín, canteros y zonas con humedad frecuente.',
      'Puede instalarse sobre geotextil o base estabilizada para un mejor control de malezas.',
      'Aporta un acabado natural y combina bien con césped, plantas ornamentales y piedra blanca.',
      'Es una opción práctica para áreas donde se busca bajo mantenimiento.',
    ],
    relatedSlugs: [
      'granza-blanca-fina-decorativa',
      'piso-ecologico-40x60',
      'separador-cesped-caminos',
    ],
    specifications: {
      Tipo: 'Piedra decorativa',
      Presentación: 'Bolsa/por m²',
      Uso: 'Jardín y drenaje',
      Acabado: 'Natural',
    },
  },
  {
    id: '7',
    name: 'Separador de Césped y Caminos',
    slug: 'separador-cesped-caminos',
    description:
      'Perfil separador para definir bordes entre césped, canteros y caminos con un acabado profesional, ordenado y funcional.',
    shortDescription:
      'Separador para bordes prolijos entre césped, caminos y canteros.',
    pricePerM2: 25000,
    unit: 'unidad',
    minQuantity: 2,
    images: [],
    category: 'insumos-jardin',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Instalación simple',
      'Borde definido',
      'Mayor orden visual',
      'Apto exterior',
    ],
    recommendations: [
      'Ideal para delimitar áreas verdes, canteros y senderos con terminación profesional.',
      'Se recomienda instalar antes de colocar piedra decorativa o césped para mayor prolijidad.',
      'Combina muy bien con pisos exteriores y materiales decorativos en proyectos de paisajismo.',
      'Ayuda a reducir el desorden visual y mejora el mantenimiento del jardín.',
    ],
    relatedSlugs: [
      'granza-blanca-fina-decorativa',
      'canto-rodado',
      'pisos-imitacion-madera',
    ],
    specifications: {
      Tipo: 'Separador',
      Presentación: 'Unidad/metro lineal',
      Material: 'Polímero resistente',
      Uso: 'Exterior',
    },
  },
  {
    id: '8',
    name: 'Piso Ecológico 40x60',
    slug: 'piso-ecologico-40x60',
    description:
      'Piso ecológico drenante 40x60 para exteriores, ideal para controlar escorrentías, mejorar la seguridad al caminar y aportar un acabado funcional en terrazas, jardines y senderos.',
    shortDescription:
      'Piso drenante para exteriores con excelente funcionalidad, seguridad y fácil integración.',
    pricePerM2: 85000,
    unit: 'm2',
    minQuantity: 1,
    images: [],
    category: 'pisos-exteriores',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Formato 40x60',
      'Permite drenaje',
      'Alta durabilidad',
      'Acabado moderno',
    ],
    recommendations: [
      'Ideal para senderos de jardín, accesos peatonales, terrazas y zonas exteriores húmedas.',
      'Se recomienda instalar sobre base firme y nivelada para asegurar estabilidad y drenaje.',
      'Combina perfectamente con césped natural para crear áreas verdes funcionales y estéticas.',
      'Una limpieza periódica ayuda a conservar su textura y desempeño.',
    ],
    relatedSlugs: [
      'pisos-imitacion-madera',
      'granza-blanca-fina-decorativa',
      'separador-cesped-caminos',
    ],
    specifications: {
      Tipo: 'Piso ecológico',
      Formato: '40x60',
      Uso: 'Exterior',
      Resistencia: 'Alta',
    },
  },
  {
    id: '9',
    name: 'Pisos imitación madera',
    slug: 'pisos-imitacion-madera',
    description:
      'Solución estética para exteriores con apariencia madera y mejor resistencia a humedad, intemperie y uso continuo.',
    shortDescription:
      'Piso exterior símil madera con estética cálida y resistencia al uso diario.',
    pricePerM2: 97000,
    unit: 'm2',
    minQuantity: 1,
    images: [],
    category: 'pisos-exteriores',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Acabado símil madera',
      'Fácil limpieza',
      'Apto intemperie',
      'Aspecto premium',
    ],
    recommendations: [
      'Ideal para patios, galerías, quinchos y senderos donde se busca calidez visual.',
      'Se recomienda combinar con piedra decorativa o bordes verdes para un diseño más completo.',
      'Aporta apariencia premium sin las exigencias de mantenimiento de la madera natural.',
      'Limpiar periódicamente ayuda a conservar su textura y terminación.',
    ],
    relatedSlugs: [
      'piso-ecologico-40x60',
      'granza-blanca-fina-decorativa',
      'canto-rodado',
    ],
    specifications: {
      Tipo: 'Piso exterior',
      Acabado: 'Imitación madera',
      Uso: 'Patios y senderos',
      Resistencia: 'Alta',
    },
  },
  {
    id: '10',
    name: 'Aspersor Rain Bird 5004',
    slug: 'aspersor-rain-bird-5004',
    description:
      'Aspersor de alto rendimiento para sistemas de riego residencial y comercial con cobertura uniforme y regulación precisa.',
    shortDescription:
      'Aspersor Rain Bird para riego automático eficiente y cobertura uniforme.',
    pricePerM2: 105000,
    unit: 'unidad',
    minQuantity: 1,
    images: [],
    category: 'riego',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Cobertura uniforme',
      'Regulación precisa',
      'Durabilidad Rain Bird',
      'Ideal para césped',
    ],
    recommendations: [
      'Ideal para jardines residenciales y comerciales que requieren cobertura uniforme.',
      'Se recomienda integrarlo en sistemas con válvulas y difusores compatibles para mejor rendimiento.',
      'Aporta eficiencia hídrica y mejor distribución del agua en superficies medianas y amplias.',
      'Una revisión periódica del sistema ayuda a mantener el alcance y la presión adecuados.',
    ],
    relatedSlugs: [
      'valvula-riego-rain-bird',
      'mini-rotor-rain-bird-3500',
      'difusor-riego',
    ],
    specifications: {
      Tipo: 'Aspersor',
      Marca: 'Rain Bird',
      Modelo: '5004',
      Uso: 'Riego automático',
    },
  },
  {
    id: '11',
    name: 'Válvula de Riego Rain Bird',
    slug: 'valvula-riego-rain-bird',
    description:
      'Válvula para control de sectores de riego con excelente desempeño, confiabilidad y funcionamiento estable.',
    shortDescription:
      'Válvula de riego profesional para controlar sectores con precisión.',
    pricePerM2: 89000,
    unit: 'unidad',
    minQuantity: 1,
    images: [],
    category: 'riego',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Control por sectores',
      'Alta confiabilidad',
      'Instalación estándar',
      'Baja mantención',
    ],
    recommendations: [
      'Recomendada para automatizar sectores de riego en jardines residenciales y comerciales.',
      'Conviene instalarla junto con aspersores y mini rotores de la misma línea para mejor compatibilidad.',
      'Ayuda a ordenar el sistema de riego y mejorar el control por zonas.',
      'Se sugiere revisión técnica periódica para mantener su funcionamiento óptimo.',
    ],
    relatedSlugs: [
      'aspersor-rain-bird-5004',
      'mini-rotor-rain-bird-3500',
      'difusor-riego',
    ],
    specifications: {
      Tipo: 'Válvula',
      Marca: 'Rain Bird',
      Uso: 'Sistemas de riego',
      Presión: 'Media/Alta',
    },
  },
  {
    id: '12',
    name: 'Difusor de Riego',
    slug: 'difusor-riego',
    description:
      'Difusor para cobertura puntual en zonas de jardinería de pequeño y mediano tamaño, ideal para canteros y césped.',
    shortDescription:
      'Difusor de riego para cobertura puntual en jardines, canteros y áreas verdes.',
    pricePerM2: 55000,
    unit: 'unidad',
    minQuantity: 1,
    images: [],
    category: 'riego',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Cobertura precisa',
      'Fácil ajuste',
      'Ideal para jardines',
      'Consumo eficiente',
    ],
    recommendations: [
      'Ideal para canteros, bordes verdes y sectores donde se requiere riego puntual.',
      'Se recomienda usarlo en áreas pequeñas o como complemento de un sistema mayor.',
      'Ayuda a mejorar la distribución del agua sin desperdicio en zonas específicas.',
      'Conviene revisar boquillas y salida de agua de forma periódica.',
    ],
    relatedSlugs: [
      'aspersor-rain-bird-5004',
      'valvula-riego-rain-bird',
      'mini-rotor-rain-bird-3500',
    ],
    specifications: {
      Tipo: 'Difusor',
      Uso: 'Riego localizado',
      Cobertura: 'Baja/Media',
      Instalación: 'Simple',
    },
  },
  {
    id: '13',
    name: 'Mini Rotor Rain Bird 3500',
    slug: 'mini-rotor-rain-bird-3500',
    description:
      'Mini rotor para cobertura uniforme en jardines medianos, con regulación de alcance y sector para un riego técnico más eficiente.',
    shortDescription:
      'Mini rotor Rain Bird para riego técnico uniforme en jardines medianos.',
    pricePerM2: 76000,
    unit: 'unidad',
    minQuantity: 1,
    images: [],
    category: 'riego',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Ajuste de alcance',
      'Cobertura uniforme',
      'Marca Rain Bird',
      'Uso residencial/comercial',
    ],
    recommendations: [
      'Ideal para jardines medianos que requieren riego uniforme y control del alcance.',
      'Se recomienda combinarlo con válvulas y aspersores compatibles para lograr mejor rendimiento.',
      'Es una buena opción para proyectos con distribución por sectores.',
      'Una correcta regulación inicial mejora cobertura y ahorro de agua.',
    ],
    relatedSlugs: [
      'aspersor-rain-bird-5004',
      'valvula-riego-rain-bird',
      'difusor-riego',
    ],
    specifications: {
      Tipo: 'Mini rotor',
      Marca: 'Rain Bird',
      Modelo: '3500',
      Uso: 'Riego automático',
    },
  },
  {
    id: '14',
    name: 'Servicio mantenimiento de jardín',
    slug: 'servicio-mantenimiento-jardin',
    description:
      'Servicio periódico de mantenimiento para conservar césped, canteros y sistema de riego en óptimas condiciones durante todo el año.',
    shortDescription:
      'Mantenimiento integral de jardín en Asunción y alrededores con enfoque preventivo.',
    pricePerM2: 150000,
    unit: 'visita',
    minQuantity: 1,
    images: [],
    category: 'servicios',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Visita técnica',
      'Plan de mantenimiento',
      'Control preventivo',
      'Cobertura en Asunción',
    ],
    recommendations: [
      'Ideal para propietarios que desean conservar su jardín en buen estado sin perder tiempo operativo.',
      'Recomendado como complemento de instalación de césped o sistema de riego.',
      'Ayuda a prevenir desgaste, malezas y fallas en el sistema antes de que generen costos mayores.',
      'Puede programarse de forma periódica según tamaño del jardín y nivel de uso.',
    ],
    relatedSlugs: [
      'cesped-esmeralda',
      'cesped-siempre-verde',
      'cesped-kavaju',
      'mini-rotor-rain-bird-3500',
    ],
    specifications: {
      Tipo: 'Servicio',
      Modalidad: 'Por visita',
      Cobertura: 'Asunción y Gran Asunción',
      Incluye: 'Evaluación y tareas de mantenimiento',
    },
  },
];

const withImages = (product: ProductDetail): ProductDetail => ({
  ...product,
  images:
    product.images && product.images.length > 0
      ? product.images
      : [`/productos/${product.slug}.jpg`],
});

export const productsCatalog = baseProductsCatalog.map(withImages);

export const productsData: Record<string, ProductDetail> = Object.fromEntries(
  productsCatalog.map((p) => [p.slug, p])
);

export const productCategories = [
  { id: 'all', name: 'Todos', slug: 'all' },
  { id: 'cesped-natural', name: 'Césped Natural', slug: 'cesped-natural' },
  { id: 'ornamentales', name: 'Ornamentales', slug: 'ornamentales' },
  { id: 'decorativos', name: 'Decorativos', slug: 'decorativos' },
  { id: 'insumos-jardin', name: 'Insumos de Jardín', slug: 'insumos-jardin' },
  { id: 'pisos-exteriores', name: 'Pisos Exteriores', slug: 'pisos-exteriores' },
  { id: 'riego', name: 'Riego', slug: 'riego' },
  { id: 'servicios', name: 'Servicios', slug: 'servicios' },
];

export function getRelatedProducts(product: ProductDetail, limit = 4): ProductDetail[] {
  const unique = new Map<string, ProductDetail>();

  (product.relatedSlugs || []).forEach((slug) => {
    const related = productsData[slug];
    if (related && related.slug !== product.slug) {
      unique.set(related.slug, related);
    }
  });

  productsCatalog.forEach((item) => {
    if (unique.size >= limit) return;
    if (item.slug !== product.slug && !unique.has(item.slug)) {
      unique.set(item.slug, item);
    }
  });

  return Array.from(unique.values()).slice(0, limit);
}
