"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { CustomButton } from "@/components/ui/custom-button"
import { RefreshCw, CheckCircle, AlertCircle, Wifi } from "lucide-react"

interface SyncIndicatorProps {
  shopName: string
  status: "synced" | "syncing" | "error" | "offline"
  lastSync?: string
  onSync?: () => void
  compact?: boolean
}

export function SyncIndicator({ shopName, status, lastSync, onSync, compact = false }: SyncIndicatorProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (status === "syncing") {
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
    }
  }, [status])

  const getStatusConfig = () => {
    switch (status) {
      case "synced":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-200",
          text: "Synced",
        }
      case "syncing":
        return {
          icon: RefreshCw,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-200",
          text: "Syncing",
        }
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-200",
          text: "Error",
        }
      case "offline":
        return {
          icon: Wifi,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
          text: "Offline",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 ${config.color} ${isAnimating ? "animate-spin" : ""}`} />
        <Badge className={`${config.bgColor} ${config.color} ${config.borderColor}`}>{config.text}</Badge>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 ${config.color} ${isAnimating ? "animate-spin" : ""}`} />
        <div>
          <div className="font-medium text-gray-900">{shopName}</div>
          {lastSync && <div className="text-sm text-gray-600">Last sync: {lastSync}</div>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Badge className={`${config.bgColor} ${config.color} ${config.borderColor}`}>{config.text}</Badge>
        {onSync && status !== "syncing" && (
          <CustomButton variant="outline" size="sm" onClick={onSync}>
            <RefreshCw className="w-3 h-3" />
          </CustomButton>
        )}
      </div>
    </div>
  )
}
