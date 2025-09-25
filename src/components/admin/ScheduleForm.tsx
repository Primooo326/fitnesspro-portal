'use client';

import { useState } from 'react';

import { Horario } from '@/models/interfaces';

type ScheduleFormData = Omit<Horario, 'id'>;

import { useEffect } from 'react';

interface ScheduleFormProps {
  onSubmit: (schedule: ScheduleFormData) => void;
  initialData?: ScheduleFormData | null;
  isEditing?: boolean;
  onClose?: () => void;
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;
const initialState: ScheduleFormData = { dia: 'Lunes', horaInicio: '', horaFin: '', aforo: 1 };

export default function ScheduleForm({ onSubmit, initialData, isEditing = false, onClose }: ScheduleFormProps) {
  const [formData, setFormData] = useState<ScheduleFormData>(initialState);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialState);
    }
  }, [isEditing, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData(initialState);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'aforo' ? parseInt(value, 10) || 1 : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="dia-select" className="block text-sm font-medium text-gray-700">Día</label>
        <select
          id="dia-select"
          name="dia"
          value={formData.dia}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          {DIAS_SEMANA.map(dia => <option key={dia} value={dia}>{dia}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hora Inicio</label>
        <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hora Fin</label>
        <input type="time" name="horaFin" value={formData.horaFin} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Aforo</label>
        <input type="number" name="aforo" value={formData.aforo} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" min="1" required />
      </div>
      <div className="flex justify-end space-x-2">
        {onClose && (
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
            Cancelar
          </button>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          {isEditing ? 'Actualizar Horario' : 'Crear Horario'}
        </button>
      </div>
    </form>
  );
}
