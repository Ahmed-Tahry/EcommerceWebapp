'use client';

import React, { useState } from 'react';
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings as SettingsIcon, Shield, Link, Package, FileText, AlertCircle } from "lucide-react"
import { useShop } from "@/contexts/ShopContext"
import { GeneralSettings } from "@/components/settings/general-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { CouplingBolSettings } from "@/components/settings/coupling-bol-settings"
import { ProductsVatSettings } from "@/components/settings/products-vat-settings"
import { InvoiceSettings } from "@/components/settings/invoice-settings"

const SETTINGS_TABS = [
  {
    key: 'general',
    label: 'General',
    icon: SettingsIcon,
    description: 'Personal information and company details'
  },
  {
    key: 'security',
    label: 'Security',
    icon: Shield,
    description: 'Password and security settings'
  },
  {
    key: 'coupling-bol',
    label: 'Coupling Bol',
    icon: Link,
    description: 'Bol.com API credentials'
  },
  {
    key: 'products-vat',
    label: 'Products & VAT',
    icon: Package,
    description: 'Product management and VAT rates'
  },
  {
    key: 'invoice',
    label: 'Invoice Settings',
    icon: FileText,
    description: 'Invoice configuration'
  }
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const { selectedShop, shops } = useShop();

  // Show shop selection message if no shop is selected
  if (!selectedShop) {
    return (
      <div className="flex flex-col">
        <Header title="Settings" description="Manage your account settings and preferences" />
        
        <div className="flex-1 p-4 md:p-8 pt-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>No Shop Selected</CardTitle>
              <CardDescription>
                Please select a shop from the sidebar to manage your settings.
                {shops.length === 0 && " You need to complete the onboarding process first to create a shop."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {shops.length === 0 ? (
                <Button asChild>
                  <a href="/onboarding">Complete Onboarding</a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Use the shop dropdown in the sidebar to select a shop.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header 
        title="Settings" 
        description={`Manage settings for ${selectedShop.name}`} 
      />

      <div className="flex-1 p-4 md:p-8 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.key} value={tab.key} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and company details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GeneralSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SecuritySettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="coupling-bol" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Bol.com Integration
                  </CardTitle>
                  <CardDescription>
                    Configure your Bol.com API credentials for this shop
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CouplingBolSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products-vat" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Products & VAT Management
                  </CardTitle>
                  <CardDescription>
                    Manage your products and configure VAT rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductsVatSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoice" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Invoice Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure how your invoices are generated and numbered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InvoiceSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
