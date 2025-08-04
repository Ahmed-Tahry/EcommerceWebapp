"use client"

import { useState } from "react"
import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User } from "lucide-react"

export function ProfileStep() {
  const { nextStep, prevStep, completeStep } = useOnboarding()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    bio: "",
  })

  const handleNext = () => {
    completeStep("profile")
    nextStep()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white mb-4">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Set Up Your Profile
        </h1>
        <p className="text-lg text-gray-600">Tell us a bit about yourself to personalize your experience</p>
      </div>

      <ColorfulCard variant="blue">
        <ColorfulCardHeader>
          <ColorfulCardTitle>Profile Information</ColorfulCardTitle>
        </ColorfulCardHeader>
        <ColorfulCardContent className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                {formData.firstName[0]}
                {formData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <CustomButton variant="blue" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </CustomButton>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <CustomInput
                id="firstName"
                variant="blue"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <CustomInput
                id="lastName"
                variant="blue"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <CustomInput
              id="email"
              type="email"
              variant="blue"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <CustomInput
                id="company"
                variant="blue"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <CustomInput
                id="role"
                variant="blue"
                placeholder="Enter your role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              className="border-blue-200 focus-visible:ring-blue-500"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
            />
          </div>
        </ColorfulCardContent>
      </ColorfulCard>

      <div className="flex justify-between">
        <CustomButton variant="outline" onClick={prevStep}>
          Back
        </CustomButton>
        <CustomButton variant="blue" onClick={handleNext}>
          Continue
        </CustomButton>
      </div>
    </div>
  )
}
