'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Resident {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  // Add other relevant resident fields
}

export default function AdminResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const { conjuntoData } = useAuthStore();

  useEffect(() => {
    const fetchResidents = async () => {
      if (!conjuntoData?.id) return; // Ensure conjuntoId is available

      try {
        const q = query(
          collection(db, 'users'),
          where('conjuntoId', '==', conjuntoData.id)
        );
        const querySnapshot = await getDocs(q);
        const fetchedResidents: Resident[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<Resident, 'id'>
        }));
        setResidents(fetchedResidents);
      } catch (error) {
        console.error("Error fetching residents:", error);
      }
    };
    fetchResidents();
  }, [conjuntoData]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Residentes de {conjuntoData?.nombre || 'Tu Conjunto'}</h1>

      {residents.length === 0 ? (
        <p>No hay residentes registrados para este conjunto.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Correo Electrónico</th>
                <th className="py-3 px-6 text-left">Teléfono</th>
                {/* Add more table headers for other fields */}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {residents.map(resident => (
                <tr key={resident.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{resident.nombre}</td>
                  <td className="py-3 px-6 text-left">{resident.email}</td>
                  <td className="py-3 px-6 text-left">{resident.telefono || 'N/A'}</td>
                  {/* Add more table cells for other fields */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
