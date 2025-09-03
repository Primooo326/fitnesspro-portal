'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import UserForm from '@/components/superadmin/UserForm';

interface User {
  id: string;
  nombre: string;
  edad: number;
  correo: string;
  telefono: string;
  notificaciones: boolean;
}

export default function EditUserPage() {
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        setUser(data);
      };
      fetchUser();
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
      {user ? <UserForm user={user} /> : <p>Cargando...</p>}
    </div>
  );
}
