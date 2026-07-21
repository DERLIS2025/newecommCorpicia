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
  const end = cleaned.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('La IA no devolvió un formato válido.');
  }

  return cleaned.slice(start, end + 1);
}

function normalizeContent(value: unknown): ProductAIContent {
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

  const specifications = Array.isArray(data.specifications)
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

  return {
    short_description: shortDescription,
    description,
    features,
    specifications,
    recommendations,
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
- Las especificaciones deben incluir únicamente datos deducibles con seguridad.
- Si no existen especificaciones confiables, devolver un arreglo vacío.
- Generar entre 1 y 3 recomendaciones de uso.
- No usar Markdown.
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
    const content = normalizeContent(parsed);

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
