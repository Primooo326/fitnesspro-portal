'use client';

import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-4 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
