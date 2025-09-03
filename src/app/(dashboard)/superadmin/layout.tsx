
import Link from 'next/link';
import { ReactNode } from 'react';

// Placeholder icons - in a real app, you'd use an icon library like lucide-react
const HomeIcon = () => <span>🏠</span>;
const BuildingIcon = () => <span>🏢</span>;
const UserIcon = () => <span>👤</span>;
const DumbbellIcon = () => <span>🏋️</span>;

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Super Admin</h2>
          <p className="text-sm text-gray-400">FitnessPro Portal</p>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link href="/superadmin" className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <HomeIcon />
            <span className="ml-3">Dashboard</span>
          </Link>
          <Link href="/superadmin/conjuntos" className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <BuildingIcon />
            <span className="ml-3">Gestionar Conjuntos</span>
          </Link>
          <Link href="/superadmin/entrenadores" className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <DumbbellIcon />
            <span className="ml-3">Gestionar Entrenadores</span>
          </Link>
          <Link href="/superadmin/usuarios" className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <UserIcon />
            <span className="ml-3">Gestionar Usuarios</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
