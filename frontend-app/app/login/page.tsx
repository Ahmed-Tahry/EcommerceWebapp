'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { authenticated, login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to home page
    if (authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Dashboard</h1>
        <p className="mb-6 text-center text-gray-600">
          Please login with your Keycloak account to access the dashboard.
        </p>
        <Button 
          onClick={login}
          className="w-full py-6 text-lg"
        >
          Login with Keycloak
        </Button>
      </div>
    </div>
  );
}
