import DashboardStats from '@/components/superadmin/DashboardStats';
import RecentActivity from '@/components/superadmin/RecentActivity';

export default function SuperAdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard General</h1>
      <DashboardStats />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Actividad Reciente</h2>
        <RecentActivity />
      </div>
    </div>
  );
}
