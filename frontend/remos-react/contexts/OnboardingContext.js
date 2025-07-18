'use client'; // This directive is needed for Next.js App Router components that use client-side features like Context and hooks

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

// Helper to determine current step from onboardingStatus
const getStepFromStatus = (status) => {
  if (!status.hasConfiguredBolApi) return 1;
  if (!status.hasCompletedShopSync) return 2;
  if (!status.hasCompletedVatSetup) return 3;
  if (!status.hasCompletedInvoiceSetup) return 4;
  return 5;
};

export const OnboardingProvider = ({ children }) => {
  const [onboardingStatus, setOnboardingStatus] = useState(initialStatus);
  const [currentStep, setCurrentStep] = useState(1); // Manual step navigation
  const didInitStep = useRef(false);
  const [isLoading, setIsLoading] = useState(true); // Loading for onboarding data
  const [error, setError] = useState(null);
  const { authenticated, isLoading: authIsLoading, token, user } = useAuth(); // Get auth state

  // Reset didInitStep when user changes (logs in/out)
  useEffect(() => {
    didInitStep.current = false;
  }, [authenticated, user?.id]);

  // On first load (or user change), set currentStep from onboardingStatus
  useEffect(() => {
    if (
      !didInitStep.current &&
      onboardingStatus &&
      onboardingStatus.userId // Only run when real data is present
    ) {
      const step = getStepFromStatus(onboardingStatus);
      setCurrentStep(step);
      didInitStep.current = true;
    }
  }, [onboardingStatus]);

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
      console.log(data)
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
console.log('API response for updateOnboardingStep:', updatedStatus);
setOnboardingStatus(prevStatus => {
  const newStatus = { ...prevStatus, ...updatedStatus };
  console.log('Updated onboardingStatus:', newStatus);
  return newStatus;
});
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

  // Manual navigation functions
  const goToStep = useCallback((stepId) => {
    if (stepId >= 1 && stepId <= 5) {
      setCurrentStep(stepId);
    }
  }, []);

  const goToNextStep = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Helper functions for step validation
  const isStepComplete = useCallback((stepId) => {
    switch (stepId) {
      case 1:
        return onboardingStatus.hasConfiguredBolApi;
      case 2:
        return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync;
      case 3:
        return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && onboardingStatus.hasCompletedVatSetup;
      case 4:
        return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && onboardingStatus.hasCompletedVatSetup && onboardingStatus.hasCompletedInvoiceSetup;
      case 5:
        return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && onboardingStatus.hasCompletedVatSetup && onboardingStatus.hasCompletedInvoiceSetup;
      default:
        return false;
    }
  }, [onboardingStatus]);

  const canGoToStep = useCallback((stepId) => {
    // Can always go to step 1
    if (stepId === 1) return true;
    
    // For other steps, check if previous step is complete
    return isStepComplete(stepId - 1);
  }, [isStepComplete]);

  // canGoNext: only true if current step is complete
  const canGoNext = useCallback(() => {
    switch (currentStep) {
      case 1:
        return onboardingStatus.hasConfiguredBolApi;
      case 2:
        return onboardingStatus.hasCompletedShopSync;
      case 3:
        return onboardingStatus.hasCompletedVatSetup;
      case 4:
        return onboardingStatus.hasCompletedInvoiceSetup;
      default:
        return false;
    }
  }, [currentStep, onboardingStatus]);

  const canGoPrevious = useCallback(() => {
    // Can always go previous if not on first step
    return currentStep > 1;
  }, [currentStep]);

  const value = {
    onboardingStatus,
    currentStep,
    isLoading,
    error,
    fetchOnboardingStatus,
    updateOnboardingStep,
    markStepAsComplete,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    isStepComplete,
    canGoToStep,
    canGoNext,
    canGoPrevious
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
