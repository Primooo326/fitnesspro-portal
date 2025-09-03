// NOTE: This component uses placeholder data.
// TODO: Fetch real data from the API.

const stats = [
  { name: 'Conjuntos Residenciales', value: '12', icon: '🏢' },
  { name: 'Residentes Registrados', value: '1,403', icon: '👤' },
  { name: 'Entrenadores Activos', value: '27', icon: '🏋️' },
  { name: 'Ingresos del Mes', value: '$5,820', icon: '💰' },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="text-3xl mr-4">{stat.icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
