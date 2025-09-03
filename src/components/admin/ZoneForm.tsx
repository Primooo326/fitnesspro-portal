'use client';

import { useState } from 'react';

interface ZoneFormProps {
  onCreate: (name: string) => void;
}

export default function ZoneForm({ onCreate }: ZoneFormProps) {
  const [newZoneName, setNewZoneName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(newZoneName);
    setNewZoneName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input 
        type="text" 
        value={newZoneName} 
        onChange={(e) => setNewZoneName(e.target.value)} 
        placeholder="Nombre de la zona" 
        className="border p-2 rounded mr-2"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Crear Zona</button>
    </form>
  );
}
