'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Entrenadores</h1>
        <Link href="/superadmin/trainers/nuevo" className="bg-blue-500 text-white px-4 py-2 rounded">
          Nuevo Entrenador
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Correo</th>
              <th className="py-2 px-4 border-b">Celular</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map(trainer => (
              <tr key={trainer.id}>
                <td className="py-2 px-4 border-b">{trainer.nombre}</td>
                <td className="py-2 px-4 border-b">{trainer.correo}</td>
                <td className="py-2 px-4 border-b">{trainer.celular}</td>
                <td className="py-2 px-4 border-b">
                  <Link href={`/superadmin/trainers/editar/${trainer.id}`} className="text-blue-500 mr-4">Editar</Link>
                  <button onClick={() => handleDelete(trainer.id)} className="text-red-500">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
