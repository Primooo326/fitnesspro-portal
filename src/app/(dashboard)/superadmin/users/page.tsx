'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GenericTable, { Column } from '@/components/common/GenericTable';
import { AdministradorConjunto } from '@/models/interfaces';


export default function UsersPage() {
  const [users, setUsers] = useState<AdministradorConjunto[]>([]);

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

  const columns: Column<AdministradorConjunto>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Correo', accessor: 'email' },
    { header: 'Teléfono', accessor: 'telefono' },
  ];

  const renderActions = (user: AdministradorConjunto) => (
    <>
      <Link href={`/superadmin/users/editar/${user.id}`} className="text-blue-500 mr-4">Editar</Link>
      <button onClick={() => handleDelete(user.id)} className="text-red-500">Eliminar</button>
    </>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Link href="/superadmin/users/nuevo" className="bg-blue-500 text-white px-4 py-2 rounded">
          Nuevo Usuario
        </Link>
      </div>
      <GenericTable
        data={users}
        columns={columns}
        renderActions={renderActions}
      />
    </div>
  );
}
