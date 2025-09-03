import ConjuntoForm from '@/components/superadmin/ConjuntoForm';
import Link from 'next/link';

export default function NuevoConjuntoPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/superadmin/conjuntos" className="text-blue-600 hover:underline">
          &larr; Volver a la lista de conjuntos
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Agregar Nuevo Conjunto Residencial</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
         <ConjuntoForm />
      </div>
    </div>
  );
}
