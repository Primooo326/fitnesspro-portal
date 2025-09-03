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
          <li className="mb-2">
            <Link href="/admin/zonas" className="block hover:bg-gray-600 p-2 rounded">Zonas</Link>
          </li>
          <li className="mb-2">
            <Link href="/admin/users" className="block hover:bg-gray-600 p-2 rounded">Residentes</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
