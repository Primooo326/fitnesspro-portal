'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScheduleForm from '@/components/admin/ScheduleForm';
import { useAuthStore } from '@/lib/store';
import { RolUsuario, AdministradorConjunto, Horario } from '@/models/interfaces';
import Loader from '@/components/Loader';

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const { zonaId } = params;
  const router = useRouter();
  const { user } = useAuthStore();
  const conjuntoId = user?.rol === RolUsuario.ADMINISTRADOR ? (user as AdministradorConjunto).conjuntoId : null;

  useEffect(() => {
    const fetchHorarios = async () => {
      if (!zonaId || !conjuntoId) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/admin/zonas/${zonaId}/horarios?conjuntoId=${conjuntoId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setHorarios(data);
          }
        }
      } catch (error) {
        console.error("Error al cargar horarios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHorarios();
  }, [zonaId, conjuntoId]);

  const handleCreateHorario = async (scheduleData: Omit<Horario, 'id'>) => {
    if (!conjuntoId) return;
    const res = await fetch(`/api/admin/zonas/${zonaId}/horarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...scheduleData, conjuntoId }),
    });
    if (res.ok) {
      const createdHorario = await res.json();
      setHorarios(prev => [...prev, createdHorario]);
    }
  };

  const handleDeleteHorario = async (horarioId: string) => {
    if (!conjuntoId || !window.confirm('¿Estás seguro de que quieres eliminar este horario?')) return;

    await fetch(`/api/admin/zonas/${zonaId}/horarios/${horarioId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conjuntoId }),
    });
    setHorarios(horarios.filter(h => h.id !== horarioId));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState<Horario | null>(null);

  const handleUpdateHorario = async (scheduleData: Omit<Horario, 'id'>) => {
    if (!conjuntoId || !editingHorario) return;

    const res = await fetch(`/api/admin/zonas/${zonaId}/horarios/${editingHorario.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...scheduleData, conjuntoId }),
    });

    if (res.ok) {
      setHorarios(prev => prev.map(h => (h.id === editingHorario.id ? { id: h.id, ...scheduleData } : h)));
      closeModal();
    }
  };

  const openModal = (horario: Horario) => {
    setEditingHorario(horario);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingHorario(null);
    setIsModalOpen(false);
  };
  if (isLoading) return <Loader />;

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="bg-gray-200 text-gray-700 px-4 py-2 rounded mb-4 hover:bg-gray-300">Volver a Zonas</button>
      <h1 className="text-2xl font-bold mb-4">Gestionar Horarios</h1>

      <div className="mb-8 p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-bold mb-2">Nuevo Horario</h2>
        <ScheduleForm onSubmit={handleCreateHorario} />
      </div>

      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-bold mb-2">Horarios Existentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(horarios) && horarios.length > 0 ? (
            horarios.map(horario => (
              <div key={horario.id} className="border p-4 rounded-lg shadow-md bg-gray-50 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-lg">{horario.dia}</p>
                  <p className="text-gray-600">{horario.horaInicio} - {horario.horaFin}</p>
                  <p className="text-sm text-gray-500">Aforo: {horario.aforo}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={() => openModal(horario)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">Editar</button>
                  <button onClick={() => handleDeleteHorario(horario.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Eliminar</button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full">No hay horarios definidos para esta zona.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Horario</h2>
            <ScheduleForm
              isEditing
              initialData={editingHorario}
              onSubmit={handleUpdateHorario}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}