'use server';

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';

export type ProductAIInput = {
  name: string;
  category?: string;
  currentDescription?: string;
  currentShortDescription?: string;
};

export type ProductAIContent = {
  short_description: string;
  description: string;
  features: Array<{
    feature_text: string;
  }>;
  specifications: Array<{
    spec_key: string;
    spec_value: string;
  }>;
  recommendations: Array<{
    recommendation_text: string;
  }>;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
};

export type ProductAIResult =
  | {
      success: true;
      content: ProductAIContent;
    }
  | {
      success: false;
      message: string;
    };

function extractJson(text: string): string {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  const start = cleaned.indexOf('{');

  if (start === -1) {
    throw new Error('La IA no devolvió un formato JSON válido.');
  }

  let depth = 0;
  let insideString = false;
  let escaped = false;

  for (let index = start; index < cleaned.length; index += 1) {
    const character = cleaned[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (character === '\\' && insideString) {
      escaped = true;
      continue;
    }

    if (character === '"') {
      insideString = !insideString;
      continue;
    }

    if (insideString) {
      continue;
    }

    if (character === '{') {
      depth += 1;
    }

    if (character === '}') {
      depth -= 1;

      if (depth === 0) {
        return cleaned.slice(start, index + 1);
      }
    }
  }

  throw new Error('La respuesta de Gemini quedó incompleta.');
}

function buildFallbackSpecifications(
  name: string,
  category?: string
): ProductAIContent['specifications'] {
  const normalizedName = name.toLowerCase();
  const normalizedCategory = (category || '').toLowerCase();

  if (
    normalizedName.includes('césped') ||
    normalizedName.includes('cesped') ||
    normalizedCategory.includes('césped') ||
    normalizedCategory.includes('cesped')
  ) {
    return [
      {
        spec_key: 'Tipo de producto',
        spec_value: 'Césped natural',
      },
      {
        spec_key: 'Uso recomendado',
        spec_value: 'Jardines, patios y áreas verdes',
      },
      {
        spec_key: 'Presentación',
        spec_value:
          normalizedName.includes('m²') ||
          normalizedName.includes('m2')
            ? 'Venta por metro cuadrado'
            : 'Según presentación disponible',
      },
      {
        spec_key: 'Instalación',
        spec_value: 'Sobre terreno previamente preparado',
      },
      {
        spec_key: 'Mantenimiento',
        spec_value: 'Requiere riego, corte y cuidado periódico',
      },
    ];
  }

  if (
    normalizedCategory.includes('riego') ||
    normalizedName.includes('aspersor') ||
    normalizedName.includes('válvula') ||
    normalizedName.includes('valvula') ||
    normalizedName.includes('difusor')
  ) {
    return [
      {
        spec_key: 'Tipo de producto',
        spec_value: category || 'Accesorio para sistema de riego',
      },
      {
        spec_key: 'Uso recomendado',
        spec_value: 'Instalaciones de riego para jardines y áreas verdes',
      },
      {
        spec_key: 'Aplicación',
        spec_value: 'Uso en sistemas de riego compatibles',
      },
    ];
  }

  return [
    {
      spec_key: 'Categoría',
      spec_value: category || 'Producto de jardinería',
    },
    {
      spec_key: 'Uso recomendado',
      spec_value: 'Jardinería, paisajismo y mantenimiento de áreas verdes',
    },
    {
      spec_key: 'Presentación',
      spec_value: 'Según disponibilidad del producto',
    },
  ];
}

function normalizeContent(
  value: unknown,
  input: ProductAIInput
): ProductAIContent {
  if (!value || typeof value !== 'object') {
    throw new Error('La respuesta de IA está vacía.');
  }

  const data = value as Record<string, unknown>;

  const shortDescription = String(data.short_description ?? '').trim();
  const description = String(data.description ?? '').trim();

  const features = Array.isArray(data.features)
    ? data.features
        .map((item) => {
          if (typeof item === 'string') {
            return { feature_text: item.trim() };
          }

          if (item && typeof item === 'object') {
            return {
              feature_text: String(
                (item as Record<string, unknown>).feature_text ?? ''
              ).trim(),
            };
          }

          return { feature_text: '' };
        })
        .filter((item) => item.feature_text)
    : [];

  const generatedSpecifications = Array.isArray(data.specifications)
    ? data.specifications
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return { spec_key: '', spec_value: '' };
          }

          const specification = item as Record<string, unknown>;

          return {
            spec_key: String(specification.spec_key ?? '').trim(),
            spec_value: String(specification.spec_value ?? '').trim(),
          };
        })
        .filter((item) => item.spec_key && item.spec_value)
    : [];

  const specifications =
    generatedSpecifications.length > 0
      ? generatedSpecifications
      : buildFallbackSpecifications(input.name, input.category);

  const recommendations = Array.isArray(data.recommendations)
    ? data.recommendations
        .map((item) => {
          if (typeof item === 'string') {
            return { recommendation_text: item.trim() };
          }

          if (item && typeof item === 'object') {
            return {
              recommendation_text: String(
                (item as Record<string, unknown>).recommendation_text ?? ''
              ).trim(),
            };
          }

          return { recommendation_text: '' };
        })
        .filter((item) => item.recommendation_text)
    : [];

  if (!shortDescription || !description) {
    throw new Error('La IA no generó las descripciones necesarias.');
  }

  const seoTitle = String(data.seo_title ?? '').trim();
  const seoDescription = String(data.seo_description ?? '').trim();

  const seoKeywords = Array.isArray(data.seo_keywords)
    ? data.seo_keywords
        .map((keyword) => String(keyword ?? '').trim())
        .filter(Boolean)
        .slice(0, 12)
    : [];

  if (!seoTitle || !seoDescription) {
    throw new Error('La IA no generó los campos SEO necesarios.');
  }

  return {
    short_description: shortDescription,
    description,
    features,
    specifications,
    recommendations,
    seo_title: seoTitle,
    seo_description: seoDescription,
    seo_keywords: seoKeywords,
  };
}

