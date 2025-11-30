import { useAuthStore } from '@/lib/auth-store';

export function useAuth() {
  const { user, accessToken, refreshToken, isAuthenticated, login, logout } = useAuthStore();

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    logout,
  };
}
