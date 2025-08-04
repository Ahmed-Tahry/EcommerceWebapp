"use client"

import { useState } from "react"
import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Bell, Mail } from "lucide-react"

export function PreferencesStep() {
  const { nextStep, prevStep, completeStep } = useOnboarding()
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    darkMode: false,
    weeklyReports: true,
    dataSharing: false,
  })

  const handleNext = () => {
    completeStep("preferences")
    nextStep()
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const preferenceGroups = [
    {
      title: "Notifications",
      icon: Bell,
      color: "green",
      items: [
        {
          key: "emailNotifications",
          label: "Email Notifications",
          description: "Receive important updates via email",
        },
        {
          key: "pushNotifications",
          label: "Push Notifications",
          description: "Get real-time notifications in your browser",
        },
        {
          key: "weeklyReports",
          label: "Weekly Reports",
          description: "Receive weekly performance summaries",
        },
      ],
    },
    {
      title: "Communication",
      icon: Mail,
      color: "purple",
      items: [
        {
          key: "marketingEmails",
          label: "Marketing Emails",
          description: "Receive updates about new features and offers",
        },
      ],
    },
    {
      title: "Appearance & Privacy",
      icon: Settings,
      color: "orange",
      items: [
        {
          key: "darkMode",
          label: "Dark Mode",
          description: "Use dark theme for better night viewing",
        },
        {
          key: "dataSharing",
          label: "Anonymous Analytics",
          description: "Help us improve by sharing anonymous usage data",
        },
      ],
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-4">
          <Settings className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Customize Your Experience
        </h1>
        <p className="text-lg text-gray-600">Set your preferences to make the dashboard work best for you</p>
      </div>

      <div className="space-y-6">
        {preferenceGroups.map((group, groupIndex) => (
          <ColorfulCard key={groupIndex} variant={group.color as any}>
            <ColorfulCardHeader>
              <div className="flex items-center space-x-3">
                <group.icon className={`w-6 h-6 text-${group.color}-600`} />
                <ColorfulCardTitle>{group.title}</ColorfulCardTitle>
              </div>
            </ColorfulCardHeader>
            <ColorfulCardContent className="space-y-4">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <Label htmlFor={item.key} className="text-sm font-medium">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <Switch
                    id={item.key}
                    checked={preferences[item.key as keyof typeof preferences]}
                    onCheckedChange={(checked) => handlePreferenceChange(item.key, checked)}
                  />
                </div>
              ))}
            </ColorfulCardContent>
          </ColorfulCard>
        ))}
      </div>

      <div className="flex justify-between">
        <CustomButton variant="outline" onClick={prevStep}>
          Back
        </CustomButton>
        <CustomButton variant="green" onClick={handleNext}>
          Continue
        </CustomButton>
      </div>
    </div>
  )
}