export async function generateProductContentWithAI(
  input: ProductAIInput
): Promise<ProductAIResult> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: 'No autorizado. Iniciá sesión nuevamente.',
      };
    }

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role, is_active')
      .eq('user_id', user.id)
      .maybeSingle();

    if (
      !profile ||
      !profile.is_active ||
      !['owner', 'admin', 'editor'].includes(profile.role)
    ) {
      return {
        success: false,
        message: 'No tenés permisos para utilizar el asistente de IA.',
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        message: 'Gemini no está configurado en este entorno.',
      };
    }

    const name = input.name?.trim();

    if (!name) {
      return {
        success: false,
        message: 'Ingresá primero el nombre del producto.',
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Actuá como especialista técnico y redactor ecommerce de Corpicia Paraguay,
empresa dedicada a jardinería, césped, paisajismo, riego y productos relacionados.

Generá contenido comercial profesional, claro y realista para este producto:

Nombre: ${name}
Categoría: ${input.category?.trim() || 'Sin categoría indicada'}
Descripción corta actual: ${input.currentShortDescription?.trim() || 'No disponible'}
Descripción completa actual: ${input.currentDescription?.trim() || 'No disponible'}

Reglas obligatorias:
- Escribir en español claro, natural y profesional.
- No inventar medidas, materiales, potencia, alcance, garantía ni compatibilidad.
- No inventar stock, precio ni disponibilidad.
- No asegurar datos técnicos que no estén incluidos en el nombre.
- Evitar frases exageradas y genéricas.
- La descripción corta debe tener entre 120 y 180 caracteres.
- La descripción completa debe tener entre 2 y 4 párrafos breves.
- Generar entre 3 y 6 características.
- Generar entre 3 y 6 especificaciones comerciales útiles.
- Las especificaciones deben incluir únicamente información deducible con seguridad.
- Se pueden usar campos generales como tipo de producto, presentación, uso recomendado, aplicación, instalación y mantenimiento.
- No devolver el arreglo de especificaciones vacío.
- No inventar especie botánica, medidas exactas, caudal, presión, potencia, composición, garantía ni compatibilidad no confirmada.
- Generar entre 1 y 3 recomendaciones de uso.
- Crear un título SEO natural de máximo 60 caracteres.
- Crear una meta descripción de entre 140 y 160 caracteres.
- Incluir entre 5 y 10 palabras clave relevantes.
- Incluir Paraguay solamente cuando tenga sentido comercial.
- No repetir palabras de manera artificial.
- No inventar características técnicas.
- No usar Markdown.
- Devolver un único objeto JSON válido.
- No agregar explicaciones, comentarios ni texto antes o después del JSON.
- Devolver exclusivamente JSON válido, sin bloques de código.

Formato exacto:
{
  "short_description": "texto",
  "description": "texto",
  "features": [
    { "feature_text": "texto" }
  ],
  "specifications": [
    {
      "spec_key": "clave",
      "spec_value": "valor"
    }
  ],
  "recommendations": [
    { "recommendation_text": "texto" }
  ],
  "seo_title": "Título SEO",
  "seo_description": "Meta descripción SEO",
  "seo_keywords": [
    "palabra clave 1",
    "palabra clave 2"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;

    if (!responseText) {
      return {
        success: false,
        message: 'Gemini no devolvió contenido.',
      };
    }

    const parsed = JSON.parse(extractJson(responseText));
    const content = normalizeContent(parsed, input);

    return {
      success: true,
      content,
    };
  } catch (error) {
    console.error('[Product AI] Error:', error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'No se pudo generar el contenido con IA.',
    };
  }
}
