import type { Metadata } from 'next';
import PresupuestoClient from './PresupuestoClient';

export const metadata: Metadata = {
  title: 'Mi Presupuesto - Corpicia',
  description: 'Revisa tu presupuesto y solicítalo por WhatsApp. Césped natural y jardinería en Paraguay.',
};

export default function BudgetPage() {
  return <PresupuestoClient />;
}
