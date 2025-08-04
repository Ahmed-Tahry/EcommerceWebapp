"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ColorfulCard, ColorfulCardContent } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { callApi } from "@/lib/api"
import { useShop } from "@/contexts/ShopContext"

export function InvoiceSetupStep() {
  const { onboardingStatus, markStepAsComplete, isLoading, error } = useOnboarding()
  const { selectedShop } = useShop()
  const [vatNumber, setVatNumber] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedShop) {
      console.error("No shop selected for invoice setup")
      return
    }
    
    if (!vatNumber.trim() || !companyName.trim()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Call backend API to save invoice settings
      console.log('InvoiceSetupStep: Saving invoice settings for shop:', selectedShop.shopId)
      const invoiceSettings = {
        vatNumber: vatNumber.trim(),
        companyName: companyName.trim(),
        invoicePrefix: 'INV',
        invoiceNumberStart: 1
      }
      
      const response = await callApi('/settings/settings/invoice', 'POST', invoiceSettings, {}, selectedShop)
      console.log('InvoiceSetupStep: Successfully saved invoice settings:', response)
      setSuccess(true)
      
      // Mark step as complete after successful API call
      await markStepAsComplete("hasCompletedInvoiceSetup")
      console.log('InvoiceSetupStep: Invoice setup completed successfully')
    } catch (err) {
      console.error("Failed to complete invoice setup:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (onboardingStatus.hasCompletedInvoiceSetup) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Invoice Setup Complete</h3>
        <p className="text-gray-600">Your invoice settings have been successfully configured.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Invoice Setup</h2>
        <p className="text-gray-600">
          Configure your invoice settings to start generating invoices for your orders.
        </p>
      </div>

      <ColorfulCard variant="green">
        <ColorfulCardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="vatNumber">VAT Number</Label>
              <Input
                id="vatNumber"
                type="text"
                placeholder="Enter your VAT number"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
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
                  Invoice setup completed successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center">
              <CustomButton
                type="submit"
                disabled={isSubmitting || !companyName || !vatNumber}
              >
                {isSubmitting ? "Saving..." : "Complete Setup"}
              </CustomButton>
            </div>
          </form>
        </ColorfulCardContent>
      </ColorfulCard>
    </div>
  )
}
