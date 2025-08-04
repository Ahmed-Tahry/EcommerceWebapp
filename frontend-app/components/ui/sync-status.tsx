"use client"

import { useState } from "react"
import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { CustomButton } from "@/components/ui/custom-button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, AlertCircle, Clock, Zap, ShoppingBag, Wifi, WifiOff } from "lucide-react"

interface SyncStatusProps {
  shopName: string
  lastSyncTime?: string
  syncStatus: "connected" | "syncing" | "error" | "disconnected"
  onSync?: () => void
  syncStats?: {
    products: number
    orders: number
    customers: number
  }
}

export function SyncStatus({ shopName, lastSyncTime, syncStatus, onSync, syncStats }: SyncStatusProps) {
  const [isAutoSync, setIsAutoSync] = useState(true)

  const getStatusConfig = () => {
    switch (syncStatus) {
      case "connected":
        return {
          color: "green",
          icon: CheckCircle,
          text: "Connected",
          description: "Your shop is connected and synced",
        }
      case "syncing":
        return {
          color: "blue",
          icon: RefreshCw,
          text: "Syncing",
          description: "Syncing data from your shop",
        }
      case "error":
        return {
          color: "red",
          icon: AlertCircle,
          text: "Error",
          description: "Failed to sync with your shop",
        }
      case "disconnected":
        return {
          color: "gray",
          icon: WifiOff,
          text: "Disconnected",
          description: "Shop connection is offline",
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <ColorfulCard variant={statusConfig.color as any}>
      <ColorfulCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-${statusConfig.color}-100`}>
              <ShoppingBag className={`w-5 h-5 text-${statusConfig.color}-600`} />
            </div>
            <div>
              <ColorfulCardTitle className="text-lg">{shopName}</ColorfulCardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <StatusIcon
                  className={`w-4 h-4 text-${statusConfig.color}-600 ${syncStatus === "syncing" ? "animate-spin" : ""}`}
                />
                <Badge
                  className={`bg-${statusConfig.color}-100 text-${statusConfig.color}-800 border-${statusConfig.color}-200`}
                >
                  {statusConfig.text}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {syncStatus === "connected" && (
              <div className="flex items-center space-x-1">
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
            )}
          </div>
        </div>
      </ColorfulCardHeader>

      <ColorfulCardContent className="space-y-4">
        <p className={`text-sm text-${statusConfig.color}-700`}>{statusConfig.description}</p>

        {lastSyncTime && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last synced: {lastSyncTime}</span>
          </div>
        )}

        {syncStats && (
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{syncStats.products}</div>
              <div className="text-xs text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{syncStats.orders}</div>
              <div className="text-xs text-gray-600">Orders</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{syncStats.customers}</div>
              <div className="text-xs text-gray-600">Customers</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Auto-sync</span>
            <Badge variant={isAutoSync ? "default" : "secondary"}>{isAutoSync ? "On" : "Off"}</Badge>
          </div>

          <div className="flex space-x-2">
            {syncStatus === "error" && (
              <CustomButton variant="orange" size="sm" onClick={onSync}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </CustomButton>
            )}
            {syncStatus === "connected" && (
              <CustomButton variant="blue" size="sm" onClick={onSync}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Sync Now
              </CustomButton>
            )}
            {syncStatus === "disconnected" && (
              <CustomButton variant="green" size="sm" onClick={onSync}>
                <Wifi className="w-4 h-4 mr-1" />
                Connect
              </CustomButton>
            )}
          </div>
        </div>
      </ColorfulCardContent>
    </ColorfulCard>
  )
}
