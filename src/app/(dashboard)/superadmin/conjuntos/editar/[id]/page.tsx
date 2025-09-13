'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ConjuntoForm from '@/components/superadmin/ConjuntoForm';

interface ConjuntoData {
  nombre: string;
  direccion: string;
  // No incluimos datos del admin porque la edición se centrará en el conjunto
}

export default function EditarConjuntoPage() {
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<ConjuntoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchConjunto = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/conjuntos/${id}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar la información del conjunto.');
        }
        const data = await response.json();
        setInitialData({ nombre: data.nombre, direccion: data.direccion });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConjunto();
  }, [id]);

  return (
    <div>
      <div className="mb-6">
        <Link href="/superadmin/conjuntos" className="text-blue-600 hover:underline">
          &larr; Volver a la lista
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Editar Conjunto Residencial</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {initialData && <ConjuntoForm isEditMode initialData={initialData} conjuntoId={id} />}
      </div>
    </div>
  );
}
