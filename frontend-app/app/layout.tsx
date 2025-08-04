import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthProvider } from "@/contexts/AuthContext"
import { ShopProvider } from "@/contexts/ShopContext"
import { OnboardingProvider } from "@/contexts/onboarding-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "A comprehensive dashboard built with Next.js and Tailwind CSS",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ShopProvider>
            <OnboardingProvider>
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1">{children}</main>
              </SidebarProvider>
            </OnboardingProvider>
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
