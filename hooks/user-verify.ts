import { useContext } from 'react';

import { AuthContext, type AuthState } from '@/providers/auth-provider';

const SIGNED_OUT_STATE: AuthState = {
  user: null,
  isLogged: false,
  isAdmin: false,
  isLoading: false,
  handleLogout: async () => {},
};

export const useUserVerification = (): AuthState =>
  useContext(AuthContext) ?? SIGNED_OUT_STATE;
