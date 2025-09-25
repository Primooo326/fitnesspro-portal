'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useAuthStore } from '@/lib/store';
import { AdministradorConjunto, ConjuntoResidencial, RolUsuario } from '@/models/interfaces';
import ConjuntoCalendar from '@/components/admin/ConjuntoCalendar';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [conjunto, setConjunto] = useState<ConjuntoResidencial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConjuntoData = async () => {
      if (user && user.rol === RolUsuario.ADMINISTRADOR) {
        setLoading(true);
        const admin = user as AdministradorConjunto;
        const conjuntoId = admin.conjuntoId;

        if (!conjuntoId) {
          setError('El administrador no tiene un conjunto residencial asignado.');
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(`/api/conjuntos/${conjuntoId}`);
          if (!response.ok) {
            throw new Error('No se pudo cargar la información del conjunto.');
          }
          const data = await response.json();
          setConjunto(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError('Acceso no autorizado o rol de usuario incorrecto.');
        setLoading(false);
      }
    };

    fetchConjuntoData();
  }, [user]);

  if (loading) {
    return <p>Cargando información del conjunto...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!conjunto) {
    return <p>No se encontró la información del conjunto residencial.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Administración de {conjunto.nombre}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna de Información del Conjunto */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Información del Conjunto</h2>
          <div className="space-y-3">
            <p><strong>Nombre:</strong> {conjunto.nombre}</p>
            <p><strong>Dirección:</strong> {conjunto.direccion}</p>
            {/* Puedes agregar más detalles del conjunto aquí si los necesitas */}
          </div>
        </div>

        {/* Columna del Código QR */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold mb-4">Código QR para Registro</h2>
          <p className="mb-4 text-gray-600">
            Los residentes pueden escanear este código para vincularse a <strong>{conjunto.nombre}</strong>.
          </p>
          <div className="p-4 border rounded-lg">
            <QRCode value={conjunto.id!} size={256} />
          </div>
          <p className="mt-4 text-sm text-gray-500">ID del Conjunto: {conjunto.id}</p>
        </div>
      </div>

      {/* Fila del Calendario */}
      <div className="mt-8">
        <ConjuntoCalendar />
      </div>
    </div>
  );
}
