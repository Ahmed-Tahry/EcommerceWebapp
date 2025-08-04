"use client"

import type React from "react"

import { useState } from "react"
import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Label } from "@/components/ui/label"
import { Users, Plus, X, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TeamStep() {
  const { nextStep, prevStep, completeStep } = useOnboarding()
  const [email, setEmail] = useState("")
  const [invites, setInvites] = useState<string[]>([])

  const handleNext = () => {
    completeStep("team")
    nextStep()
  }

  const addInvite = () => {
    if (email && !invites.includes(email)) {
      setInvites([...invites, email])
      setEmail("")
    }
  }

  const removeInvite = (emailToRemove: string) => {
    setInvites(invites.filter((e) => e !== emailToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addInvite()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Invite Your Team
        </h1>
        <p className="text-lg text-gray-600">
          Collaboration is better with your team. Invite them to join your workspace.
        </p>
      </div>

      <ColorfulCard variant="orange">
        <ColorfulCardHeader>
          <ColorfulCardTitle>Team Invitations</ColorfulCardTitle>
        </ColorfulCardHeader>
        <ColorfulCardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex space-x-2">
                <CustomInput
                  id="email"
                  type="email"
                  variant="orange"
                  placeholder="Enter team member's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <CustomButton variant="orange" onClick={addInvite} disabled={!email}>
                  <Plus className="w-4 h-4" />
                </CustomButton>
              </div>
            </div>

            {invites.length > 0 && (
              <div className="space-y-3">
                <Label>Pending Invitations ({invites.length})</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {invites.map((inviteEmail, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <span className="text-sm font-medium">{inviteEmail}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Pending
                        </Badge>
                        <CustomButton variant="outline" size="sm" onClick={() => removeInvite(inviteEmail)}>
                          <X className="w-3 h-3" />
                        </CustomButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {invites.length > 0 && (
              <CustomButton variant="orange" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send {invites.length} Invitation{invites.length > 1 ? "s" : ""}
              </CustomButton>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Team Roles</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-medium text-blue-900">Admin</div>
                <div className="text-xs text-blue-700">Full access</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="font-medium text-green-900">Editor</div>
                <div className="text-xs text-green-700">Can edit content</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-900">Viewer</div>
                <div className="text-xs text-gray-700">Read-only access</div>
              </div>
            </div>
          </div>
        </ColorfulCardContent>
      </ColorfulCard>

      <div className="flex justify-between">
        <CustomButton variant="outline" onClick={prevStep}>
          Back
        </CustomButton>
        <div className="space-x-2">
          <CustomButton variant="outline" onClick={handleNext}>
            Skip for Now
          </CustomButton>
          <CustomButton variant="orange" onClick={handleNext}>
            Continue
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
