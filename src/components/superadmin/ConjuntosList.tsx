'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConjuntoResidencial } from '@/models/interfaces';
import GenericTable, { Column } from '../common/GenericTable';


export default function ConjuntosList() {
  const [conjuntos, setConjuntos] = useState<ConjuntoResidencial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConjuntos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/conjuntos');
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
      const response = await fetch(`/api/conjuntos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo eliminar el conjunto.');
      }

      setConjuntos(conjuntos.filter(c => c.id !== id));
      alert('Conjunto eliminado exitosamente.');

    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Cargando conjuntos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Definir las columnas para la tabla genérica
  const columns: Column<ConjuntoResidencial>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Dirección', accessor: 'direccion' },
  ];

  // Función para renderizar los botones de acción
  const renderActions = (conjunto: ConjuntoResidencial) => (
    <>
      <Link href={`/superadmin/conjuntos/editar/${conjunto.id}`} className="btn btn-sm btn-warning">
        Editar
      </Link>
      <button onClick={() => handleDelete(conjunto.id!)} className="btn btn-sm btn-error">
        Eliminar
      </button>
    </>
  );

  return (
    <GenericTable
      data={conjuntos}
      columns={columns}
      renderActions={renderActions}
    />
  );
}
