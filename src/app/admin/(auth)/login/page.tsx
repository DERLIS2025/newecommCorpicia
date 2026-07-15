'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/lib/actions/admin-auth';
import { checkLoginState, createAdminPin, verifyAdminPin, forgetDevice } from '@/lib/actions/admin-pin';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import PinInput from '@/components/admin/PinInput';

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
          <Loader2 className="animate-spin h-5 w-5 text-white" />
          Ingresando...
        </div>
      ) : (
        'Ingresar al panel'
      )}
    </button>
  );
}

type ViewState = 'loading' | 'login' | 'setup_pin' | 'enter_pin';

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<ViewState>('loading');
  const [adminName, setAdminName] = useState('Admin');
  
  // Pin Setup state
  const [pinToConfirm, setPinToConfirm] = useState('');
  const [pinError, setPinError] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    checkLoginState().then((res) => {
      if (res.loggedIn) {
        setAdminName(res.name);
        if (res.hasDevice) {
          setView('enter_pin');
        } else {
          setView('setup_pin');
        }
      } else {
        setView('login');
      }
    });
  }, []);

  useEffect(() => {
    if (state?.success) {
      if (state.requirePinSetup) {
        setView('setup_pin');
      } else {
        router.push('/admin/inicio'); // or /admin/productos depending on default
        router.refresh();
      }
    }
  }, [state, router]);

  const handleSetupComplete = (pin: string) => {
    setPinError('');
    if (!pinToConfirm) {
      setPinToConfirm(pin);
    } else {
      if (pin === pinToConfirm) {
        startTransition(async () => {
          const res = await createAdminPin(pinToConfirm, pin);
          if (res.success) {
            router.push('/admin/inicio');
            router.refresh();
          } else {
            setPinError(res.message || 'Error al guardar el PIN');
            setPinToConfirm('');
          }
        });
      } else {
        setPinError('Los PIN no coinciden. Intenta de nuevo.');
        setPinToConfirm('');
      }
    }
  };

  const handlePinLogin = (pin: string) => {
    setPinError('');
    startTransition(async () => {
      const res = await verifyAdminPin(pin);
      if (res.success) {
        router.push('/admin/inicio');
        router.refresh();
      } else {
        setPinError(res.message || 'PIN incorrecto');
        if (res.locked) {
          setView('login');
        }
      }
    });
  };

  const handleForgetDevice = () => {
    startTransition(async () => {
      await forgetDevice();
      setView('login');
    });
  };

  if (view === 'loading') {
    return (
      <div className="relative min-h-[100dvh] flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-white w-8 h-8 relative z-10" />
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-[100dvh] flex items-center justify-center w-full overflow-hidden bg-black"
      style={{
        backgroundImage: "url('/images/admin/login-garden-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-[calc(100%-32px)] max-w-[440px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 mb-8">
        
        {/* Contenido Superior */}
        <div className="px-8 pt-10 pb-6 flex flex-col items-center border-b border-gray-100/50 bg-white/50">
          <Image 
            src="/logo-corpicia.png" 
            alt="Corpicia" 
            width={140} 
            height={70}
            priority
            className="mb-6 object-contain drop-shadow-sm"
          />
          {view === 'login' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Corpicia Admin</h1>
              <p className="text-gray-500 text-sm mt-1.5 font-medium">Acceso exclusivo para administradores</p>
            </>
          )}
          {view === 'setup_pin' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <KeyRound className="w-6 h-6 text-corpicia-green" />
                Configurá tu PIN
              </h1>
              <p className="text-gray-500 text-sm mt-1.5 text-center font-medium">
                Lo usarás para ingresar más rápido desde este dispositivo.
              </p>
            </>
          )}
          {view === 'enter_pin' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bienvenido de nuevo</h1>
              <p className="text-gray-500 text-sm mt-1.5 font-medium text-center">
                Hola {adminName}, ingresá tu PIN
              </p>
            </>
          )}
        </div>

        {/* Formulario */}
        <div className="px-8 py-8">
          
          {(state?.success === false || pinError) && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-tight">
                {pinError || 'No pudimos iniciar sesión. Verificá tus credenciales.'}
              </p>
            </div>
          )}

          {view === 'login' && (
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
          )}

          {view === 'setup_pin' && (
            <div className="space-y-6 flex flex-col items-center">
              <p className="text-sm font-semibold text-gray-700">
                {pinToConfirm ? 'Confirmá el PIN de 6 dígitos' : 'Ingresá 6 dígitos'}
              </p>
              <PinInput 
                key={pinToConfirm ? 'confirm' : 'create'} 
                onComplete={handleSetupComplete}
                disabled={isPending} 
              />
              <div className="pt-2 w-full">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    router.push('/admin/inicio');
                    router.refresh();
                  }}
                  className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors py-2"
                >
                  Configurar más tarde
                </button>
              </div>
            </div>
          )}

          {view === 'enter_pin' && (
            <div className="space-y-6 flex flex-col items-center">
              <PinInput onComplete={handlePinLogin} disabled={isPending} />
              
              <div className="pt-4 flex flex-col gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full text-center text-sm font-medium text-corpicia-green hover:text-green-700 transition-colors"
                >
                  Ingresar con correo y contraseña
                </button>
                <button
                  type="button"
                  onClick={handleForgetDevice}
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Olvidar este dispositivo
                </button>
              </div>
            </div>
          )}

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

      <div className="absolute bottom-6 w-full text-center z-10 px-4">
        <p className="text-white/80 text-[13px] font-medium drop-shadow-sm">
          © 2026 Corpicia. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
