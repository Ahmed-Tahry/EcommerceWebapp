import { Header } from "@/components/dashboard/header"
import { DataTable } from "@/components/dashboard/data-table"
import { CustomButton } from "@/components/ui/custom-button"
import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { ShoppingCart, Package, Truck, CheckCircle, Clock, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    status: "Delivered",
    amount: "$250.00",
    date: "2024-01-15",
    items: 3,
    priority: "High",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    status: "Processing",
    amount: "$150.00",
    date: "2024-01-14",
    items: 2,
    priority: "Medium",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    status: "Shipped",
    amount: "$350.00",
    date: "2024-01-13",
    items: 5,
    priority: "Low",
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    status: "Pending",
    amount: "$89.99",
    date: "2024-01-12",
    items: 1,
    priority: "High",
  },
]

const orderColumns = [
  { key: "id", label: "Order ID" },
  {
    key: "customer",
    label: "Customer",
    render: (value: string, row: any) => (
      <div>
        <div className="font-medium">{value}</div>
        <div className="text-sm text-muted-foreground">{row.email}</div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => {
      const variants: Record<string, string> = {
        Delivered: "bg-green-100 text-green-800 border-green-200",
        Processing: "bg-blue-100 text-blue-800 border-blue-200",
        Shipped: "bg-purple-100 text-purple-800 border-purple-200",
        Pending: "bg-orange-100 text-orange-800 border-orange-200",
      }
      return <Badge className={variants[value] || "bg-gray-100 text-gray-800"}>{value}</Badge>
    },
  },
  {
    key: "priority",
    label: "Priority",
    render: (value: string) => {
      const variants: Record<string, string> = {
        High: "bg-red-100 text-red-800 border-red-200",
        Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Low: "bg-gray-100 text-gray-800 border-gray-200",
      }
      return <Badge className={variants[value] || "bg-gray-100 text-gray-800"}>{value}</Badge>
    },
  },
  { key: "items", label: "Items" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
]

export default function OrdersPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Orders"
        description="Manage and track all your orders"
        action={{
          label: "New Order",
          onClick: () => console.log("New order clicked"),
        }}
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Order Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ColorfulCard variant="blue">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Total Orders</ColorfulCardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-blue-700">1,234</div>
              <p className="text-xs text-blue-600">+12% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>

          <ColorfulCard variant="green">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Delivered</ColorfulCardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-green-700">987</div>
              <p className="text-xs text-green-600">+8% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>

          <ColorfulCard variant="orange">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Processing</ColorfulCardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-orange-700">156</div>
              <p className="text-xs text-orange-600">+23% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>

          <ColorfulCard variant="purple">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Revenue</ColorfulCardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-purple-700">$45,231</div>
              <p className="text-xs text-purple-600">+15% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>
        </div>

        {/* Quick Actions */}
        <ColorfulCard variant="cyan">
          <ColorfulCardHeader>
            <ColorfulCardTitle>Quick Actions</ColorfulCardTitle>
          </ColorfulCardHeader>
          <ColorfulCardContent>
            <div className="flex flex-wrap gap-2">
              <CustomButton variant="blue" size="sm">
                <Package className="mr-2 h-4 w-4" />
                Bulk Ship
              </CustomButton>
              <CustomButton variant="green" size="sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Delivered
              </CustomButton>
              <CustomButton variant="orange" size="sm">
                <Truck className="mr-2 h-4 w-4" />
                Track Orders
              </CustomButton>
              <CustomButton variant="purple" size="sm">
                <DollarSign className="mr-2 h-4 w-4" />
                Generate Report
              </CustomButton>
            </div>
          </ColorfulCardContent>
        </ColorfulCard>

        {/* Orders Table */}
        <DataTable
          title="All Orders"
          description="Complete list of all orders with their current status."
          columns={orderColumns}
          data={orders}
        />
      </div>
    </div>
  )
}
