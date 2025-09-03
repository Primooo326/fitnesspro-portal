'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Trainer {
  id?: string;
  cedula: string;
  codigo: string;
  nombre: string;
  correo: string;
  celular: string;
  datosPersonales?: string;
  contactoEmergencia?: string;
}

interface TrainerFormProps {
  trainer?: Trainer;
}

export default function TrainerForm({ trainer }: TrainerFormProps) {
  const [formData, setFormData] = useState<Trainer>({
    cedula: '',
    codigo: '',
    nombre: '',
    correo: '',
    celular: '',
    datosPersonales: '',
    contactoEmergencia: '',
  });
  const router = useRouter();

  useEffect(() => {
    if (trainer) {
      setFormData(trainer);
    }
  }, [trainer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = trainer ? `/api/trainers/${trainer.id}` : '/api/trainers';
    const method = trainer ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/superadmin/trainers');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
        <input type="text" name="cedula" id="cedula" value={formData.cedula} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código</label>
        <input type="text" name="codigo" id="codigo" value={formData.codigo} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
        <input type="email" name="correo" id="correo" value={formData.correo} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="celular" className="block text-sm font-medium text-gray-700">Celular</label>
        <input type="text" name="celular" id="celular" value={formData.celular} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="datosPersonales" className="block text-sm font-medium text-gray-700">Datos Personales</label>
        <textarea name="datosPersonales" id="datosPersonales" value={formData.datosPersonales} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label htmlFor="contactoEmergencia" className="block text-sm font-medium text-gray-700">Contacto de Emergencia</label>
        <textarea name="contactoEmergencia" id="contactoEmergencia" value={formData.contactoEmergencia} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2">Cancelar</button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{trainer ? 'Actualizar' : 'Crear'}</button>
      </div>
    </form>
  );
}
