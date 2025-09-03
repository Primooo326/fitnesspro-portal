'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TrainerForm from '@/components/superadmin/TrainerForm';

interface Trainer {
  id: string;
  cedula: string;
  codigo: string;
  nombre: string;
  correo: string;
  celular: string;
  datosPersonales?: string;
  contactoEmergencia?: string;
}

export default function EditTrainerPage() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchTrainer = async () => {
        const res = await fetch(`/api/trainers/${id}`);
        const data = await res.json();
        setTrainer(data);
      };
      fetchTrainer();
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Entrenador</h1>
      {trainer ? <TrainerForm trainer={trainer} /> : <p>Cargando...</p>}
    </div>
  );
}
