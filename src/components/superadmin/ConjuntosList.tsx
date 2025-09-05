'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConjuntoResidencial } from '@/models/interfaces';


export default function ConjuntosList() {
  const [conjuntos, setConjuntos] = useState<ConjuntoResidencial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConjuntos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/superadmin/conjuntos');
      if (!response.ok) throw new Error('Error al cargar los conjuntos.');
      const data = await response.json();
      setConjuntos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConjuntos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este conjunto? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/superadmin/conjuntos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo eliminar el conjunto.');
      }

      // Actualizar la lista en el UI para reflejar la eliminación
      setConjuntos(conjuntos.filter(c => c.id !== id));
      alert('Conjunto eliminado exitosamente.');

    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Cargando conjuntos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-medium">Nombre del Conjunto</th>
              <th className="p-4 font-medium">ID del Administrador</th>
              <th className="p-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {conjuntos.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">No hay conjuntos registrados.</td>
              </tr>
            ) : (
              conjuntos.map((conjunto) => (
                <tr key={conjunto.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">{conjunto.nombre}</td>
                  <td className="p-4 text-xs font-mono">{conjunto.administradorId || 'N/A'}</td>
                  <td className="p-4 flex space-x-2">
                    <Link href={`/superadmin/conjuntos/editar/${conjunto.id}`} className="text-blue-600 hover:underline">Editar</Link>
                    <button onClick={() => handleDelete(conjunto.id)} className="text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
