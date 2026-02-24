import type { Metadata } from 'next';

import Login from '@/components/modules/login/login';

export const revalidate = false;

export const metadata: Metadata = {
  title: 'Login | Luluzinha',
  description: 'Faça login para acessar o Luluzinha.',
};

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
