
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ReactNode } from 'react';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-base-200">
      <Navbar />
      <Sidebar />
      <main className="p-4 sm:ml-64 pt-20">
        {children}
      </main>
    </div>
  );
}
