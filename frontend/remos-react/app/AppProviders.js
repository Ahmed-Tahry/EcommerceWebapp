'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { ShopProvider } from '@/contexts/ShopContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ShopProvider>
        <OnboardingProvider>
          {children}
        </OnboardingProvider>
      </ShopProvider>
    </AuthProvider>
  );
}
