'use client';

export default function LoginPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Acceso Restringido</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-6 text-sm">
        <p className="font-semibold mb-1">Estado: Sprint 0</p>
        <p>La autenticación con Supabase aún no está implementada. No ingrese credenciales.</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed" 
            placeholder="admin@corpicia.com" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed" 
            placeholder="••••••••" 
          />
        </div>
        <button 
          disabled
          className="w-full bg-corpicia-green text-white font-medium py-2 rounded-lg opacity-50 cursor-not-allowed"
        >
          Iniciar Sesión (Próximamente)
        </button>
      </form>
    </div>
  );
}
