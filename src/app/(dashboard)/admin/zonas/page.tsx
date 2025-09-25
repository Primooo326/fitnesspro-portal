'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ZoneForm from '@/components/admin/ZoneForm';
import { useAuthStore } from '@/lib/store';
import { storage } from '@/lib/firebase';
import { RolUsuario, AdministradorConjunto, ZonaDeportiva } from '@/models/interfaces';
import GenericTable, { Column } from '@/components/common/GenericTable';
import Loader from '@/components/Loader';

export default function AdminZonasPage() {
  const [zonas, setZonas] = useState<ZonaDeportiva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuthStore();

  const conjuntoId = user && user.rol === RolUsuario.ADMINISTRADOR ? (user as AdministradorConjunto).conjuntoId : null;
  const [conjuntoNombre, setConjuntoNombre] = useState('Tu Conjunto'); // Esto podría venir del estado global o una API

  useEffect(() => {
    const fetchZonas = async () => {
      if (!conjuntoId) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/admin/zonas?conjuntoId=${conjuntoId}`);
        if (res.ok) {
          const data = await res.json();
          setZonas(data);
        }
      } catch (error) {
        console.error("Error al cargar las zonas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchZonas();
  }, [conjuntoId]);

  const handleCreateZone = async (formData: { nombre: string; aforo: number; descripcion: string; file: File | null; }) => {
    if (!conjuntoId) return;

    setIsUploading(true);
    let urlImagen: string | null = null;

    try {
      if (formData.file) {
        const storageRef = ref(storage, `zonas/${conjuntoId}/${Date.now()}-${formData.file.name}`);
        await uploadBytes(storageRef, formData.file);
        urlImagen = await getDownloadURL(storageRef);
      }

      const apiRequestBody = {
        nombre: formData.nombre,
        aforo: formData.aforo,
        descripcion: formData.descripcion,
        conjuntoId: conjuntoId,
        ...(urlImagen && { urlImagen }),
      };

      const res = await fetch('/api/admin/zonas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiRequestBody),
      });

      if (res.ok) {
        const newZone = await res.json();
        setZonas(prevZonas => [...prevZonas, { ...newZone, ...apiRequestBody, id: newZone.id }]);
      }
    } catch (error) {
      console.error("Error al crear la zona:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteZone = async (zona: ZonaDeportiva) => {
    if (!conjuntoId || !window.confirm('¿Estás seguro de que quieres eliminar esta zona?')) return;

    try {
      // Eliminar imagen de Firebase Storage si existe
      if (zona.urlImagen) {
        const imageRef = ref(storage, zona.urlImagen);
        await deleteObject(imageRef).catch(error => {
          // No es crítico si la imagen no se encuentra, así que solo lo logueamos
          console.warn("No se pudo eliminar la imagen o ya fue eliminada:", error);
        });
      }

      // Eliminar el documento de Firestore
      await fetch(`/api/admin/zonas/${zona.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conjuntoId }),
      });
      setZonas(zonas.filter(z => z.id !== zona.id));
    } catch (error) {
      console.error("Error al eliminar la zona:", error);
    }
  };

  const columns: Column<ZonaDeportiva>[] = [
    {
      header: 'Imagen',
      accessor: (item) => item.urlImagen
        ? <img src={item.urlImagen} alt={item.nombre} className="w-16 h-16 object-cover rounded" />
        : 'N/A'
    },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Aforo', accessor: (item) => item.aforo },
    { header: 'Descripción', accessor: 'descripcion' },
  ];

  const renderActions = (zona: ZonaDeportiva) => (
    <div className="flex items-center justify-center space-x-2">
      <Link href={`/admin/zonas/${zona.id}/horarios`} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Gestionar Horarios</Link>
      <button onClick={() => handleDeleteZone(zona)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Eliminar</button>
    </div>
  );

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Zonas Deportivas para {conjuntoNombre}</h1>
      <div className="mb-8 p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-bold mb-2">Crear Nueva Zona</h2>
        {isUploading && <p className="text-blue-500">Creando zona y subiendo imagen...</p>}
        <ZoneForm onCreate={handleCreateZone} />
      </div>
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-bold mb-2">Zonas Existentes</h2>
        <GenericTable data={zonas} columns={columns} renderActions={renderActions} />
      </div>
    </div>
  );
}