'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/admin/dashboard" className="text-xl font-bold">Admin Dashboard</Link>
      <div>
        {/* User menu can go here */}
        <span>Admin User</span>
      </div>
    </nav>
  );
}
