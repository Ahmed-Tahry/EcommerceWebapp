"use client"

import { Header } from "@/components/dashboard/header"
import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { DataTable } from "@/components/dashboard/data-table"
import { ChartCard } from "@/components/dashboard/chart-card"
import { DollarSign, Users, CreditCard, Activity, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CustomButton } from "@/components/ui/custom-button"
import { OnboardingBanner } from "@/components/dashboard/onboarding-banner"
import ProtectedRoute from "@/components/ProtectedRoute"

const recentSales = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    status: "Completed",
    amount: "$250.00",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    status: "Processing",
    amount: "$150.00",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    status: "Shipped",
    amount: "$350.00",
    date: "2024-01-13",
  },
]

const salesColumns = [
  { key: "name", label: "Customer" },
  { key: "email", label: "Email" },
  { key: "amount", label: "Amount" },
]

const orderColumns = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => (
      <Badge variant={value === "Completed" ? "default" : value === "Processing" ? "secondary" : "outline"}>
        {value}
      </Badge>
    ),
  },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
]

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col">
        <Header
          title="Dashboard"
          description="Welcome to your dashboard overview"
          action={{ label: "Add New", onClick: () => console.log("Add new clicked") }}
        />

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Onboarding Banner */}
          <OnboardingBanner />

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ColorfulCard variant="green">
              <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ColorfulCardTitle className="text-sm font-medium">Total Revenue</ColorfulCardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </ColorfulCardHeader>
              <ColorfulCardContent>
                <div className="text-2xl font-bold text-green-700">$45,231.89</div>
                <p className="text-xs text-green-600">+20.1% from last month</p>
              </ColorfulCardContent>
            </ColorfulCard>

            <ColorfulCard variant="blue">
              <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ColorfulCardTitle className="text-sm font-medium">Subscriptions</ColorfulCardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </ColorfulCardHeader>
              <ColorfulCardContent>
                <div className="text-2xl font-bold text-blue-700">+2,350</div>
                <p className="text-xs text-blue-600">+180.1% from last month</p>
              </ColorfulCardContent>
            </ColorfulCard>

            <ColorfulCard variant="purple">
              <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ColorfulCardTitle className="text-sm font-medium">Sales</ColorfulCardTitle>
                <CreditCard className="h-4 w-4 text-purple-600" />
              </ColorfulCardHeader>
              <ColorfulCardContent>
                <div className="text-2xl font-bold text-purple-700">+12,234</div>
                <p className="text-xs text-purple-600">+19% from last month</p>
              </ColorfulCardContent>
            </ColorfulCard>

            <ColorfulCard variant="orange">
              <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ColorfulCardTitle className="text-sm font-medium">Active Now</ColorfulCardTitle>
                <Activity className="h-4 w-4 text-orange-600" />
              </ColorfulCardHeader>
              <ColorfulCardContent>
                <div className="text-2xl font-bold text-orange-700">+573</div>
                <p className="text-xs text-orange-600">+201 from last month</p>
              </ColorfulCardContent>
            </ColorfulCard>
          </div>

          {/* Charts and Tables */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <ChartCard title="Overview" description="Revenue overview for the last 6 months">
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Chart placeholder - integrate with your preferred charting library
                </div>
              </ChartCard>
            </div>
            <div className="col-span-3">
              <DataTable
                title="Recent Sales"
                description="You made 265 sales this month."
                columns={salesColumns}
                data={recentSales}
              />
            </div>
          </div>

          {/* Recent Orders */}
          <DataTable
            title="Recent Orders"
            description="A list of your recent orders."
            columns={orderColumns}
            data={recentOrders}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}
