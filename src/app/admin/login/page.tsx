'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/lib/actions/admin-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors
        ${pending ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
    >
      {pending ? 'Iniciando sesión...' : 'Ingresar al Panel'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/productos');
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Corpicia Admin</h1>
          <p className="text-gray-500 text-sm mt-2">Acceso exclusivo para administradores</p>
        </div>

        {state?.success === false && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="admin@corpicia.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
