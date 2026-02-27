'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';

import { useUserVerification } from '@/hooks/user-verify';
import { AdminParticipantForm } from '@/components/modules/admin/admin-participant-form';
import { RoleManager } from '@/components/modules/admin/role-manager';
import { Button } from '@/components/ui/button';

type Tab = 'cadastrar' | 'roles';

const AdminPage = () => {
  const { isAdmin, isLoading } = useUserVerification();
  const [activeTab, setActiveTab] = useState<Tab>('cadastrar');

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

      <div className="flex gap-2">
        <Button
          variant={activeTab === 'cadastrar' ? 'default' : 'outline'}
          onClick={() => setActiveTab('cadastrar')}
        >
          Cadastrar Lulu
        </Button>
        <Button
          variant={activeTab === 'roles' ? 'default' : 'outline'}
          onClick={() => setActiveTab('roles')}
        >
          Gerenciar Roles
        </Button>
      </div>

      {activeTab === 'cadastrar' && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Cadastrar Nova Lulu</h2>
          <AdminParticipantForm />
        </section>
      )}

      {activeTab === 'roles' && (
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Gerenciar Participantes e Roles
          </h2>
          <RoleManager />
        </section>
      )}
    </div>
  );
};

export default AdminPage;
