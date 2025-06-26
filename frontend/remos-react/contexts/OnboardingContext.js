'use client'; // This directive is needed for Next.js App Router components that use client-side features like Context and hooks

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { callApi } from '@/utils/api'; // Assuming jsconfig.json paths are set up for @/
import { useAuth } from '@/contexts/AuthContext'; // Importing the Auth context to get authentication state
const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext);

const initialStatus = {
  userId: null,
  hasConfiguredBolApi: false,
  hasCompletedShopSync: false,
  hasCompletedVatSetup: false,
  hasCompletedInvoiceSetup: false,
  createdAt: null,
  updatedAt: null,
};

export const OnboardingProvider = ({ children }) => {
  const [onboardingStatus, setOnboardingStatus] = useState(initialStatus);

  const [isLoading, setIsLoading] = useState(true); // Loading for onboarding data
  const [error, setError] = useState(null);
  const { authenticated, isLoading: authIsLoading, token } = useAuth(); // Get auth state

  const fetchOnboardingStatus = useCallback(async () => {
    if (!authenticated || !token) { // Ensure authenticated and token is present
      setIsLoading(false); // Not loading onboarding status if not auth'd
      // setError("User not authenticated. Cannot fetch onboarding status."); // Optional: set error
      setOnboardingStatus(initialStatus); // Reset status
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // callApi will now use the token via keycloakService
      const data = await callApi('/settings/settings/onboarding/status', 'GET');
      setOnboardingStatus(prevStatus => ({ ...prevStatus, ...data }));
    } catch (err) {
      console.error('Failed to fetch onboarding status:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setError(errorMessage || 'Failed to load onboarding status.');
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, token]); // Add authenticated and token as dependencies

  useEffect(() => {
    // Fetch onboarding status only if authentication is complete and user is authenticated
    if (!authIsLoading && authenticated) {
      fetchOnboardingStatus();
    } else if (!authIsLoading && !authenticated) {
      // If auth check is done and user is not authenticated, reset status and stop loading.
      setOnboardingStatus(initialStatus);
      setIsLoading(false);
    }
  }, [authIsLoading, authenticated, fetchOnboardingStatus]);

  const updateOnboardingStep = useCallback(async (stepPayload) => {
    if (!authenticated) {
      setError("User not authenticated. Cannot update onboarding step.");
      return Promise.reject(new Error("User not authenticated"));
    }
    setIsLoading(true);
    setError(null);
    try {
      const updatedStatus = await callApi('/settings/settings/onboarding/step', 'POST', stepPayload);
      setOnboardingStatus(prevStatus => ({ ...prevStatus, ...updatedStatus }));
      return updatedStatus;
    } catch (err) {
      console.error('Failed to update onboarding step:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setError(errorMessage || 'Failed to update step.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authenticated]); // Add authenticated as dependency

  const markStepAsComplete = useCallback(async (stepName) => {
    if (!authenticated) {
      setError("User not authenticated. Cannot mark step as complete.");
      return Promise.reject(new Error("User not authenticated"));
    }
    if (onboardingStatus && typeof onboardingStatus[stepName] === 'undefined') {
        const errorMessage = `Error: Step ${stepName} is not a valid onboarding status property.`;
        console.error(errorMessage);
        setError(errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
    return await updateOnboardingStep({ [stepName]: true });
  }, [updateOnboardingStep, onboardingStatus, authenticated]); // Add authenticated


  const value = {
    onboardingStatus,
    isLoading,
    error,
    fetchOnboardingStatus,
    updateOnboardingStep,
    markStepAsComplete
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
