'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScheduleForm from '@/components/admin/ScheduleForm';

interface Horario {
  id: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  aforo: number;
}

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const params = useParams();
  const { zonaId } = params;
  const router = useRouter();

  useEffect(() => {
    if (zonaId) {
      const fetchHorarios = async () => {
        const res = await fetch(`/api/admin/zonas/${zonaId}/horarios`);
        const data = await res.json();
        setHorarios(data);
      };
      fetchHorarios();
    }
  }, [zonaId]);

  const handleCreateHorario = async (scheduleData: { dia: string; horaInicio: string; horaFin: string; aforo: number }) => {
    const res = await fetch(`/api/admin/zonas/${zonaId}/horarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleData),
    });
    if (res.ok) {
      const createdHorario = await res.json();
      setHorarios([...horarios, createdHorario]);
    }
  };

  const handleDeleteHorario = async (horarioId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      await fetch(`/api/admin/zonas/${zonaId}/horarios/${horarioId}`, { method: 'DELETE' });
      setHorarios(horarios.filter(h => h.id !== horarioId));
    }
  };

  return (
    <div>
      <button onClick={() => router.back()} className="bg-gray-200 text-gray-700 px-4 py-2 rounded mb-4">Volver al Dashboard</button>
      <h1 className="text-2xl font-bold mb-4">Gestionar Horarios</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Nuevo Horario</h2>
        <ScheduleForm onCreate={handleCreateHorario} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Horarios Existentes</h2>
        <div className="space-y-4">
          {horarios.map(horario => (
            <div key={horario.id} className="border p-4 rounded shadow flex justify-between items-center">
              <div>
                <p><strong>Día:</strong> {horario.dia}</p>
                <p><strong>Horario:</strong> {horario.horaInicio} - {horario.horaFin}</p>
                <p><strong>Aforo:</strong> {horario.aforo}</p>
              </div>
              <div>
                {/* TODO: Implement edit functionality */}
                <button onClick={() => handleDeleteHorario(horario.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}