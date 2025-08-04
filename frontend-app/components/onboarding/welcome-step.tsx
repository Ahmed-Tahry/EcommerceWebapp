"use client"

import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Sparkles, Rocket, Users, BarChart3 } from "lucide-react"

export function WelcomeStep() {
  const { nextStep, completeStep } = useOnboarding()

  const handleNext = () => {
    completeStep("welcome")
    nextStep()
  }

  const features = [
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your performance with detailed analytics",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team seamlessly",
      color: "text-green-600",
    },
    {
      icon: Rocket,
      title: "Fast Performance",
      description: "Lightning-fast loading and smooth interactions",
      color: "text-purple-600",
    },
    {
      icon: Sparkles,
      title: "Beautiful Design",
      description: "Modern and intuitive user interface",
      color: "text-pink-600",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Dashboard Pro!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get ready to supercharge your productivity with our powerful dashboard. Let's get you set up in just a few
          simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <ColorfulCard key={index} variant={index % 2 === 0 ? "purple" : "blue"}>
            <ColorfulCardHeader>
              <div className="flex items-center space-x-3">
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                <ColorfulCardTitle className="text-lg">{feature.title}</ColorfulCardTitle>
              </div>
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <p className="text-gray-600">{feature.description}</p>
            </ColorfulCardContent>
          </ColorfulCard>
        ))}
      </div>

      <div className="text-center">
        <CustomButton variant="purple" size="lg" onClick={handleNext}>
          Let's Get Started
          <Rocket className="ml-2 w-5 h-5" />
        </CustomButton>
      </div>
    </div>
  )
}
