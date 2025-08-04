"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { ShopSyncLoader } from "@/components/ui/shop-sync-loader"
import { SyncStatus } from "@/components/ui/sync-status"
import { CustomButton } from "@/components/ui/custom-button"
import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { ShoppingBag, Plus, Settings } from "lucide-react"

export default function ShopSyncPage() {
  const [showFullscreenLoader, setShowFullscreenLoader] = useState(false)
  const [showDefaultLoader, setShowDefaultLoader] = useState(false)
  const [showCompactLoader, setShowCompactLoader] = useState(false)

  const handleStartSync = (variant: "fullscreen" | "default" | "compact") => {
    switch (variant) {
      case "fullscreen":
        setShowFullscreenLoader(true)
        break
      case "default":
        setShowDefaultLoader(true)
        break
      case "compact":
        setShowCompactLoader(true)
        break
    }
  }

  const handleSyncComplete = (variant: "fullscreen" | "default" | "compact") => {
    switch (variant) {
      case "fullscreen":
        setShowFullscreenLoader(false)
        break
      case "default":
        setShowDefaultLoader(false)
        break
      case "compact":
        setShowCompactLoader(false)
        break
    }
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Shop Sync"
        description="Manage your shop integrations and sync status"
        action={{
          label: "Add Shop",
          onClick: () => console.log("Add shop clicked"),
        }}
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Connected Shops */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SyncStatus
            shopName="Shopify Store"
            lastSyncTime="2 minutes ago"
            syncStatus="connected"
            onSync={() => handleStartSync("fullscreen")}
            syncStats={{
              products: 1234,
              orders: 567,
              customers: 890,
            }}
          />

          <SyncStatus
            shopName="WooCommerce"
            lastSyncTime="5 minutes ago"
            syncStatus="syncing"
            syncStats={{
              products: 456,
              orders: 123,
              customers: 234,
            }}
          />

          <SyncStatus
            shopName="Amazon Store"
            lastSyncTime="1 hour ago"
            syncStatus="error"
            onSync={() => handleStartSync("default")}
            syncStats={{
              products: 789,
              orders: 345,
              customers: 456,
            }}
          />
        </div>

        {/* Loader Demos */}
        <ColorfulCard variant="purple">
          <ColorfulCardHeader>
            <ColorfulCardTitle>Sync Loader Demos</ColorfulCardTitle>
          </ColorfulCardHeader>
          <ColorfulCardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <CustomButton variant="purple" onClick={() => handleStartSync("fullscreen")} className="w-full">
                <ShoppingBag className="mr-2 w-4 h-4" />
                Fullscreen Sync
              </CustomButton>

              <CustomButton variant="blue" onClick={() => handleStartSync("default")} className="w-full">
                <ShoppingBag className="mr-2 w-4 h-4" />
                Default Sync
              </CustomButton>

              <CustomButton variant="green" onClick={() => handleStartSync("compact")} className="w-full">
                <ShoppingBag className="mr-2 w-4 h-4" />
                Compact Sync
              </CustomButton>
            </div>

            {/* Compact Loader Display */}
            {showCompactLoader && (
              <div className="mt-4">
                <ShopSyncLoader
                  isVisible={showCompactLoader}
                  variant="compact"
                  shopName="Demo Shop"
                  onComplete={() => handleSyncComplete("compact")}
                />
              </div>
            )}

            {/* Default Loader Display */}
            {showDefaultLoader && (
              <div className="mt-4 flex justify-center">
                <ShopSyncLoader
                  isVisible={showDefaultLoader}
                  variant="default"
                  shopName="Demo Shop"
                  onComplete={() => handleSyncComplete("default")}
                />
              </div>
            )}
          </ColorfulCardContent>
        </ColorfulCard>

        {/* Integration Options */}
        <ColorfulCard variant="cyan">
          <ColorfulCardHeader>
            <ColorfulCardTitle>Available Integrations</ColorfulCardTitle>
          </ColorfulCardHeader>
          <ColorfulCardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Shopify", color: "green", connected: true },
                { name: "WooCommerce", color: "blue", connected: true },
                { name: "Amazon", color: "orange", connected: false },
                { name: "eBay", color: "purple", connected: false },
                { name: "Etsy", color: "pink", connected: false },
                { name: "BigCommerce", color: "cyan", connected: false },
              ].map((shop, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    shop.connected
                      ? `border-${shop.color}-200 bg-${shop.color}-50`
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${shop.connected ? `text-${shop.color}-900` : "text-gray-700"}`}>
                        {shop.name}
                      </h4>
                      <p className={`text-sm ${shop.connected ? `text-${shop.color}-600` : "text-gray-500"}`}>
                        {shop.connected ? "Connected" : "Available"}
                      </p>
                    </div>
                    {shop.connected ? (
                      <CustomButton variant={shop.color as any} size="sm">
                        <Settings className="w-3 h-3" />
                      </CustomButton>
                    ) : (
                      <CustomButton variant="outline" size="sm">
                        <Plus className="w-3 h-3" />
                      </CustomButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ColorfulCardContent>
        </ColorfulCard>
      </div>

      {/* Fullscreen Loader */}
      <ShopSyncLoader
        isVisible={showFullscreenLoader}
        variant="fullscreen"
        shopName="Demo Shop"
        onComplete={() => handleSyncComplete("fullscreen")}
      />
    </div>
  )
}
