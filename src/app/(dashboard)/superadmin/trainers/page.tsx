'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GenericTable, { Column } from '@/components/common/GenericTable';


interface Trainer {
  id: string;
  nombre: string;
  correo: string;
  celular: string;
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      const res = await fetch('/api/trainers');
      const data = await res.json();
      setTrainers(data);
    };
    fetchTrainers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este entrenador?')) {
      await fetch(`/api/trainers/${id}`, { method: 'DELETE' });
      setTrainers(trainers.filter(t => t.id !== id));
    }
  };

  const columns: Column<Trainer>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Celular', accessor: 'celular' },
  ];

  const renderActions = (trainer: Trainer) => (
    <>
      <Link href={`/superadmin/trainers/editar/${trainer.id}`} className="text-blue-500 mr-4">Editar</Link>
      <button onClick={() => handleDelete(trainer.id)} className="text-red-500">Eliminar</button>
    </>
  );


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Entrenadores</h1>
        <Link href="/superadmin/trainers/nuevo" className="bg-blue-500 text-white px-4 py-2 rounded">
          Nuevo Entrenador
        </Link>
      </div>
      <GenericTable
        data={trainers}
        columns={columns}
        renderActions={renderActions}
      />
    </div>
  );
}
