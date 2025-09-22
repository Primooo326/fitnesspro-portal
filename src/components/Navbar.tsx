'use client';

import { sidebarRoutes } from '@/lib/constants';
import { useAuthStore } from '@/lib/store';
import { RolUsuario } from '@/models/interfaces';
import { logout } from '@/services/login.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {

  const { user } = useAuthStore();

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user!.nombre!)}`;
  const router = useRouter();




  const cerrarSesion = () => {
    logout();
    router.push('/');
  }

  return (
    <nav className="navbar bg-base-300 sm:z-1 relative">
      <button
        type="button"
        className="btn btn-text max-sm:btn-square sm:hidden me-2"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="with-navbar-sidebar"
        data-overlay="#with-navbar-sidebar"
      >
        <span className="icon-[tabler--menu-2] size-5"></span>
      </button>
      <div className="flex flex-1 items-center">
        <Link className="link text-primary-content link-neutral text-xl font-semibold no-underline" href="/superadmin/page">
          FitnessPro
        </Link>
      </div>
      <div className="navbar-end flex items-center gap-4">

        <button
          type="button"
          className='btn btn-sm btn-warning'
          onClick={() => cerrarSesion()}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}