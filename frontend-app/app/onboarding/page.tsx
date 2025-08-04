"use client"

import { useMemo } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ProgressBar } from "@/components/ui/progress-bar"
import { BolApiStep } from "../../components/onboarding/bol-api-step"
import { ShopSyncStep } from "../../components/onboarding/shop-sync-step"
import { InvoiceSetupStep } from "../../components/onboarding/invoice-setup-step"
import { CustomButton } from "@/components/ui/custom-button"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

// Define steps for the ProgressBar
const steps = [
  { id: 1, title: "Connect Bol.com", description: "Link your Bol.com account" },
  { id: 2, title: "Shop Sync", description: "Synchronize your shop data" },
  { id: 3, title: "Invoice Setup", description: "Set up invoice details" },
  { id: 4, title: "Complete", description: "All done!" },
]

// Memoized component to render the appropriate form based on current step
const OnboardingStepContent = ({ currentStep }: { currentStep: number }) => {
  const { onboardingStatus } = useOnboarding()

  // Memoize the step content to prevent unnecessary re-renders
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <BolApiStep />
      case 2:
        return <ShopSyncStep />
      case 3:
        return <InvoiceSetupStep />
      case 4:
        return (
          <div className="text-center py-12">
            <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-500" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Onboarding Complete!</h3>
            <p className="text-gray-600 text-lg">
              Congratulations! You have completed all the onboarding steps. Your account is fully configured.
            </p>
          </div>
        )
      default:
        return <BolApiStep />
    }
  }, [currentStep, onboardingStatus])

  return stepContent
}

function OnboardingContent() {
  const { 
    currentStep, 
    onboardingStatus, 
    isLoading, 
    error, 
    goToNextStep, 
    goToPreviousStep,
    selectedShop 
  } = useOnboarding()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading onboarding status...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center py-10 text-red-600">
          <div className="text-lg font-semibold">Error loading onboarding data:</div>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // Helper function to determine if a step is complete
  const isStepComplete = (stepId: number) => {
    switch (stepId) {
      case 1:
        return onboardingStatus.hasConfiguredBolApi
      case 2:
        return onboardingStatus.hasCompletedShopSync
      case 3:
        return onboardingStatus.hasCompletedInvoiceSetup
      case 4:
        return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && onboardingStatus.hasCompletedInvoiceSetup
      default:
        return false
    }
  }

  // Helper function to determine if a step can be accessed
  const canGoToStep = (stepId: number) => {
    // If no shop is selected, only step 1 is accessible
    if (!selectedShop && stepId !== 1) return false
    
    // Can always go to current step or previous steps
    if (stepId <= currentStep) return true
    
    // Can go to next step if current step is complete
    if (stepId === currentStep + 1) {
      return isStepComplete(currentStep)
    }
    
    // For step 2, need step 1 complete
    if (stepId === 2) return onboardingStatus.hasConfiguredBolApi
    
    // For step 3, need steps 1 and 2 complete
    if (stepId === 3) return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync
    
    // For step 4, need all previous steps complete
    if (stepId === 4) return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && onboardingStatus.hasCompletedInvoiceSetup
    
    return false
  }

  // Check if next button should be enabled
  const isNextEnabled = isStepComplete(currentStep) && currentStep < steps.length
  console.log('OnboardingPage: currentStep:', currentStep, 'isStepComplete(currentStep):', isStepComplete(currentStep), 'isNextEnabled:', isNextEnabled)
  console.log('OnboardingPage: onboardingStatus:', onboardingStatus)
  
  // Check if previous button should be enabled
  const isPreviousEnabled = currentStep > 1

  const progressSteps = steps.map(step => ({
    id: step.title,
    title: step.title,
    completed: step.id < currentStep // Show completion for steps behind current step
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Setup Progress</h2>
            <p className="text-gray-600">
              Step {currentStep} of {steps.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <ProgressBar steps={progressSteps} currentStep={currentStep} variant="colorful" />
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <OnboardingStepContent currentStep={currentStep} />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <CustomButton
              onClick={() => {
                console.log('Previous button clicked, currentStep:', currentStep, 'isPreviousEnabled:', isPreviousEnabled)
                if (isPreviousEnabled) {
                  goToPreviousStep()
                }
              }}
              disabled={!isPreviousEnabled}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </CustomButton>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index + 1 <= currentStep ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <CustomButton
              onClick={() => {
                console.log('Next button clicked, currentStep:', currentStep, 'isNextEnabled:', isNextEnabled)
                if (isNextEnabled) {
                  goToNextStep()
                }
              }}
              disabled={!isNextEnabled}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return <OnboardingContent />
}
