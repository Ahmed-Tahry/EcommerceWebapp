import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useShop } from './ShopContext';
import { callApi } from '@/utils/api';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

// Initial onboarding status (all false for new shop)
const initialStatus = {
  hasConfiguredBolApi: false,
  hasCompletedShopSync: false,
  hasCompletedInvoiceSetup: false
};

export const OnboardingProvider = ({ children }) => {
  const { authenticated, token, isLoading: authIsLoading } = useAuth();
  const { selectedShop } = useShop();
  const [onboardingStatus, setOnboardingStatus] = useState(initialStatus);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Debug step changes
  const setCurrentStepWithLog = (step) => {
    console.log('OnboardingContext: Step changed from', currentStep, 'to', step);
    setCurrentStep(step);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopSyncInProgress, setShopSyncInProgress] = useState(false);

  // Centralized function to fetch onboarding status
  const fetchOnboardingStatus = useCallback(async () => {
    if (!authenticated || !token) {
      setIsLoading(false);
      setOnboardingStatus(initialStatus);
      return;
    }

    // Check if userId is available
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('OnboardingContext: No userId in localStorage, waiting for auth to complete');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (selectedShop) {
        // Case 1: Shop is selected - fetch shop-specific onboarding status
        console.log('OnboardingContext: Fetching onboarding status for shop:', selectedShop.shopId);
        const data = await callApi('/settings/settings/onboarding/status', 'GET', null, {}, selectedShop);
        console.log('OnboardingContext: Fetched shop-specific status:', data);
        console.log('OnboardingContext: Status details - hasConfiguredBolApi:', data.hasConfiguredBolApi, 'hasCompletedShopSync:', data.hasCompletedShopSync, 'hasCompletedInvoiceSetup:', data.hasCompletedInvoiceSetup);
        setOnboardingStatus(data);
      } else {
        // Case 2: No shop selected (new shop) - set all steps to false
        console.log('OnboardingContext: No shop selected, setting all steps to false');
        setOnboardingStatus(initialStatus);
      }
    } catch (err) {
      console.error('OnboardingContext: Failed to fetch onboarding status:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setError(errorMessage || 'Failed to load onboarding status.');
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, token, selectedShop]);

  // Case 1: Watch for shop changes
  useEffect(() => {
    if (authenticated && !authIsLoading) {
      console.log('OnboardingContext: Shop changed, fetching onboarding status');
      setHasInitializedStep(false); // Reset initialization flag when shop changes
      setCurrentStepWithLog(1); // Reset to step 1 for new shop
      fetchOnboardingStatus();
    }
  }, [selectedShop, authenticated, authIsLoading, fetchOnboardingStatus]);

  // Case 4: Initial page mount
  useEffect(() => {
    if (!authIsLoading && authenticated) {
      console.log('OnboardingContext: Initial load, fetching onboarding status');
      fetchOnboardingStatus();
    } else if (!authIsLoading && !authenticated) {
      // User not authenticated, reset status
      setOnboardingStatus(initialStatus);
      setIsLoading(false);
    }
  }, [authIsLoading, authenticated, fetchOnboardingStatus]);

  // Case 3: Handle step completion responses
  const updateOnboardingStep = useCallback(async (stepPayload) => {
    if (!authenticated) {
      setError("User not authenticated. Cannot update onboarding step.");
      return Promise.reject(new Error("User not authenticated"));
    }

    if (!selectedShop) {
      setError("No shop selected. Cannot update onboarding step.");
      return Promise.reject(new Error("No shop selected"));
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('OnboardingContext: Updating onboarding step for shop:', selectedShop.shopId, 'with payload:', stepPayload);
      const updatedStatus = await callApi('/settings/settings/onboarding/status', 'POST', stepPayload, {}, selectedShop);
      
      console.log('OnboardingContext: Step completion response:', updatedStatus);
      
      // Update context with the response from backend
      setOnboardingStatus(prevStatus => ({
        ...prevStatus,
        ...updatedStatus
      }));

      return updatedStatus;
    } catch (err) {
      console.error('OnboardingContext: Failed to update onboarding step:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setError(errorMessage || 'Failed to update step.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, selectedShop]);

  // Helper function to mark a specific step as complete
  const markStepAsComplete = useCallback(async (stepName) => {
    if (!authenticated) {
      setError("User not authenticated. Cannot mark step as complete.");
      return Promise.reject(new Error("User not authenticated"));
    }

    if (!selectedShop) {
      setError("No shop selected. Cannot mark step as complete.");
      return Promise.reject(new Error("No shop selected"));
    }

    return await updateOnboardingStep({ [stepName]: true });
  }, [updateOnboardingStep, authenticated, selectedShop]);

  // Navigation functions
  const goToNextStep = useCallback(() => {
    const newStep = currentStep + 1;
    if (newStep <= 5) { // Maximum 5 steps
      console.log('OnboardingContext: Navigating to next step:', newStep);
      setCurrentStepWithLog(newStep);
    } else {
      console.log('OnboardingContext: Cannot go to next step, already at max step');
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    const newStep = currentStep - 1;
    console.log('OnboardingContext: goToPreviousStep called, currentStep:', currentStep, 'newStep:', newStep);
    if (newStep >= 1) {
      console.log('OnboardingContext: Navigating to previous step:', newStep);
      setCurrentStepWithLog(newStep);
    } else {
      console.log('OnboardingContext: Cannot go to previous step, already at step 1');
    }
  }, [currentStep]);

  // Note: calculateCurrentStep function removed - all navigation is now manual

  // Calculate step only on first mount to show correct initial step
  const [hasInitializedStep, setHasInitializedStep] = useState(false);
  
  useEffect(() => {
    console.log('OnboardingContext: Initial step calculation useEffect triggered, hasInitializedStep:', hasInitializedStep);
    
    const calculateAndSetStep = () => {
      // Only run if we haven't initialized yet and we have valid data from backend
      if (!authIsLoading && authenticated && !isLoading && !hasInitializedStep && selectedShop) {
        console.log('OnboardingContext: Calculating initial step based on onboarding status:', onboardingStatus);
        console.log('OnboardingContext: hasConfiguredBolApi:', onboardingStatus.hasConfiguredBolApi);
        console.log('OnboardingContext: hasCompletedShopSync:', onboardingStatus.hasCompletedShopSync);
        console.log('OnboardingContext: hasCompletedInvoiceSetup:', onboardingStatus.hasCompletedInvoiceSetup);
        
        // Only proceed if we have actual data from backend (not initial false values)
        // This prevents calculating step with initial false values
        if (onboardingStatus === initialStatus) {
          console.log('OnboardingContext: Still using initial status, waiting for backend data');
          return;
        }
        
        // Additional check: if we're on step 1 and all onboarding status is false, stay on step 1
        if (currentStep === 1 && !onboardingStatus.hasConfiguredBolApi && !onboardingStatus.hasCompletedShopSync && !onboardingStatus.hasCompletedInvoiceSetup) {
          console.log('OnboardingContext: Already on step 1 with all false status, staying on step 1');
          return;
        }
        
        // Calculate the correct step based on onboarding status
        let calculatedStep = 1;
        
        // Show the current step to work on based on completion status
        if (onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && onboardingStatus.hasCompletedInvoiceSetup) {
          calculatedStep = 5; // All complete - show completion step
        } else if (onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync) {
          calculatedStep = 3; // Show VAT Setup
        } else if (onboardingStatus.hasConfiguredBolApi) {
          calculatedStep = 2; // Show Shop Sync
        } else {
          calculatedStep = 1; // Show Bol credentials
        }
        
        console.log('OnboardingContext: Setting initial step to:', calculatedStep);
        setCurrentStepWithLog(calculatedStep);
        setHasInitializedStep(true);
      }
    };
    
    calculateAndSetStep();
  }, [selectedShop, authenticated, authIsLoading, isLoading, hasInitializedStep]); // Run when shop changes, but only once

  const value = {
    onboardingStatus,
    currentStep,
    isLoading,
    error,
    updateOnboardingStep,
    markStepAsComplete,
    selectedShop,
    shopSyncInProgress,
    setShopSyncInProgress,
    goToNextStep,
    goToPreviousStep,
    fetchOnboardingStatus
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
