import { getAdminProjects } from '@/lib/repositories/admin-projects';
import { ProjectsTable } from '@/components/admin/ProjectsTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProyectosPage() {
  const projects = await getAdminProjects();

  return (
    <div className="space-y-6">
      <ProjectsTable projects={projects} />
    </div>
  );
}
