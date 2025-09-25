'use client';

import { useState } from 'react';

interface ZoneFormProps {
  onCreate: (formData: {
    nombre: string;
    aforo: number;
    descripcion: string;
    file: File | null;
  }) => void;
}

export default function ZoneForm({ onCreate }: ZoneFormProps) {
  const [nombre, setNombre] = useState('');
  const [aforo, setAforo] = useState<number>(0);
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || aforo <= 0 || !descripcion) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    onCreate({ nombre, aforo, descripcion, file });
    setNombre('');
    setAforo(0);
    setDescripcion('');
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la zona"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          value={aforo}
          onChange={(e) => setAforo(parseInt(e.target.value, 10) || 0)}
          placeholder="Aforo"
          className="border p-2 rounded w-full sm:w-24"
          min="1"
          required
        />
      </div>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción de la zona"
        className="border p-2 rounded w-full"
        rows={3}
        required
      />
      <div className="flex flex-col">
        <label htmlFor="zone-image" className="mb-1 text-sm font-medium text-gray-700">
          Imagen de la Zona (Opcional)
        </label>
        <input
          id="zone-image"
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded w-full text-sm"
          accept="image/*"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto">
        Crear Zona
      </button>
    </form>
  );
}
