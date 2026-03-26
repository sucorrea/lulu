'use client';

import { redirect } from 'next/navigation';

import { useUserVerification } from '@/hooks/user-verify';
import { AdminParticipantForm } from '@/components/modules/admin/admin-participant-form';

const AdminPage = () => {
  const { isAdmin, isLoading } = useUserVerification();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">Verificando permissões...</p>
      </div>
    );
  }

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold font-comic">Administração</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">Cadastrar Nova Lulu</h2>
        <AdminParticipantForm />
      </section>
    </div>
  );
};

export default AdminPage;
