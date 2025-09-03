'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Link href="/superadmin/users/nuevo" className="bg-blue-500 text-white px-4 py-2 rounded">
          Nuevo Usuario
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Correo</th>
              <th className="py-2 px-4 border-b">Teléfono</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.nombre}</td>
                <td className="py-2 px-4 border-b">{user.correo}</td>
                <td className="py-2 px-4 border-b">{user.telefono}</td>
                <td className="py-2 px-4 border-b">
                  <Link href={`/superadmin/users/editar/${user.id}`} className="text-blue-500 mr-4">Editar</Link>
                  <button onClick={() => handleDelete(user.id)} className="text-red-500">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
