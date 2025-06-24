import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import KeycloakService from '../keycloak'; // Assuming KeycloakService is set up
import { getOnboardingStatus as fetchOnboardingStatusApi } from '../services/apiService'; // Your API service

interface IUserOnboardingStatus {
  userId: string;
  hasConfiguredBolApi: boolean;
  // Add other steps as defined in your backend model, e.g.:
  // hasCompletedVatSetup?: boolean;
  createdAt?: string; // Assuming date comes as string from API
  updatedAt?: string;
}

interface OnboardingContextType {
  status: IUserOnboardingStatus | null;
  isLoading: boolean;
  error: string | null;
  fetchStatus: () => Promise<void>;
  markStepComplete: (stepUpdate: Partial<Omit<IUserOnboardingStatus, 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<IUserOnboardingStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!KeycloakService.isLoggedIn()) {
      // setError("User not logged in. Cannot fetch onboarding status.");
      // setIsLoading(false); // Or handle as per your app's auth flow
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchOnboardingStatusApi();
      setStatus(response.data);
    } catch (err: any) {
      console.error("Failed to fetch onboarding status:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch onboarding status");
      setStatus(null); // Reset status on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to mark a step as complete (and refetch status)
  // This is a generic example; you might have specific functions per step
  const markStepComplete = async (stepUpdate: Partial<Omit<IUserOnboardingStatus, 'userId' | 'createdAt' | 'updatedAt'>>) => {
      if (!KeycloakService.isLoggedIn()) {
        setError("User not logged in. Cannot update onboarding status.");
        return;
      }
      // Example: await updateOnboardingStepApi(stepUpdate);
      // For now, we assume the component calling this will handle the API call
      // and then call fetchStatus to refresh.
      // Or, this function could take the specific API call function as a parameter.
      // For simplicity, we'll just refetch status here after an assumed update.
      await fetchStatus(); // Re-fetch status after an update
  };


  useEffect(() => {
    if (KeycloakService.isLoggedIn()) {
      fetchStatus();
    } else {
        // If not logged in (e.g. after logout or before login completes), clear status
        setStatus(null);
        setIsLoading(false); // Not loading if not logged in
    }
    // Re-fetch on login/logout might be handled by App.tsx re-rendering the provider
    // or by listening to Keycloak events if KeycloakService emits them.
  }, []); // Re-run if Keycloak login status changes (this might need a trigger)

  return (
    <OnboardingContext.Provider value={{ status, isLoading, error, fetchStatus, markStepComplete }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
