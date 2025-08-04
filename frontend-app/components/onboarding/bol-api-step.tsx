"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ColorfulCard, ColorfulCardContent } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

export function BolApiStep() {
  const { onboardingStatus, markStepAsComplete, isLoading, error } = useOnboarding()
  const [apiKey, setApiKey] = useState("")
  const [secret, setSecret] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await markStepAsComplete("hasConfiguredBolApi")
      setSuccess(true)
      // Remove automatic navigation - let the navigation buttons handle this
    } catch (err) {
      console.error("Failed to configure Bol API:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (onboardingStatus.hasConfiguredBolApi) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Bol API Configured</h3>
        <p className="text-gray-600">Your Bol API has been successfully configured.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Configure Bol API</h2>
        <p className="text-gray-600">
          Connect your Bol.com account to start syncing your products and orders.
        </p>
      </div>

      <ColorfulCard variant="purple">
        <ColorfulCardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="text"
                placeholder="Enter your Bol API key"
                value={apiKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="secret">API Secret</Label>
              <Input
                id="secret"
                type="password"
                placeholder="Enter your Bol API secret"
                value={secret}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecret(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  API configuration saved successfully!
                </AlertDescription>
              </Alert>
            )}

            <CustomButton
              type="submit"
              className="w-full"
              disabled={isSubmitting || !apiKey || !secret}
            >
              {isSubmitting ? "Configuring..." : "Configure Bol API"}
            </CustomButton>
          </form>
        </ColorfulCardContent>
      </ColorfulCard>
    </div>
  )
}
