export default function AdminPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Panel en Preparación</h2>
      <p className="text-gray-600 mb-6">
        El panel de administración de Corpicia se encuentra en desarrollo (Sprint 0).
        Esta estructura es la base técnica para la futura implementación.
      </p>
      <div className="text-left bg-gray-50 p-4 rounded-lg text-sm text-gray-500 mb-6">
        <h3 className="font-bold mb-2">Próximos Sprints:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Configuración de Supabase Auth (Autenticación real).</li>
          <li>Implementación de Roles y Permisos (Middleware y RLS).</li>
          <li>CRUD de Productos y Categorías.</li>
          <li>Dashboard de Estadísticas.</li>
        </ul>
      </div>
    </div>
  );
}
