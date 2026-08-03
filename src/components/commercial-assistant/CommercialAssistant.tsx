'use client';

import { FormEvent, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  askCommercialAssistant,
  type CommercialAssistantHistoryItem,
  type CommercialAssistantProduct,
} from '@/lib/actions/commercial-assistant';
import { AssistantProductCard } from './AssistantProductCard';

type AssistantResponse = {
  answer: string;
  followUpQuestion?: string;
  products: CommercialAssistantProduct[];
};

const quickQuestions = [
  'Quiero elegir un césped',
  'Necesito un sistema de riego',
  'Quiero preparar el terreno',
  'Necesito cuidar mi jardín',
  'Ayudame a armar un presupuesto',
];

export function CommercialAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] =
    useState<AssistantResponse | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<
    CommercialAssistantHistoryItem[]
  >([]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const submitQuestion = async (
    question: string
  ) => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) return;

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const currentHistory = [...history];

      const result = await askCommercialAssistant(
        cleanQuestion,
        currentHistory
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      setResponse({
        answer: result.answer,
        followUpQuestion:
          result.followUpQuestion,
        products: result.products,
      });

      const updatedHistory: CommercialAssistantHistoryItem[] = [
        ...currentHistory,
        {
          role: 'user',
          content: cleanQuestion,
        },
        {
          role: 'assistant',
          content: [
            result.answer,
            result.followUpQuestion,
          ]
            .filter(Boolean)
            .join(' '),
        },
      ];

      setHistory(updatedHistory.slice(-10));

      setMessage('');
    } catch {
      setError(
        'No pudimos responder en este momento. Probá nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    void submitQuestion(message);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-5 z-[60] flex items-center gap-2 rounded-full bg-green-700 px-4 py-3 text-sm font-medium text-white shadow-xl transition hover:bg-green-800"
        aria-label="Abrir asistente comercial"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">
          ¿Necesitás ayuda?
        </span>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Cerrar asistente"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[70] bg-black/40"
          />

          <aside className="fixed bottom-0 left-0 z-[80] flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:bottom-5 sm:left-5 sm:w-[420px] sm:rounded-2xl">
            <header className="flex items-center justify-between bg-green-700 px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/15 p-2">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Oscar, el jardinero
                  </h2>
                  <p className="text-xs text-green-100">
                    Asesor de jardinería de Corpicia
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
              <div className="rounded-xl rounded-tl-sm border bg-white p-3 text-sm text-gray-700 shadow-sm">
                ¡Hola! Soy Oscar, el jardinero de Corpicia. Contame qué querés hacer en tu jardín y vemos juntos qué opción te conviene.
              </div>

              {!response && !loading && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Consultas rápidas
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question) => (
                      <button
                        type="button"
                        key={question}
                        onClick={() =>
                          void submitQuestion(question)
                        }
                        className="rounded-full border border-green-200 bg-white px-3 py-2 text-left text-xs text-green-800 hover:bg-green-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-3 rounded-xl border bg-white p-4 text-sm text-gray-600">
                  <Loader2 className="h-5 w-5 animate-spin text-green-700" />
                  Oscar está revisando las mejores opciones...
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {response && (
                <div className="space-y-3">
                  <div className="rounded-xl rounded-tl-sm border bg-white p-3 text-sm leading-relaxed text-gray-700 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 font-medium text-green-800">
                      <Sparkles className="h-4 w-4" />
                      Recomendación
                    </div>

                    <p>{response.answer}</p>

                    {response.followUpQuestion && (
                      <p className="mt-3 font-medium text-gray-900">
                        {response.followUpQuestion}
                      </p>
                    )}
                  </div>

                  {response.products.length > 0 && (
                    <div className="space-y-2">
                      {response.products.map(
                        (product) => (
                          <AssistantProductCard
                            key={product.id}
                            product={product}
                          />
                        )
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setResponse(null);
                        setError('');
                      }}
                      className="text-xs font-medium text-green-700 hover:underline"
                    >
                      Continuar conversación
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setResponse(null);
                        setError('');
                        setHistory([]);
                        setMessage('');
                      }}
                      className="text-xs text-gray-500 hover:underline"
                    >
                      Nueva conversación
                    </button>
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex gap-2 border-t bg-white p-3"
            >
              <input
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                maxLength={600}
                disabled={loading}
                placeholder="Ej.: Necesito regar un patio de 100 m²"
                className="h-11 flex-1 rounded-full border px-4 text-sm outline-none focus:border-green-600"
              />

              <Button
                type="submit"
                size="icon"
                disabled={
                  loading || message.trim().length < 3
                }
                className="h-11 w-11 shrink-0 rounded-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>

            <p className="border-t bg-white px-4 py-2 text-center text-[10px] text-gray-400">
              Las recomendaciones son orientativas. Confirmá los detalles técnicos con Corpicia.
            </p>
          </aside>
        </>
      )}
    </>
  );
}
