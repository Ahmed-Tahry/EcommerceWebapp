"use client"

import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { CheckCircle, Rocket, BarChart3, Users, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function CompleteStep() {
  const { completeOnboarding } = useOnboarding()
  const router = useRouter()

  const handleComplete = () => {
    completeOnboarding()
    router.push("/")
  }

  const nextSteps = [
    {
      icon: BarChart3,
      title: "Explore Analytics",
      description: "Check out your dashboard analytics",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Manage Users",
      description: "Add and manage your team members",
      color: "text-green-600",
    },
    {
      icon: Settings,
      title: "Customize Settings",
      description: "Fine-tune your preferences",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          You're All Set! 🎉
        </h1>
        <p className="text-xl text-gray-600">
          Congratulations! Your dashboard is ready to use. Here's what you can do next:
        </p>
      </div>

      <ColorfulCard variant="green">
        <ColorfulCardHeader>
          <ColorfulCardTitle>What's Next?</ColorfulCardTitle>
        </ColorfulCardHeader>
        <ColorfulCardContent>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-green-50/50 rounded-lg border border-green-200"
              >
                <step.icon className={`w-6 h-6 ${step.color} mt-0.5`} />
                <div>
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ColorfulCardContent>
      </ColorfulCard>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
          <p className="text-gray-600">
            Check out our documentation or contact our support team if you have any questions.
          </p>
          <div className="flex justify-center space-x-3">
            <CustomButton variant="purple" size="sm">
              View Docs
            </CustomButton>
            <CustomButton variant="pink" size="sm">
              Contact Support
            </CustomButton>
          </div>
        </div>
      </div>

      <div className="text-center">
        <CustomButton variant="green" size="lg" onClick={handleComplete}>
          <Rocket className="mr-2 w-5 h-5" />
          Go to Dashboard
        </CustomButton>
      </div>
    </div>
  )
}
