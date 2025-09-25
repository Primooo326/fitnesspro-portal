'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ZoneForm from '@/components/admin/ZoneForm';
import { useAuthStore } from '@/lib/store';
import { RolUsuario, AdministradorConjunto } from '@/models/interfaces';
import GenericTable, { Column } from '@/components/common/GenericTable';

interface Zona {
  id: string;
  nombre: string;
  aforo: number;
}

export default function AdminZonasPage() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const { user } = useAuthStore();

  const [conjuntoNombre, setConjuntoNombre] = useState('Tu Conjunto');
  let conjuntoId: string | null = null;

  if (user && user.rol === RolUsuario.ADMINISTRADOR) {
    const admin = user as AdministradorConjunto;
    conjuntoId = admin.conjuntoId;
    // podrías establecer el nombre del conjunto aquí si estuviera disponible en el objeto del usuario
  }


  useEffect(() => {
    const fetchZonas = async () => {
      if (!conjuntoId) return;
      const res = await fetch(`/api/admin/zonas?conjuntoId=${conjuntoId}`);
      const data = await res.json();
      setZonas(data);
    };
    fetchZonas();
  }, [conjuntoId]);

  const handleCreateZone = async (name: string, aforo: number) => {
    if (!conjuntoId) return;
    const res = await fetch(`/api/admin/zonas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name, aforo: aforo, conjuntoId: conjuntoId }), // Pass aforo to API
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

  const columns: Column<Zona>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Aforo', accessor: 'aforo' },
  ];

  const renderActions = (zona: Zona) => (
    <div className="flex item-center justify-center">
      <Link href={`/admin/zonas/${zona.id}/horarios`} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Gestionar Horarios</Link>
      <button onClick={() => handleDeleteZone(zona.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
    </div>
  );


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Zonas Deportivas para {conjuntoNombre}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Crear Nueva Zona</h2>
        <ZoneForm onCreate={handleCreateZone} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Zonas Existentes</h2>
        <GenericTable
          data={zonas}
          columns={columns}
          renderActions={renderActions}
        />
      </div>
    </div>
  );
}