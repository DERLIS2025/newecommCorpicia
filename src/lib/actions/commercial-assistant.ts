'use server';

import { GoogleGenAI } from '@google/genai';
import { getProducts } from '@/lib/repositories/products';

export type CommercialAssistantProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerM2: number;
  unit: 'm2' | 'docena' | 'unidad' | 'visita' | 'servicio';
  priceTiers?: Array<{
    min: number;
    max: number | null;
    price: number;
    label: string;
    isPromo?: boolean;
  }>;
  minQuantity: number;
  images: string[];
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CommercialAssistantResult =
  | {
      success: true;
      answer: string;
      followUpQuestion?: string;
      products: CommercialAssistantProduct[];
    }
  | {
      success: false;
      message: string;
    };

type AIResponse = {
  answer?: string;
  follow_up_question?: string;
  product_slugs?: string[];
};

function extractJson(text: string): string {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  const start = cleaned.indexOf('{');

  if (start === -1) {
    throw new Error('La IA no devolvió una respuesta válida.');
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

    if (insideString) continue;

    if (character === '{') depth += 1;

    if (character === '}') {
      depth -= 1;

      if (depth === 0) {
        return cleaned.slice(start, index + 1);
      }
    }
  }

  throw new Error('La respuesta de la IA quedó incompleta.');
}

function normalizeText(value: unknown, maxLength: number) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function mapProduct(product: any): CommercialAssistantProduct {
  return {
    id: String(product.id),
    name: String(product.name || ''),
    slug: String(product.slug || ''),
    description: String(product.description || ''),
    shortDescription:
      product.shortDescription ||
      product.short_description ||
      '',
    pricePerM2: Number(
      product.pricePerM2 ??
      product.price_amount ??
      0
    ),
    unit: product.unit || 'unidad',
    priceTiers: Array.isArray(product.priceTiers)
      ? product.priceTiers.map((tier: any) => ({
          min: Number(tier.min ?? tier.minQuantity ?? 1),
          max:
            tier.max === null ||
            tier.maxQuantity === null
              ? null
              : Number(tier.max ?? tier.maxQuantity),
          price: Number(tier.price || 0),
          label: String(tier.label || ''),
          isPromo: Boolean(tier.isPromo),
        }))
      : [],
    minQuantity: Number(
      product.minQuantity ??
      product.min_order_quantity ??
      1
    ),
    images: Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [],
    category: String(product.category || ''),
    isActive:
      product.isActive ??
      product.is_active ??
      true,
    isFeatured:
      product.isFeatured ??
      product.is_featured ??
      false,
    createdAt: String(
      product.createdAt ??
      product.created_at ??
      ''
    ),
    updatedAt: String(
      product.updatedAt ??
      product.updated_at ??
      ''
    ),
  };
}

export async function askCommercialAssistant(
  message: string
): Promise<CommercialAssistantResult> {
  try {
    const question = normalizeText(message, 600);

    if (question.length < 3) {
      return {
        success: false,
        message: 'Contame un poco más sobre lo que necesitás.',
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        message:
          'El asistente comercial no está disponible en este momento.',
      };
    }

    const rawProducts = await getProducts();

    const products = rawProducts
      .filter((product: any) => {
        const active =
          product.isActive ??
          product.is_active ??
          true;

        return active && product.slug && product.name;
      })
      .map(mapProduct);

    if (products.length === 0) {
      return {
        success: false,
        message:
          'No encontramos productos disponibles para recomendar.',
      };
    }

    const compactCatalog = products
      .slice(0, 250)
      .map((product) => ({
        slug: product.slug,
        nombre: product.name,
        categoria: product.category,
        descripcion: normalizeText(
          product.shortDescription ||
            product.description,
          220
        ),
        precio_base: product.pricePerM2,
        unidad: product.unit,
        cantidad_minima: product.minQuantity,
      }));

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Actuá como asesor comercial de Corpicia Paraguay, empresa especializada en
césped natural, jardinería, paisajismo, riego y mantenimiento de áreas verdes.

Consulta del cliente:
${question}

Catálogo real disponible:
${JSON.stringify(compactCatalog)}

Reglas obligatorias:
- Respondé en español claro, breve, amable y comercial.
- Recomendá únicamente productos presentes en el catálogo proporcionado.
- Nunca inventes productos, precios, stock, medidas ni características técnicas.
- No cambies los precios.
- Elegí como máximo 4 productos.
- Usá exactamente los slug del catálogo.
- Explicá brevemente por qué cada recomendación ayuda al cliente.
- Cuando falten datos importantes, agregá una pregunta de seguimiento.
- No asegures cálculos técnicos exactos sin datos suficientes.
- Podés orientar, pero aclarando cuando una cantidad es estimada.
- No uses Markdown.
- No agregues texto fuera del JSON.

Devolvé exactamente este formato:
{
  "answer": "respuesta breve para el cliente",
  "follow_up_question": "pregunta opcional o cadena vacía",
  "product_slugs": [
    "slug-real-del-catalogo"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    });

    if (!response.text) {
      return {
        success: false,
        message:
          'No pudimos generar una recomendación. Probá nuevamente.',
      };
    }

    const parsed = JSON.parse(
      extractJson(response.text)
    ) as AIResponse;

    const answer = normalizeText(parsed.answer, 1000);

    if (!answer) {
      throw new Error('La IA no generó una respuesta.');
    }

    const requestedSlugs = Array.isArray(
      parsed.product_slugs
    )
      ? parsed.product_slugs
          .map((slug) => normalizeText(slug, 150))
          .filter(Boolean)
          .slice(0, 4)
      : [];

    const validatedProducts = requestedSlugs
      .map((slug) =>
        products.find((product) => product.slug === slug)
      )
      .filter(
        (
          product
        ): product is CommercialAssistantProduct =>
          Boolean(product)
      );

    return {
      success: true,
      answer,
      followUpQuestion: normalizeText(
        parsed.follow_up_question,
        300
      ),
      products: validatedProducts,
    };
  } catch (error) {
    console.error(
      '[Commercial Assistant] Error:',
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'No pudimos procesar tu consulta.',
    };
  }
}
