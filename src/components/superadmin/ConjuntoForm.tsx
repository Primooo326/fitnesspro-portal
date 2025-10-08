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
      emailAdmin: '',
      adminUid: ''
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [adminsError, setAdminsError] = useState<string | null>(null);
  const adminAssigned = Boolean((formData as any).adminUid);

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
        let message = 'Ocurrió un error';
        try {
          const errorData = await response.json();
          message = errorData?.error || message;
        } catch {}
        // Resaltar conflictos de negocio (409)
        if (response.status === 409) {
          setError(message);
          return;
        }
        throw new Error(message);
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
              <input type="text" name="nombreAdmin" id="nombreAdmin" value={formData.nombreAdmin} onChange={handleChange} className="input" disabled={adminAssigned} />
              <span className="helper-text">{adminAssigned ? 'Deshabilitado: ya asignaste un administrador existente' : 'Opcional si asignas un administrador existente'}</span>
            </div>
            <div className="w-full">
              <label className="label-text" htmlFor="emailAdmin">Email del Administrador</label>
              <input type="email" name="emailAdmin" id="emailAdmin" value={formData.emailAdmin} onChange={handleChange} className="input" disabled={adminAssigned} />
              <span className="helper-text">{adminAssigned ? 'Deshabilitado: ya asignaste un administrador existente' : 'Opcional si asignas un administrador existente'}</span>
            </div>
            <div className="w-full">
              <button
                type="button"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                onClick={async () => {
                  setAssignOpen(true);
                  setAdminsLoading(true);
                  setAdminsError(null);
                  try {
                    const res = await fetch(`/api/users?role=Administrador de Conjunto&available=true`);
                    if (!res.ok) throw new Error('No se pudieron cargar administradores');
                    const data = await res.json();
                    setAdmins(data || []);
                  } catch (e: any) {
                    setAdminsError(e.message);
                  } finally {
                    setAdminsLoading(false);
                  }
                }}
              >
                {adminAssigned ? 'Cambiar administrador' : 'Asignar administrador'}
              </button>
              {formData.adminUid && (
                <p className="text-sm text-green-700 mt-2">
                  Administrador asignado: <span className="font-medium">{formData.adminUid}</span>
                  <button
                    type="button"
                    className="ml-3 text-xs text-red-700 underline hover:no-underline"
                    onClick={() => setFormData((prev: any) => ({ ...prev, adminUid: '' }))}
                  >
                    Quitar
                  </button>
                </p>
              )}
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

      {/* Modal de asignación de administrador */}
      {assignOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Asignar administrador existente</h3>
              <button onClick={() => setAssignOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {adminsLoading && <p>Cargando administradores...</p>}
            {adminsError && <p className="text-red-600">{adminsError}</p>}
            {!adminsLoading && !adminsError && (
              <div className="max-h-96 overflow-auto divide-y">
                {admins.length === 0 && (
                  <p className="text-sm text-gray-600">No hay administradores disponibles para asignar.</p>
                )}
                {admins.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">{a.nombre || a.email}</p>
                      <p className="text-sm text-gray-600">{a.email}</p>
                      <p className="text-xs text-gray-500">UID: {a.id}</p>
                    </div>
                    <button
                      type="button"
                      className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700"
                      onClick={() => {
                        setFormData((prev: any) => ({ ...prev, adminUid: a.id, nombreAdmin: '', emailAdmin: '' }));
                        setAssignOpen(false);
                      }}
                    >
                      Asignar
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300" type="button" onClick={() => setAssignOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

