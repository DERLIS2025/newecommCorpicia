import { createClient } from '../supabase/server';
import { Leaf, Droplets, TreePine, Home } from 'lucide-react';

export const fallbackServices = [
  {
    title: 'Instalación de Césped',
    description: 'Instalación profesional de césped natural con preparación del terreno, nivelación y siembra o colocación de tepes.',
    icon: Leaf,
    features: [
      'Evaluación del terreno',
      'Preparación y nivelación',
      'Instalación de tepes o siembra',
      'Garantía de instalación',
    ],
  },
  {
    title: 'Sistemas de Riego',
    description: 'Diseño e instalación de sistemas de riego automático para mantener tu jardín siempre hidratado.',
    icon: Droplets,
    features: [
      'Diseño personalizado',
      'Instalación de aspersores',
      'Programadores automáticos',
      'Mantenimiento',
    ],
  },
  {
    title: 'Paisajismo',
    description: 'Diseño y ejecución de proyectos de jardinería y paisajismo para espacios residenciales y comerciales.',
    icon: TreePine,
    features: [
      'Diseño 3D del proyecto',
      'Selección de plantas',
      'Ejecución integral',
      'Mantenimiento continuo',
    ],
  },
  {
    title: 'Mantenimiento',
    description: 'Servicio de mantenimiento regular para mantener tu jardín en óptimas condiciones todo el año.',
    icon: Home,
    features: [
      'Corte y bordes',
      'Fertilización',
      'Control de plagas',
      'Poda de plantas',
    ],
  },
];

export async function getServices() {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'static') {
    return fallbackServices;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.error('Error fetching public services or no active services found, using fallback', error);
      return fallbackServices;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching public services, using fallback:', error);
    return fallbackServices;
  }
}
