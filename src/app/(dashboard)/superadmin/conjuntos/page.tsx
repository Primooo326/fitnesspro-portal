import ConjuntosList from '@/components/superadmin/ConjuntosList';
import Link from 'next/link';

export default function GestionConjuntosPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Conjuntos Residenciales</h1>
        <Link href="/superadmin/conjuntos/nuevo">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            + Agregar Nuevo Conjunto
          </button>
        </Link>
      </div>
      <ConjuntosList />
    </div>
  );
}
