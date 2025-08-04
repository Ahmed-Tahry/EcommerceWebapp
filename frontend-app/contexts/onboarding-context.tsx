"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useShop } from "@/contexts/ShopContext"
import { callApi } from "@/lib/api"

interface OnboardingStatus {
  hasConfiguredBolApi: boolean
  hasCompletedShopSync: boolean
  hasCompletedInvoiceSetup: boolean
}

interface OnboardingContextType {
  onboardingStatus: OnboardingStatus
  currentStep: number
  isLoading: boolean
  error: string | null
  updateOnboardingStep: (stepPayload: Partial<OnboardingStatus>) => Promise<any>
  markStepAsComplete: (stepName: keyof OnboardingStatus) => Promise<any>
  goToNextStep: () => void
  goToPreviousStep: () => void
  fetchOnboardingStatus: () => Promise<void>
  shopSyncInProgress: boolean
  setShopSyncInProgress: (inProgress: boolean) => void
  selectedShop: any
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

// Initial onboarding status (all false for new shop)
const initialStatus: OnboardingStatus = {
  hasConfiguredBolApi: false,
  hasCompletedShopSync: false,
  hasCompletedInvoiceSetup: false
}

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, token, isLoading: authIsLoading } = useAuth()
  const { selectedShop } = useShop()
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>(initialStatus)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Debug step changes
  const setCurrentStepWithLog = (step: number) => {
    console.log('OnboardingContext: Step changed from', currentStep, 'to', step)
    setCurrentStep(step)
  }
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shopSyncInProgress, setShopSyncInProgress] = useState(false)

  // Centralized function to fetch onboarding status
  const fetchOnboardingStatus = useCallback(async () => {
    if (!authenticated || !token) {
      setIsLoading(false)
      setOnboardingStatus(initialStatus)
      return
    }

    // Check if userId is available
    const userId = localStorage.getItem('userId')
    if (!userId) {
      console.log('OnboardingContext: No userId in localStorage, waiting for auth to complete')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (selectedShop) {
        // Case 1: Shop is selected - fetch shop-specific onboarding status
        console.log('OnboardingContext: Fetching onboarding status for shop:', selectedShop.shopId)
        const data = await callApi('/settings/settings/onboarding/status', 'GET', null, {}, selectedShop)
        console.log('OnboardingContext: Fetched shop-specific status:', data)
        console.log('OnboardingContext: Status details - hasConfiguredBolApi:', data.hasConfiguredBolApi, 'hasCompletedShopSync:', data.hasCompletedShopSync, 'hasCompletedInvoiceSetup:', data.hasCompletedInvoiceSetup)
        setOnboardingStatus(data)
      } else {
        // Case 2: No shop selected (new shop) - set all steps to false
        console.log('OnboardingContext: No shop selected, setting all steps to false')
        setOnboardingStatus(initialStatus)
      }
    } catch (err) {
      console.error('OnboardingContext: Failed to fetch onboarding status:', err)
      const errorMessage = (err && (err as Error).message) ? (err as Error).message : String(err)
      setError(errorMessage || 'Failed to load onboarding status.')
    } finally {
      setIsLoading(false)
    }
  }, [authenticated, token, selectedShop])

  // Case 3: Handle step completion responses
  const updateOnboardingStep = useCallback(async (stepPayload: Partial<OnboardingStatus>) => {
    if (!authenticated) {
      setError("User not authenticated. Cannot update onboarding step.")
      return Promise.reject(new Error("User not authenticated"))
    }

    if (!selectedShop) {
      setError("No shop selected. Cannot update onboarding step.")
      return Promise.reject(new Error("No shop selected"))
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('OnboardingContext: Updating onboarding step for shop:', selectedShop.shopId, 'with payload:', stepPayload)
      const updatedStatus = await callApi('/settings/settings/onboarding/status', 'POST', stepPayload, {}, selectedShop)
      
      console.log('OnboardingContext: Step completion response:', updatedStatus)
      
      // Update context with the response from backend
      setOnboardingStatus(prevStatus => ({
        ...prevStatus,
        ...updatedStatus
      }))

      return updatedStatus
    } catch (err) {
      console.error('OnboardingContext: Failed to update onboarding step:', err)
      const errorMessage = (err && (err as Error).message) ? (err as Error).message : String(err)
      setError(errorMessage || 'Failed to update step.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [authenticated, selectedShop])

  // Helper function to mark a specific step as complete
  const markStepAsComplete = useCallback(async (stepName: keyof OnboardingStatus) => {
    if (!authenticated) {
      setError("User not authenticated. Cannot mark step as complete.")
      return Promise.reject(new Error("User not authenticated"))
    }

    if (!selectedShop) {
      setError("No shop selected. Cannot mark step as complete.")
      return Promise.reject(new Error("No shop selected"))
    }

    return await updateOnboardingStep({ [stepName]: true })
  }, [updateOnboardingStep, authenticated, selectedShop])

  // Navigation functions
  const goToNextStep = useCallback(() => {
    const newStep = currentStep + 1
    if (newStep <= 5) { // Maximum 5 steps
      console.log('OnboardingContext: Navigating to next step:', newStep)
      setCurrentStepWithLog(newStep)
    } else {
      console.log('OnboardingContext: Cannot go to next step, already at max step')
    }
  }, [currentStep])

  const goToPreviousStep = useCallback(() => {
    const newStep = currentStep - 1
    console.log('OnboardingContext: goToPreviousStep called, currentStep:', currentStep, 'newStep:', newStep)
    if (newStep >= 1) {
      console.log('OnboardingContext: Navigating to previous step:', newStep)
      setCurrentStepWithLog(newStep)
    } else {
      console.log('OnboardingContext: Cannot go to previous step, already at step 1')
    }
  }, [currentStep])

  // Case 1: Watch for shop changes
  useEffect(() => {
    if (authenticated && !authIsLoading) {
      console.log('OnboardingContext: Shop changed, fetching onboarding status')
      // This line is no longer needed as step calculation is manual
      setCurrentStepWithLog(1) // Reset to step 1 for new shop
      fetchOnboardingStatus()
    }
  }, [selectedShop, authenticated, authIsLoading, fetchOnboardingStatus])

  // Case 4: Initial page mount
  useEffect(() => {
    if (!authIsLoading && authenticated) {
      console.log('OnboardingContext: Initial load, fetching onboarding status')
      fetchOnboardingStatus()
    } else if (!authIsLoading && !authenticated) {
      // User not authenticated, reset status
      setOnboardingStatus(initialStatus)
      setIsLoading(false)
    }
  }, [authIsLoading, authenticated, fetchOnboardingStatus])

  // All step calculation and navigation is now manual, controlled by the user.

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
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
