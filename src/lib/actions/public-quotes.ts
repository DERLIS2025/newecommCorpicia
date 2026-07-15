'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';

export type PublicQuoteState = {
  success: boolean;
  message: string;
  quoteId?: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

type QuoteItemInput = {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
};

export async function submitQuoteRequest(
  prevState: PublicQuoteState | null,
  formData: FormData
): Promise<PublicQuoteState> {
  try {
    if (!supabaseAdmin) {
      return { success: false, message: 'El servicio no está configurado.' };
    }

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const location = formData.get('location') as string;
    const notes = formData.get('notes') as string;
    const itemsJson = formData.get('items') as string;
    const totalAmount = parseInt(formData.get('totalAmount') as string);

    if (!name || !phone) {
      return { success: false, message: 'El nombre y el teléfono son obligatorios.' };
    }

    if (!itemsJson) {
      return { success: false, message: 'No hay productos en el presupuesto.' };
    }

    const items: QuoteItemInput[] = JSON.parse(itemsJson);

    if (items.length === 0) {
      return { success: false, message: 'No hay productos en el presupuesto.' };
    }

    // 1. Upsert Client (Search by phone first, then email if provided)
    // We try to find existing client by phone.
    let clientId: string | null = null;
    
    // We clean phone string for search
    const cleanPhone = phone.trim();
    
    const { data: existingClient, error: clientSearchError } = await (supabaseAdmin as any)
      .from('clients')
      .select('id')
      .eq('phone', cleanPhone)
      .limit(1)
      .maybeSingle();
      
    if (existingClient) {
      clientId = existingClient.id;
      // Optional: Update client's notes or location? For now we just use the ID.
    } else {
      // Create new client
      const fullNotes = [location ? `Ubicación/Ciudad: ${location}` : '', notes ? `Notas iniciales: ${notes}` : ''].filter(Boolean).join('\n');
      
      const { data: newClient, error: clientInsertError } = await (supabaseAdmin as any).from('clients')
        .insert({
          name: name.trim(),
          phone: cleanPhone,
          email: email?.trim() || null,
          notes: fullNotes || null,
        })
        .select('id')
        .single();
        
      if (clientInsertError) {
        console.error('Error creating client:', clientInsertError);
        return { success: false, message: 'Error al registrar los datos del cliente.' };
      }
      
      clientId = newClient.id;
    }

    // 2. Create Quote
    // Generate request_number (e.g. PRE-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const requestNumber = `PRE-${dateStr}-${randomCode}`;

    const { data: quote, error: quoteInsertError } = await (supabaseAdmin as any)
      .from('quotes')
      .insert({
        request_number: requestNumber,
        client_id: clientId,
        total_amount: totalAmount,
        currency: 'PYG',
        notes: notes?.trim() || null,
        status: 'Nuevo',
      })
      .select('id')
      .single();

    if (quoteInsertError) {
      console.error('Error creating quote:', quoteInsertError);
      return { success: false, message: 'Error al generar la solicitud de presupuesto.' };
    }

    // 3. Create Quote Items
    const quoteItemsInsert = items.map(item => ({
      quote_id: quote.id,
      product_id: isUuid(item.productId) ? item.productId : null,
      product_name_snapshot: item.productName,
      unit_snapshot: item.unit,
      unit_price_amount: item.unitPrice,
      quantity: item.quantity,
      subtotal_amount: item.total,
      metadata: {
        original_product_id: item.productId,
      },
    }));

    const { error: itemsInsertError } = await (supabaseAdmin as any)
      .from('quote_items')
      .insert(quoteItemsInsert);

    if (itemsInsertError) {
      console.error('Error creating quote items:', itemsInsertError);
      return { success: false, message: 'La solicitud se creó, pero no se pudieron guardar los productos. Intentá nuevamente.' };
    }

    // 4. Create History entry
    const { error: historyError } = await (supabaseAdmin as any)
      .from('quote_status_history')
      .insert({
        quote_id: quote.id,
        status: 'Nuevo',
        notes: 'Presupuesto recibido desde la web pública.',
      });

    return { success: true, message: 'Solicitud enviada correctamente. Te contactaremos pronto.', quoteId: quote.id };
  } catch (error: any) {
    console.error('Error in submitQuoteRequest:', error);
    return { success: false, message: 'Ocurrió un error inesperado al enviar la solicitud.' };
  }
}
