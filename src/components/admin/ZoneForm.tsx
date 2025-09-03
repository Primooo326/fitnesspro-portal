'use client';

import { useState } from 'react';

interface ZoneFormProps {
  onCreate: (name: string, aforo: number) => void;
}

export default function ZoneForm({ onCreate }: ZoneFormProps) {
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneAforo, setNewZoneAforo] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(newZoneName, newZoneAforo);
    setNewZoneName('');
    setNewZoneAforo(0);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input 
        type="text" 
        value={newZoneName} 
        onChange={(e) => setNewZoneName(e.target.value)} 
        placeholder="Nombre de la zona" 
        className="border p-2 rounded"
        required
      />
      <input 
        type="number" 
        value={newZoneAforo} 
        onChange={(e) => setNewZoneAforo(parseInt(e.target.value) || 0)} 
        placeholder="Aforo" 
        className="border p-2 rounded w-24"
        min="0"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Crear Zona</button>
    </form>
  );
}
