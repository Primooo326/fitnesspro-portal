// NOTE: This component uses placeholder data.
// TODO: Fetch real data from the API and implement pagination.

const recentActivities = [
  { id: 1, user: 'Carlos Mendoza', action: 'se registró en', target: 'Conjunto El Roble', time: 'hace 5 minutos' },
  { id: 2, user: 'Laura Jiménez', action: 'solicitó un entrenamiento con', target: 'Entrenador David', time: 'hace 2 horas' },
  { id: 3, user: 'Admin - Conjunto El Roble', action: 'actualizó los horarios de la', target: 'Piscina', time: 'hace 1 día' },
  { id: 4, user: 'Sofia Vargas (Entrenador)', action: 'fue aprobada como', target: 'Nuevo Entrenador', time: 'hace 2 días' },
];

export default function RecentActivity() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-medium">Usuario</th>
              <th className="p-4 font-medium">Acción</th>
              <th className="p-4 font-medium">Detalle</th>
              <th className="p-4 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.map((activity) => (
              <tr key={activity.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{activity.user}</td>
                <td className="p-4">{activity.action}</td>
                <td className="p-4 font-semibold">{activity.target}</td>
                <td className="p-4 text-gray-500">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
