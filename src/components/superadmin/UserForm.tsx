'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id?: string;
  nombre: string;
  edad: number;
  correo: string;
  telefono: string;
  notificaciones: boolean;
}

interface UserFormProps {
  user?: User;
}

export default function UserForm({ user }: UserFormProps) {
  const [formData, setFormData] = useState<User>({
    nombre: '',
    edad: 0,
    correo: '',
    telefono: '',
    notificaciones: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = user ? `/api/users/${user.id}` : '/api/users';
    const method = user ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/superadmin/users');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="edad" className="block text-sm font-medium text-gray-700">Edad</label>
        <input type="number" name="edad" id="edad" value={formData.edad} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
        <input type="email" name="correo" id="correo" value={formData.correo} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input type="text" name="telefono" id="telefono" value={formData.telefono} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="notificaciones" id="notificaciones" checked={formData.notificaciones} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <label htmlFor="notificaciones" className="ml-2 block text-sm text-gray-900">Acepta notificaciones</label>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2">Cancelar</button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{user ? 'Actualizar' : 'Crear'}</button>
      </div>
    </form>
  );
}
