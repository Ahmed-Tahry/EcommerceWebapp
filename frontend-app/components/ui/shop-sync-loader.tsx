"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ColorfulCard, ColorfulCardContent } from "@/components/ui/colorful-card"
import {
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  Truck,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

interface SyncStep {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  status: "pending" | "syncing" | "completed" | "error"
  progress?: number
}

interface ShopSyncLoaderProps {
  isVisible: boolean
  variant?: "default" | "compact" | "fullscreen"
  syncSteps?: SyncStep[]
  onComplete?: () => void
  shopName?: string
}

const defaultSyncSteps: SyncStep[] = [
  {
    id: "products",
    label: "Syncing Products",
    icon: Package,
    status: "pending",
  },
  {
    id: "orders",
    label: "Syncing Orders",
    icon: ShoppingCart,
    status: "pending",
  },
  {
    id: "customers",
    label: "Syncing Customers",
    icon: Users,
    status: "pending",
  },
  {
    id: "payments",
    label: "Syncing Payments",
    icon: CreditCard,
    status: "pending",
  },
  {
    id: "inventory",
    label: "Updating Inventory",
    icon: Truck,
    status: "pending",
  },
  {
    id: "analytics",
    label: "Generating Reports",
    icon: BarChart3,
    status: "pending",
  },
]

export function ShopSyncLoader({
  isVisible,
  variant = "default",
  syncSteps = defaultSyncSteps,
  onComplete,
  shopName = "Your Shop",
}: ShopSyncLoaderProps) {
  const [steps, setSteps] = useState<SyncStep[]>(syncSteps)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps]
        const currentStep = newSteps[currentStepIndex]

        if (currentStep && currentStep.status === "pending") {
          currentStep.status = "syncing"
          currentStep.progress = 0
        } else if (currentStep && currentStep.status === "syncing") {
          currentStep.progress = (currentStep.progress || 0) + Math.random() * 20

          if (currentStep.progress >= 100) {
            currentStep.status = "completed"
            currentStep.progress = 100

            if (currentStepIndex < newSteps.length - 1) {
              setCurrentStepIndex((prev) => prev + 1)
            } else {
              // All steps completed
              setTimeout(() => {
                onComplete?.()
              }, 1000)
            }
          }
        }

        // Calculate overall progress
        const completedSteps = newSteps.filter((step) => step.status === "completed").length
        const currentProgress = newSteps[currentStepIndex]?.progress || 0
        const totalProgress = (completedSteps * 100 + currentProgress) / newSteps.length
        setOverallProgress(totalProgress)

        return newSteps
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isVisible, currentStepIndex, onComplete])

  if (!isVisible) return null

  const getStepStatusIcon = (step: SyncStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "syncing":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStepColor = (step: SyncStep, index: number) => {
    const colors = ["purple", "blue", "green", "orange", "pink", "cyan"]
    return colors[index % colors.length]
  }

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <ColorfulCard variant="purple" className="overflow-hidden">
            <ColorfulCardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-white animate-spin" />
                  </div>
                  <div className="absolute -inset-2 rounded-full border-4 border-purple-200 animate-pulse" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Syncing {shopName}</h2>
                  <p className="text-gray-600">Please wait while we sync your shop data...</p>
                </div>

                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-medium">{Math.round(overallProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>

                {/* Sync Steps */}
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-all duration-300",
                        step.status === "syncing"
                          ? "bg-blue-50 border border-blue-200"
                          : step.status === "completed"
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <step.icon
                          className={cn(
                            "w-5 h-5",
                            step.status === "syncing"
                              ? "text-blue-600"
                              : step.status === "completed"
                                ? "text-green-600"
                                : "text-gray-400",
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium",
                            step.status === "syncing"
                              ? "text-blue-900"
                              : step.status === "completed"
                                ? "text-green-900"
                                : "text-gray-600",
                          )}
                        >
                          {step.label}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {step.status === "syncing" && step.progress !== undefined && (
                          <span className="text-sm text-blue-600 font-medium">{Math.round(step.progress)}%</span>
                        )}
                        {getStepStatusIcon(step)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ColorfulCardContent>
          </ColorfulCard>
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <ColorfulCard variant="blue" className="w-full max-w-md">
        <ColorfulCardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <div className="absolute -inset-1 rounded-full border-2 border-blue-200 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Syncing {shopName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <span className="text-sm text-blue-600 font-medium">{Math.round(overallProgress)}%</span>
              </div>
            </div>
          </div>
        </ColorfulCardContent>
      </ColorfulCard>
    )
  }

  // Default variant
  return (
    <ColorfulCard variant="purple" className="w-full max-w-lg">
      <ColorfulCardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
            <div className="absolute -inset-2 rounded-full border-4 border-purple-200 animate-pulse" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-1">Syncing {shopName}</h3>
            <p className="text-sm text-purple-700">{steps[currentStepIndex]?.label || "Preparing sync..."}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-700">Progress</span>
              <span className="font-medium text-purple-900">{Math.round(overallProgress)}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </ColorfulCardContent>
    </ColorfulCard>
  )
}
