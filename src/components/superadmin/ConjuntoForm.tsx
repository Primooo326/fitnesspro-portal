'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ConjuntoFormProps {
  isEditMode?: boolean;
  initialData?: { [key: string]: any };
  conjuntoId?: string;
}

export default function ConjuntoForm({ isEditMode = false, initialData = {}, conjuntoId }: ConjuntoFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombreConjunto: '',
    direccion: '',
    nombreAdmin: '',
    emailAdmin: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        nombreConjunto: initialData.nombre || '',
        direccion: initialData.direccion || '',
        nombreAdmin: '', // No editamos el admin desde aquí
        emailAdmin: '',  // No editamos el admin desde aquí
      });
    }
  }, [isEditMode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const url = isEditMode ? `/api/superadmin/conjuntos/${conjuntoId}` : '/api/superadmin/conjuntos';
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
      router.refresh(); // Refresca los datos de la página anterior

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
          <div>
            <label htmlFor="nombreConjunto" className="block text-sm font-medium text-gray-700">Nombre del Conjunto</label>
            <input type="text" name="nombreConjunto" id="nombreConjunto" value={formData.nombreConjunto} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
            <input type="text" name="direccion" id="direccion" value={formData.direccion} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      {!isEditMode && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Información del Administrador Inicial</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="nombreAdmin" className="block text-sm font-medium text-gray-700">Nombre del Administrador</label>
              <input type="text" name="nombreAdmin" id="nombreAdmin" value={formData.nombreAdmin} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="emailAdmin" className="block text-sm font-medium text-gray-700">Email del Administrador</label>
              <input type="email" name="emailAdmin" id="emailAdmin" value={formData.emailAdmin} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
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
