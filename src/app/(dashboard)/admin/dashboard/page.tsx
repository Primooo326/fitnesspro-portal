'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ZoneForm from '@/components/admin/ZoneForm';

interface Zona {
  id: string;
  nombre: string;
}

export default function AdminDashboardPage() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchZonas = async () => {
      const res = await fetch(`/api/admin/zonas`);
      const data = await res.json();
      setZonas(data);
    };
    fetchZonas();
  }, []);

  const handleCreateZone = async (name: string) => {
    const res = await fetch(`/api/admin/zonas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name }),
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
      <h1 className="text-2xl font-bold mb-4">Dashboard del Conjunto</h1>

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
