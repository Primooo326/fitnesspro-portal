'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-700 text-white p-4 min-h-screen">
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/admin/dashboard" className="block hover:bg-gray-600 p-2 rounded">Dashboard</Link>
          </li>
          {/* Add more navigation links here */}
          <li className="mb-2">
            <Link href="/superadmin/trainers" className="block hover:bg-gray-600 p-2 rounded">Entrenadores</Link>
          </li>
          <li className="mb-2">
            <Link href="/superadmin/users" className="block hover:bg-gray-600 p-2 rounded">Usuarios</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
