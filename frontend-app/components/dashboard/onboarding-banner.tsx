"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { ColorfulCard, ColorfulCardContent } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { X, Rocket, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"

export function OnboardingBanner() {
  const { onboardingStatus, isLoading, error } = useOnboarding()
  
  // Don't show if all steps are complete
  const allStepsComplete = 
    onboardingStatus.hasConfiguredBolApi &&
    onboardingStatus.hasCompletedShopSync &&
    onboardingStatus.hasCompletedInvoiceSetup

  if (allStepsComplete || isLoading) return null

  const completedStepsCount = [
    onboardingStatus.hasConfiguredBolApi,
    onboardingStatus.hasCompletedShopSync,
    onboardingStatus.hasCompletedInvoiceSetup
  ].filter(Boolean).length

  const totalSteps = 3
  const progress = (completedStepsCount / totalSteps) * 100

  return (
    <ColorfulCard variant="purple" className="mb-6">
      <ColorfulCardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 text-white">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">Complete Your Setup</h3>
              <p className="text-sm text-purple-700">
                {completedStepsCount === 0 
                  ? "Get started with 3 simple steps to set up your shop"
                  : `${completedStepsCount} of ${totalSteps} steps completed`
                }
              </p>
              <div className="mt-2 flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {onboardingStatus.hasConfiguredBolApi ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-xs text-purple-600">Bol API</span>
                </div>
                <div className="flex items-center space-x-1">
                  {onboardingStatus.hasCompletedShopSync ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-xs text-purple-600">Shop Sync</span>
                </div>
                <div className="flex items-center space-x-1">
                  {onboardingStatus.hasCompletedInvoiceSetup ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-xs text-purple-600">Invoice Setup</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/onboarding">
              <CustomButton variant="purple" size="sm">
                {completedStepsCount === 0 ? "Start Setup" : "Continue"}
              </CustomButton>
            </Link>
          </div>
        </div>
      </ColorfulCardContent>
    </ColorfulCard>
  )
}
