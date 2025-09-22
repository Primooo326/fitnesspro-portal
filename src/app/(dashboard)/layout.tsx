"use client";
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { getLoggedUser } from '@/services/login.service';
import { ReactNode, useEffect } from 'react';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {

  const { user, setUser } = useAuthStore();

  useEffect(() => {


    const userLoggeed = getLoggedUser();

    if (user) {
      setUser(user);
    } else {
      setUser(userLoggeed);
    }

  }, []);

  return (
    <>
      {
        user ?
          <div className="relative min-h-screen" data-theme="corporate">
            {/* <Navbar /> */}
            <Sidebar />
            <main className="p-4 sm:ml-64">
              {children}
            </main>
          </div> :

          <Loader />
      }
    </>
  );
}
