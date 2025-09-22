'use client';

import { sidebarRoutes } from '@/lib/constants';
import { useAuthStore } from '@/lib/store';
import { RolUsuario } from '@/models/interfaces';
import { logout } from '@/services/login.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {

  const { user } = useAuthStore();
  const router = useRouter();


  const getSidebarRoutes = () => {

    switch (user?.rol) {

      case RolUsuario.SUPER:
        return sidebarRoutes.superadmin;
      case RolUsuario.ADMINISTRADOR:
        return sidebarRoutes.admin;
      case RolUsuario.ENTRENADOR:
        return sidebarRoutes.trainer;
      case RolUsuario.RESIDENTE:
        return sidebarRoutes.resident;
      default:
        return [];

    }

  }

  const cerrarSesion = () => {
    logout();
    router.push('/');
  }
  return (
    <aside
      id="with-navbar-sidebar"
      className="overlay [--auto-close:sm] sm:shadow-none overlay-open:translate-x-0 drawer drawer-start hidden max-w-64 sm:absolute sm:z-0 sm:flex sm:translate-x-0 pt-16 bg-base-300"
      role="dialog"
      tabIndex={-1}
    >
      <div className="drawer-body p-4">
        <ul className="menu p-0">
          {getSidebarRoutes().map((route) => (
            <li key={route.name}>
              <Link href={route.href} className="text-primary-content">
                <span className="icon-[tabler--user-star] size-5"></span>
                {route.name}
              </Link>
            </li>
          ))}

        </ul>

      </div>
      <div className="flex flex-col gap-2 mt-auto p-4">
        <button
          type="button"
          className="btn btn-sm btn-warning"
          onClick={() => cerrarSesion()}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
