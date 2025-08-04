"use client"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

interface ProgressBarProps {
  steps: Array<{
    id: string
    title: string
    completed: boolean
  }>
  currentStep: number
  variant?: "default" | "colorful"
}

export function ProgressBar({ steps, currentStep, variant = "colorful" }: ProgressBarProps) {
  const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-pink-500"]

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Container with borders */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        {/* Progress Line */}
        <div className="relative">
          {/* Background line - only spans between step indicators */}
          <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200">
            <div
              className={cn(
                "h-full transition-all duration-500 ease-in-out",
                variant === "colorful" ? "bg-gradient-to-r from-purple-500 via-blue-500 to-green-500" : "bg-primary",
              )}
              style={{
                width: `${Math.min((currentStep - 1) / (steps.length - 1) * 100, 100)}%`,
              }}
            />
          </div>

          {/* Step Indicators */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = step.completed || index < currentStep
              const isCurrent = index === currentStep
              const colorClass = variant === "colorful" ? colors[index % colors.length] : "bg-primary"

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isCompleted
                        ? cn(colorClass, "border-transparent text-white shadow-lg")
                        : isCurrent
                          ? cn(
                              "border-2",
                              variant === "colorful" ? "border-purple-500 bg-purple-50" : "border-primary bg-primary/10",
                            )
                          : "border-gray-300 bg-white",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isCurrent ? (variant === "colorful" ? "text-purple-600" : "text-primary") : "text-gray-400",
                        )}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={cn("text-sm font-medium", isCompleted || isCurrent ? "text-gray-900" : "text-gray-400")}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
