'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { getLoggedUser, login } from '@/services/login.service';
import Link from 'next/link';
import { RolUsuario } from '@/models/interfaces';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

    try {


      const user = await login(email, password);

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
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
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
