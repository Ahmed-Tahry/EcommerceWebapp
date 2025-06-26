'use client'; // This directive is needed for Next.js App Router components that use client-side features like Context and hooks

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { callApi } from '@/utils/api'; // Assuming jsconfig.json paths are set up for @/

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOnboardingStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callApi('/settings/onboarding/status', 'GET');
      setOnboardingStatus(prevStatus => ({ ...prevStatus, ...data }));
    } catch (err) {
      console.error('Failed to fetch onboarding status:', err);
      // Check if err has a message property, otherwise stringify err
      const errorMessage = (err && err.message) ? err.message : String(err);
      setError(errorMessage || 'Failed to load onboarding status.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOnboardingStatus();
  }, [fetchOnboardingStatus]);

  const updateOnboardingStep = useCallback(async (stepPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedStatus = await callApi('/settings/onboarding/step', 'POST', stepPayload);
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
  }, []);

  const markStepAsComplete = useCallback(async (stepName) => {
    if (onboardingStatus && typeof onboardingStatus[stepName] === 'undefined') {
        const errorMessage = `Error: Step ${stepName} is not a valid onboarding status property.`;
        console.error(errorMessage);
        setError(errorMessage);
        return;
    }
    return await updateOnboardingStep({ [stepName]: true });
  }, [updateOnboardingStep, onboardingStatus]);


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
