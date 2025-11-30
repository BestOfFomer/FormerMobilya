'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api-client';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, accessToken, setAuth, logout } = useAuthStore();
  const hasValidated = useRef(false);

  useEffect(() => {
    // Skip if already validated
    if (hasValidated.current) {
      return;
    }

    const validateAuth = async () => {
      // If not authenticated, redirect to login
      if (!isAuthenticated || !accessToken) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Verify user role is admin
      if (user?.role !== 'admin') {
        logout();
        router.push('/login');
        return;
      }

      // Verify token is still valid by fetching profile (only once)
      try {
        const response = await api.auth.getProfile(accessToken) as any;
        
        // Update user data if it changed
        if (response.user) {
          setAuth(response.user, accessToken, useAuthStore.getState().refreshToken || '');
        }
        
        // Mark as validated
        hasValidated.current = true;
      } catch (error: any) {
        // Token is invalid or expired
        if (error.status === 401) {
          logout();
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
        // For other errors, allow access but log the error
        console.error('Auth validation error:', error);
      }
    };

    validateAuth();
  }, [isAuthenticated, accessToken, pathname, router]); // Removed user, setAuth, logout from deps

  // Don't render children until auth is validated
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
