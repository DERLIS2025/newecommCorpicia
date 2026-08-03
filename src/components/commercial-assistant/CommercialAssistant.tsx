'use client';

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from 'lucide-react';

import {
  askCommercialAssistant,
  type CommercialAssistantHistoryItem,
  type CommercialAssistantProduct,
} from '@/lib/actions/commercial-assistant';
import { AssistantProductCard } from './AssistantProductCard';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  followUpQuestion?: string;
  products?: CommercialAssistantProduct[];
  handoffToWhatsApp?: boolean;
};

const quickQuestions = [
  'Quiero elegir un césped',
  'Necesito un sistema de riego',
  'Quiero preparar el terreno',
  'Necesito cuidar mi jardín',
  'Ayudame a armar un presupuesto',
];

const initialMessage: ChatMessage = {
  id: 'oscar-welcome',
  role: 'assistant',
  content:
    '¡Hola! Soy Oscar, el jardinero de Corpicia. Contame qué querés hacer en tu jardín y vemos juntos qué opción te conviene.',
};

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function wait(milliseconds: number) {
  return new Promise((resolve) =>
    window.setTimeout(resolve, milliseconds)
  );
}

function buildWhatsAppUrl(
  messages: ChatMessage[]
) {
  const conversation = messages
    .filter(
      (item) => item.id !== 'oscar-welcome'
    )
    .slice(-8)
    .map((item) => {
      const speaker =
        item.role === 'user' ? 'Cliente' : 'Oscar';

      return `${speaker}: ${item.content}`;
    })
    .join('\n');

  const message = [
    'Hola, estuve conversando con Oscar desde la web de Corpicia.',
    '',
    conversation,
    '',
    'Quiero continuar con un asesor comercial y solicitar un presupuesto.',
  ].join('\n');

  return `https://wa.me/595992588770?text=${encodeURIComponent(message)}`;
}

export function CommercialAssistant() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialMessage,
  ]);
  const [history, setHistory] = useState<
    CommercialAssistantHistoryItem[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, loading, isOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const submitQuestion = async (question: string) => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: cleanQuestion,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage('');
    setLoading(true);
    setError('');

    const currentHistory = [...history];

    try {
      const result = await askCommercialAssistant(
        cleanQuestion,
        currentHistory
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: result.answer,
        followUpQuestion: result.followUpQuestion,
        products: result.products,
        handoffToWhatsApp:
          result.handoffToWhatsApp,
      };

      const naturalDelay = Math.min(
        1500,
        Math.max(650, result.answer.length * 8)
      );

      await wait(naturalDelay);

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);

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
    } catch {
      setError(
        'No pude responderte en este momento. Probá nuevamente.'
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

  const resetConversation = () => {
    setMessages([initialMessage]);
    setHistory([]);
    setMessage('');
    setError('');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-5 z-[60] flex items-center gap-2 rounded-full bg-green-700 px-4 py-3 text-sm font-medium text-white shadow-xl transition hover:bg-green-800"
        aria-label="Abrir chat con Oscar"
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
            aria-label="Cerrar chat"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[70] bg-black/40"
          />

          <aside className="fixed bottom-0 left-0 z-[80] flex h-[88vh] w-full flex-col overflow-hidden rounded-t-2xl bg-[#efeae2] shadow-2xl sm:bottom-5 sm:left-5 sm:h-[720px] sm:max-h-[88vh] sm:w-[420px] sm:rounded-2xl">
            <header className="flex flex-none items-center justify-between bg-green-700 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/15 p-2">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold">
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
                className="rounded-full p-2 transition hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
              {messages.map((chatMessage) => {
                const isUser = chatMessage.role === 'user';

                return (
                  <div
                    key={chatMessage.id}
                    className={`flex ${
                      isUser
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] ${
                        isUser
                          ? 'rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2.5 shadow-sm'
                          : 'space-y-2'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap text-sm font-normal leading-relaxed text-gray-900">
                          {chatMessage.content}
                        </p>
                      ) : (
                        <>
                          <div className="rounded-2xl rounded-tl-sm bg-white px-3 py-3 shadow-sm">
                            {chatMessage.id !==
                              'oscar-welcome' && (
                              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-green-700">
                                <Sparkles className="h-3.5 w-3.5" />
                                Oscar • Jardinero Corpicia
                              </div>
                            )}

                            <p className="whitespace-pre-wrap text-sm font-normal leading-relaxed text-gray-800">
                              {chatMessage.content}
                            </p>

                            {chatMessage.followUpQuestion && (
                              <p className="mt-3 text-sm font-medium leading-relaxed text-gray-900">
                                {
                                  chatMessage.followUpQuestion
                                }
                              </p>
                            )}
                          </div>

                          {chatMessage.products &&
                            chatMessage.products.length >
                              0 && (
                              <div className="space-y-2">
                                {chatMessage.products.map(
                                  (product) => (
                                    <AssistantProductCard
                                      key={`${chatMessage.id}-${product.id}`}
                                      product={product}
                                    />
                                  )
                                )}
                              </div>
                            )}

                          {chatMessage.handoffToWhatsApp && (
                            <a
                              href={buildWhatsAppUrl(messages)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#25D366] px-4 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:bg-[#20bd5a]"
                            >
                              Continuar con un asesor por WhatsApp
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {messages.length === 1 && !loading && (
                <div className="pt-1">
                  <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
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
                        className="rounded-full border border-green-200 bg-white px-3 py-2 text-left text-xs font-normal text-green-800 transition hover:bg-green-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-green-700" />
                    Oscar está escribiendo...
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {messages.length > 1 && !loading && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={resetConversation}
                    className="text-xs font-normal text-gray-500 hover:text-green-700 hover:underline"
                  >
                    Iniciar una conversación nueva
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-none items-end gap-2 border-t border-gray-200 bg-white p-3"
            >
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    if (message.trim() && !loading) {
                      void submitQuestion(message);
                    }
                  }
                }}
                placeholder="Escribile a Oscar..."
                rows={1}
                disabled={loading}
                className="max-h-24 min-h-[44px] flex-1 resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-normal text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />

              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-green-700 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-300"
                aria-label="Enviar mensaje"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>

            <p className="flex-none bg-white px-4 pb-3 text-center text-[10px] font-normal text-gray-400">
              Las recomendaciones son orientativas. Confirmá los
              detalles técnicos con Corpicia.
            </p>
          </aside>
        </>
      )}
    </>
  );
}
