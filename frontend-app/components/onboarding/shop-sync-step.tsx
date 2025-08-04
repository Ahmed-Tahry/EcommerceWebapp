"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { ColorfulCard, ColorfulCardContent } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function ShopSyncStep() {
  const { 
    onboardingStatus, 
    markStepAsComplete, 
    shopSyncInProgress,
    setShopSyncInProgress,
    isLoading,
    error 
  } = useOnboarding()

  const handleStartSync = async () => {
    setShopSyncInProgress(true)
    
    try {
      // Simulate shop sync process
      await new Promise(resolve => setTimeout(resolve, 3000))
      await markStepAsComplete("hasCompletedShopSync")
      // Remove automatic navigation - let the navigation buttons handle this
    } catch (err) {
      console.error("Failed to complete shop sync:", err)
    } finally {
      setShopSyncInProgress(false)
    }
  }

  if (onboardingStatus.hasCompletedShopSync) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Shop Sync Completed</h3>
        <p className="text-gray-600">Your products have been successfully synced.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Shop Sync</h2>
        <p className="text-gray-600">
          Sync your products and orders from your shop to get started.
        </p>
      </div>

      <ColorfulCard variant="blue">
        <ColorfulCardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <RefreshCw className={`w-12 h-12 mx-auto mb-4 ${shopSyncInProgress ? 'animate-spin' : ''} text-blue-600`} />
              <h3 className="text-lg font-semibold mb-2">Product Sync</h3>
              <p className="text-gray-600 text-sm">
                We'll sync your products, inventory, and orders from your shop.
              </p>
            </div>

            {shopSyncInProgress && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <span className="text-sm text-gray-600">Fetching products...</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <span className="text-sm text-gray-600">Processing inventory...</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <span className="text-sm text-gray-600">Finalizing sync...</span>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center">
              <CustomButton
                onClick={handleStartSync}
                disabled={shopSyncInProgress}
              >
                {shopSyncInProgress ? "Syncing..." : "Start Sync"}
              </CustomButton>
            </div>
          </div>
        </ColorfulCardContent>
      </ColorfulCard>
    </div>
  )
}
