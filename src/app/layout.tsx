import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloatingButton } from '@/components/WhatsAppButton';
import { BudgetDrawer } from '@/components/BudgetDrawer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Corpicia - Césped Natural y Jardinería en Paraguay',
  description: 'Especialistas en césped natural, instalación y mantenimiento de jardines en Paraguay. Solicita tu presupuesto por WhatsApp.',
  keywords: 'césped, jardinería, Paraguay, Asunción, césped natural, paisajismo',
  authors: [{ name: 'Corpicia' }],
  openGraph: {
    title: 'Corpicia - Césped Natural y Jardinería',
    description: 'Especialistas en césped natural en Paraguay',
    type: 'website',
    locale: 'es_PY',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppFloatingButton />
        <BudgetDrawer />
      </body>
    </html>
  );
}
