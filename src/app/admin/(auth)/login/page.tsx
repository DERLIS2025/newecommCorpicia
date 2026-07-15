'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/lib/actions/admin-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full h-12 mt-2 flex items-center justify-center rounded-xl text-base font-bold text-white transition-all duration-300
        ${pending ? 'bg-corpicia-green/70 cursor-wait' : 'bg-corpicia-green hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5'}`}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Ingresando...
        </div>
      ) : (
        'Ingresar al panel'
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/productos');
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center w-full overflow-hidden bg-[#0f1f12]">
      {/* FONDO DE IMAGEN */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/admin/login-garden-bg.webp"
          alt="Fondo de Jardín"
          fill
          priority
          className="object-cover"
        />
        {/* Capa de oscurecimiento */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* TARJETA DE LOGIN */}
      <div className="relative z-10 w-[calc(100%-32px)] max-w-[420px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Contenido Superior */}
        <div className="px-8 pt-10 pb-6 flex flex-col items-center border-b border-gray-100/50 bg-white/50">
          <Image 
            src="/logo-corpicia.png" 
            alt="Corpicia" 
            width={180} 
            height={90}
            priority
            className="mb-6 object-contain drop-shadow-sm"
          />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Corpicia Admin</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Acceso exclusivo para administradores</p>
        </div>

        {/* Formulario */}
        <div className="px-8 py-8">
          
          {/* Error Alert */}
          {state?.success === false && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-tight">No pudimos iniciar sesión. Verificá tus credenciales.</p>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green focus:bg-white transition-all text-base sm:text-sm"
                  placeholder="correo@corpicia.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full h-12 pl-11 pr-12 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green focus:bg-white transition-all text-base sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <SubmitButton />
          </form>
          
          <div className="mt-8 flex justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
