'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConjuntoResidencial } from '@/models/interfaces';

interface ConjuntoFormProps {
  isEditMode: boolean;
  initialData?: ConjuntoResidencial;
}

export default function ConjuntoForm({ isEditMode = false, initialData }: ConjuntoFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(
    {
      id: "",
      nombre: '',
      direccion: '',
      administradorId: '',
      zonasDeportivas: [],
      usuarios: [],
      nombreAdmin: '',
      emailAdmin: ''
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      const data: any = { ...initialData }
      setFormData(data);
    }
  }, [isEditMode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  // TODO poder seleccionar un administrador si el conjunto ya tiene uno creado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const url = isEditMode ? `/api/conjuntos/${initialData?.id}` : '/api/conjuntos';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ocurrió un error');
      }

      alert(`¡Conjunto ${isEditMode ? 'actualizado' : 'creado'} exitosamente!`);
      router.push('/superadmin/conjuntos');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Información del Conjunto</h3>
        <div className="space-y-4">
          <div className="w-full">
            <label className="label-text" htmlFor="nombre">Nombre del Conjunto</label>
            <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required className="input" />
            <span className="helper-text">Escribe el nombre completo del conjunto</span>
          </div>
          <div className="w-full">
            <label className="label-text" htmlFor="direccion">Dirección</label>
            <input type="text" name="direccion" id="direccion" value={formData.direccion} onChange={handleChange} required className="input" />
            <span className="helper-text">Escribe la dirección del conjunto</span>
          </div>
        </div>
      </div>

      {!isEditMode && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Información del Administrador</h3>
          <div className="space-y-4">
            <div className="w-full">
              <label className="label-text" htmlFor="nombreAdmin">Nombre del Administrador</label>
              <input type="text" name="nombreAdmin" id="nombreAdmin" value={formData.nombreAdmin} onChange={handleChange} required className="input" />
              <span className="helper-text">Escribe el nombre completo del administrador</span>
            </div>
            <div className="w-full">
              <label className="label-text" htmlFor="emailAdmin">Email del Administrador</label>
              <input type="email" name="emailAdmin" id="emailAdmin" value={formData.emailAdmin} onChange={handleChange} required className="input" />
              <span className="helper-text">Escribe el correo electrónico del administrador</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <p><span className="font-bold">Error:</span> {error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={() => router.push('/superadmin/conjuntos')} disabled={isLoading} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? (isEditMode ? 'Actualizando...' : 'Guardando...') : (isEditMode ? 'Actualizar Conjunto' : 'Guardar Conjunto')}
        </button>
      </div>
    </form>
  );
}

