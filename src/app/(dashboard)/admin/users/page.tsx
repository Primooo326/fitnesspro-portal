'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RolUsuario, AdministradorConjunto } from '@/models/interfaces';
import GenericTable, { Column } from '@/components/common/GenericTable';

interface Resident {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
}

export default function AdminResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const { user } = useAuthStore();

  const [conjuntoNombre, setConjuntoNombre] = useState('Tu Conjunto');

  useEffect(() => {
    const fetchResidents = async () => {
      if (user && user.rol === RolUsuario.ADMINISTRADOR) {
        const admin = user as AdministradorConjunto;
        const conjuntoId = admin.conjuntoId;

        // Aquí podrías agregar una lógica para buscar el nombre del conjunto si es necesario
        // Por ahora, usaremos un nombre genérico o lo dejaremos como estaba.

        try {
          const q = query(
            collection(db, 'users'),
            where('conjuntoId', '==', conjuntoId)
          );
          const querySnapshot = await getDocs(q);
          const fetchedResidents: Resident[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Resident, 'id'>)
          }));
          setResidents(fetchedResidents);
        } catch (error) {
          console.error("Error fetching residents:", error);
        }
      }
    };
    fetchResidents();
  }, [user]);

  const columns: Column<Resident>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Correo Electrónico', accessor: 'email' },
    { header: 'Teléfono', accessor: (resident) => resident.telefono || 'N/A' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Residentes de {conjuntoNombre}</h1>

      <GenericTable
        data={residents}
        columns={columns}
      />
    </div>
  );
}
