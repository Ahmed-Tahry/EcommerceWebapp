'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isLoading && !authenticated) {
      router.push('/login');
    }
  }, [authenticated, isLoading, router]);

  if (isLoading) {
    return <div className="p-4">Loading authentication status...</div>;
  }

  if (!authenticated) {
    // Redirecting, but in case it takes a moment, show a message
    return <div className="p-4">Redirecting to login...</div>;
  }

  return <>{children}</>;
}
