'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { getLoggedUser, login, resendVerificationEmail } from '@/services/login.service';
import Link from 'next/link';
import { RolUsuario } from '@/models/interfaces';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {

    const user = getLoggedUser();
    if (user) {
      setUser(user);
      if (user.rol === RolUsuario.SUPER) {
        router.push('/superadmin');
      } else if (user.rol === RolUsuario.ADMINISTRADOR) {
        router.push('/admin');
      } else if (user.rol === RolUsuario.ENTRENADOR) {
        router.push('/trainer');
      } else if (user.rol === RolUsuario.RESIDENTE) {
        router.push('/resident');
      }
    }

  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendMessage('');

    try {


      const user = await login(email, password);
      console.log(user);
      if (user) {
        setUser(user);

        if (user.rol === RolUsuario.SUPER) {
          router.push('/superadmin');
        } else if (user.rol === RolUsuario.ADMINISTRADOR) {
          router.push('/admin');
        } else if (user.rol === RolUsuario.ENTRENADOR) {
          router.push('/trainer');
        } else if (user.rol === RolUsuario.RESIDENTE) {
          router.push('/resident');
        }

      }

    } catch (err: any) {
      setError(err.message);
      console.error('Login error:', err);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      const res = await resendVerificationEmail(email, password);
      if ((res as any)?.alreadyVerified) {
        setResendMessage('Este correo ya está verificado. Intenta iniciar sesión nuevamente.');
      } else if ((res as any)?.sent) {
        setResendMessage('Correo de verificación enviado. Revisa tu bandeja de entrada.');
      } else {
        setResendMessage('Se ha procesado tu solicitud.');
      }
    } catch (e: any) {
      setResendMessage(e?.message || 'No se pudo reenviar el correo de verificación.');
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="mb-4">
              <p className="text-red-500 text-xs italic">{error}</p>
              {error.includes('Debes verificar tu correo electrónico') && (
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-sm text-blue-600 hover:underline disabled:opacity-60"
                  >
                    {resendLoading ? 'Enviando…' : 'Reenviar correo de verificación'}
                  </button>
                  {resendMessage && (
                    <span className="text-xs text-gray-600">{resendMessage}</span>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Iniciar Sesión
            </button>
            <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
