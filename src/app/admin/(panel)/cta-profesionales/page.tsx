import {
  getProfessionalCta,
} from '@/lib/repositories/professional-cta';

import {
  ProfessionalCtaSettingsForm,
} from '@/components/admin/ProfessionalCtaSettingsForm';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function ProfessionalCtaAdminPage() {
  const settings = await getProfessionalCta();

  return (
    <div className="space-y-6 max-w-4xl">

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Banner para Profesionales
        </h1>

        <p className="text-gray-500 mt-1">
          Administrá la sección comercial dirigida a jardineros,
          paisajistas y profesionales.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Contenido de la sección
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ProfessionalCtaSettingsForm
            initialData={settings}
          />
        </CardContent>
      </Card>

    </div>
  );
}
