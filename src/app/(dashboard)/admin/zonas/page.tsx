'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ZoneForm from '@/components/admin/ZoneForm';
import { useAuthStore } from '@/lib/store';

interface Zona {
  id: string;
  nombre: string;
  aforo: number; // Added aforo
}

export default function AdminZonasPage() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const { conjuntoData } = useAuthStore();

  useEffect(() => {
    const fetchZonas = async () => {
      if (!conjuntoData?.id) return; // Ensure conjuntoId is available
      const res = await fetch(`/api/admin/zonas?conjuntoId=${conjuntoData.id}`);
      const data = await res.json();
      setZonas(data);
    };
    fetchZonas();
  }, [conjuntoData]);

  const handleCreateZone = async (name: string, aforo: number) => {
    if (!conjuntoData?.id) return; // Ensure conjuntoId is available
    const res = await fetch(`/api/admin/zonas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name, aforo: aforo, conjuntoId: conjuntoData.id }), // Pass aforo to API
    });
    if (res.ok) {
      const newZone = await res.json();
      setZonas([...zonas, newZone]);
    }
  };

  const handleDeleteZone = async (zonaId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta zona?')) {
      await fetch(`/api/admin/zonas/${zonaId}`, { method: 'DELETE' });
      setZonas(zonas.filter(z => z.id !== zonaId));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Zonas Deportivas para {conjuntoData?.nombre || 'Tu Conjunto'}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Crear Nueva Zona</h2>
        <ZoneForm onCreate={handleCreateZone} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Zonas Existentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Aforo</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {zonas.map(zona => (
                <tr key={zona.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{zona.nombre}</td>
                  <td className="py-3 px-6 text-left">{zona.aforo}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <Link href={`/admin/zonas/${zona.id}/horarios`} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Gestionar Horarios</Link>
                      <button onClick={() => handleDeleteZone(zona.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}