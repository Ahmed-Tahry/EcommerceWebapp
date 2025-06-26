'use client';

import { AuthProvider } from '@/contexts/AuthContext';
// If you have other global providers, you can add them here too.
// For example, the OnboardingProvider if it needs to be truly global,
// though often page-specific providers are better placed closer to their usage.

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      {/* If OnboardingProvider was global, it would go here, likely inside AuthProvider */}
      {/* <OnboardingProvider> */}
      {children}
      {/* </OnboardingProvider> */}
    </AuthProvider>
  );
}
