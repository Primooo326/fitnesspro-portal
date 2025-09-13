'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside
      id="with-navbar-sidebar"
      className="overlay [--auto-close:sm] sm:shadow-none overlay-open:translate-x-0 drawer drawer-start hidden max-w-64 sm:absolute sm:z-0 sm:flex sm:translate-x-0 pt-16"
      role="dialog"
      tabIndex={-1}
    >
      <div className="drawer-body px-2 pt-4">
        <ul className="menu p-0">
          <li>
            <Link href="/superadmin/conjuntos">
              <span className="icon-[tabler--building-community] size-5"></span>
              Conjuntos
            </Link>
          </li>
          <li>
            <Link href="/superadmin/users">
              <span className="icon-[tabler--users] size-5"></span>
              Usuarios
            </Link>
          </li>
          <li>
            <Link href="/superadmin/trainers">
              <span className="icon-[tabler--user-star] size-5"></span>
              Entrenadores
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
