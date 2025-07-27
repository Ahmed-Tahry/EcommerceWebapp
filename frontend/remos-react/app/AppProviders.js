'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        {children}
      </OnboardingProvider>
    </AuthProvider>
  );
}
