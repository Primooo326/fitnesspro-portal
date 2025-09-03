'use client';

import { useState } from 'react';

interface ScheduleFormProps {
  onCreate: (schedule: { dia: string; horaInicio: string; horaFin: string; aforo: number }) => void;
}

export default function ScheduleForm({ onCreate }: ScheduleFormProps) {
  const [newHorario, setNewHorario] = useState({ dia: '', horaInicio: '', horaFin: '', aforo: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(newHorario);
    setNewHorario({ dia: '', horaInicio: '', horaFin: '', aforo: 0 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHorario(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Día</label>
        <input type="text" name="dia" value={newHorario.dia} onChange={handleInputChange} className="border p-2 rounded w-full" required />
      </div>
      <div>
        <label className="block">Hora Inicio</label>
        <input type="time" name="horaInicio" value={newHorario.horaInicio} onChange={handleInputChange} className="border p-2 rounded w-full" required />
      </div>
      <div>
        <label className="block">Hora Fin</label>
        <input type="time" name="horaFin" value={newHorario.horaFin} onChange={handleInputChange} className="border p-2 rounded w-full" required />
      </div>
      <div>
        <label className="block">Aforo</label>
        <input type="number" name="aforo" value={newHorario.aforo} onChange={handleInputChange} className="border p-2 rounded w-full" required />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Crear Horario</button>
    </form>
  );
}
