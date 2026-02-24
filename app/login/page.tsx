import type { Metadata } from 'next';
import React from 'react';

import Login from '@/components/modules/login/login';

export const metadata: Metadata = {
  title: 'Login | Luluzinha',
  description: 'Faça login para acessar o Luluzinha.',
};

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
