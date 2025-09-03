'use client';

import UserForm from '@/components/superadmin/UserForm';

export default function NewUserPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Nuevo Usuario</h1>
      <UserForm />
    </div>
  );
}
