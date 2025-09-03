'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ZoneForm from '@/components/admin/ZoneForm';
import { useAuthStore } from '@/lib/store';

interface Zona {
  id: string;
  nombre: string;
}

export default function AdminDashboardPage() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const router = useRouter();
  const { conjuntoData } = useAuthStore();

  // Invented metrics
  const totalResidents = Math.floor(Math.random() * 500) + 100; // 100-600 residents
  const activeZones = Math.floor(Math.random() * 5) + 1; // 1-5 active zones
  const bookingsToday = Math.floor(Math.random() * 50) + 10; // 10-60 bookings

  useEffect(() => {
    const fetchZonas = async () => {
      if (!conjuntoData?.id) return; // Ensure conjuntoId is available
      const res = await fetch(`/api/admin/zonas?conjuntoId=${conjuntoData.id}`);
      const data = await res.json();
      setZonas(data);
    };
    fetchZonas();
  }, [conjuntoData]); // Re-run when conjuntoData changes

  const handleCreateZone = async (name: string) => {
    if (!conjuntoData?.id) return; // Ensure conjuntoId is available
    const res = await fetch(`/api/admin/zonas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name, conjuntoId: conjuntoData.id }), // Associate with conjunto
    });
    if (res.ok) {
      const newZone = await res.json();
      setZonas([...zonas, newZone]);
    }
  };

  const handleDeleteZone = async (zonaId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta zona?')) {
      // Assuming your delete API also needs conjuntoId, or it's handled by the zoneId itself
      await fetch(`/api/admin/zonas/${zonaId}`, { method: 'DELETE' });
      setZonas(zonas.filter(z => z.id !== zonaId));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard de {conjuntoData?.nombre || 'Tu Conjunto'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total de Residentes</h3>
          <p className="text-3xl font-bold">{totalResidents}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Zonas Activas</h3>
          <p className="text-3xl font-bold">{activeZones}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Reservas Hoy</h3>
          <p className="text-3xl font-bold">{bookingsToday}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Crear Nueva Zona</h2>
        <ZoneForm onCreate={handleCreateZone} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Zonas Deportivas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zonas.map(zona => (
            <div key={zona.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">{zona.nombre}</h3>
              <div className="mt-4 flex justify-end">
                <Link href={`/admin/zonas/${zona.id}/horarios`} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Gestionar Horarios</Link>
                <button onClick={() => handleDeleteZone(zona.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
