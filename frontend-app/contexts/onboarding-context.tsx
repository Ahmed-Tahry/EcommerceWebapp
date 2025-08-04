"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
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
  completeOnboarding: () => Promise<void>
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
  const { selectedShop, fetchShops } = useShop()
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

  // Helper function to determine the appropriate step based on completion status
  const determineCurrentStep = useCallback((status: OnboardingStatus) => {
    // If all steps are complete, go to completion step (step 4)
    if (status.hasConfiguredBolApi && status.hasCompletedShopSync && status.hasCompletedInvoiceSetup) {
      console.log('OnboardingContext: All steps complete, navigating to step 4')
      return 4
    }
    // If Bol API and Shop Sync are complete, go to Invoice Setup (step 3)
    if (status.hasConfiguredBolApi && status.hasCompletedShopSync) {
      console.log('OnboardingContext: Bol API and Shop Sync complete, navigating to step 3')
      return 3
    }
    // If only Bol API is complete, go to Shop Sync (step 2)
    if (status.hasConfiguredBolApi) {
      console.log('OnboardingContext: Bol API complete, navigating to step 2')
      return 2
    }
    // Otherwise, start at step 1
    console.log('OnboardingContext: Starting at step 1')
    return 1
  }, [])

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
        
        // Automatically navigate to the appropriate step based on completion status
        const appropriateStep = determineCurrentStep(data)
        setCurrentStepWithLog(appropriateStep)
      } else {
        // Case 2: No shop selected (new user) - fetch user-level onboarding status
        console.log('OnboardingContext: No shop selected, fetching user-level onboarding status')
        const data = await callApi('/settings/settings/onboarding/user-status', 'GET')
        console.log('OnboardingContext: Fetched user-level status:', data)
        setOnboardingStatus(data)
        
        // Automatically navigate to the appropriate step based on completion status
        const appropriateStep = determineCurrentStep(data)
        setCurrentStepWithLog(appropriateStep)
      }
    } catch (err) {
      console.error('OnboardingContext: Failed to fetch onboarding status:', err)
      const errorMessage = (err && (err as Error).message) ? (err as Error).message : String(err)
      setError(errorMessage || 'Failed to load onboarding status.')
    } finally {
      setIsLoading(false)
    }
  }, [authenticated, token, selectedShop, determineCurrentStep])

  // Case 3: Handle step completion responses
  const updateOnboardingStep = useCallback(async (stepPayload: Partial<OnboardingStatus>) => {
    if (!authenticated) {
      setError("User not authenticated. Cannot update onboarding step.")
      return Promise.reject(new Error("User not authenticated"))
    }

    // For Bol API step, allow completion without shop selection (it creates the shop)
    const isBolApiStep = stepPayload.hasConfiguredBolApi === true
    if (!selectedShop && !isBolApiStep) {
      setError("No shop selected. Cannot update onboarding step.")
      return Promise.reject(new Error("No shop selected"))
    }

    setIsLoading(true)
    setError(null)

    try {
      let updatedStatus
      
      if (selectedShop) {
        // Case 1: Shop is selected - use shop-specific endpoint
        console.log('OnboardingContext: Updating onboarding step for shop:', selectedShop.shopId, 'with payload:', stepPayload)
        updatedStatus = await callApi('/settings/settings/onboarding/status', 'POST', stepPayload, {}, selectedShop)
      } else {
        // Case 2: No shop selected (Bol API step for new user) - use user-level endpoint
        console.log('OnboardingContext: Updating user-level onboarding step with payload:', stepPayload)
        updatedStatus = await callApi('/settings/settings/onboarding/user-status', 'POST', stepPayload)
      }
      
      console.log('OnboardingContext: Step completion response:', updatedStatus)
      
      // Update context with the response from backend
      setOnboardingStatus(prevStatus => ({
        ...prevStatus,
        ...updatedStatus
      }))

      // If Bol API step was completed, refresh shops to get the newly created shop
      if (stepPayload.hasConfiguredBolApi === true) {
        console.log('OnboardingContext: Bol API step completed, refreshing shops to get newly created shop')
        try {
          await fetchShops()
          console.log('OnboardingContext: Successfully refreshed shops after Bol API completion')
        } catch (refreshError) {
          console.error('OnboardingContext: Failed to refresh shops after Bol API completion:', refreshError)
          // Don't throw error here as the main step completion was successful
        }
      }

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

    // For Bol API step, allow completion without shop selection (it creates the shop)
    const isBolApiStep = stepName === 'hasConfiguredBolApi'
    if (!selectedShop && !isBolApiStep) {
      setError("No shop selected. Cannot mark step as complete.")
      return Promise.reject(new Error("No shop selected"))
    }

    return await updateOnboardingStep({ [stepName]: true })
  }, [updateOnboardingStep, authenticated, selectedShop])

  // Complete onboarding function
  const completeOnboarding = useCallback(async () => {
    if (!authenticated || !selectedShop) {
      console.log('OnboardingContext: Cannot complete onboarding - not authenticated or no shop selected')
      return
    }

    try {
      // Mark all steps as complete
      await updateOnboardingStep({
        hasConfiguredBolApi: true,
        hasCompletedShopSync: true,
        hasCompletedInvoiceSetup: true
      })
      console.log('OnboardingContext: Onboarding completed successfully')
    } catch (error) {
      console.error('OnboardingContext: Error completing onboarding:', error)
      throw error
    }
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
      // Let fetchOnboardingStatus determine the appropriate step automatically
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
    completeOnboarding,
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
