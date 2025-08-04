import { Header } from "@/components/dashboard/header"
import { DataTable } from "@/components/dashboard/data-table"
import { CustomButton } from "@/components/ui/custom-button"
import { ColorfulCard, ColorfulCardContent, ColorfulCardHeader, ColorfulCardTitle } from "@/components/ui/colorful-card"
import { FileText, Download, Send, Eye, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const invoices = [
  {
    id: "INV-001",
    customer: "Acme Corp",
    email: "billing@acme.com",
    amount: "$2,500.00",
    status: "Paid",
    dueDate: "2024-01-15",
    issueDate: "2024-01-01",
    items: 5,
  },
  {
    id: "INV-002",
    customer: "Tech Solutions",
    email: "finance@techsol.com",
    amount: "$1,800.00",
    status: "Pending",
    dueDate: "2024-01-20",
    issueDate: "2024-01-05",
    items: 3,
  },
  {
    id: "INV-003",
    customer: "Global Industries",
    email: "ap@global.com",
    amount: "$3,200.00",
    status: "Overdue",
    dueDate: "2024-01-10",
    issueDate: "2023-12-25",
    items: 8,
  },
  {
    id: "INV-004",
    customer: "StartupXYZ",
    email: "billing@startupxyz.com",
    amount: "$950.00",
    status: "Draft",
    dueDate: "2024-01-25",
    issueDate: "2024-01-10",
    items: 2,
  },
]

const invoiceColumns = [
  { key: "id", label: "Invoice ID" },
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
        Paid: "bg-green-100 text-green-800 border-green-200",
        Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Overdue: "bg-red-100 text-red-800 border-red-200",
        Draft: "bg-gray-100 text-gray-800 border-gray-200",
      }
      return <Badge className={variants[value] || "bg-gray-100 text-gray-800"}>{value}</Badge>
    },
  },
  { key: "amount", label: "Amount" },
  { key: "issueDate", label: "Issue Date" },
  { key: "dueDate", label: "Due Date" },
  {
    key: "actions",
    label: "Actions",
    render: (value: any, row: any) => (
      <div className="flex gap-1">
        <CustomButton variant="blue" size="sm">
          <Eye className="h-3 w-3" />
        </CustomButton>
        <CustomButton variant="green" size="sm">
          <Download className="h-3 w-3" />
        </CustomButton>
        <CustomButton variant="purple" size="sm">
          <Send className="h-3 w-3" />
        </CustomButton>
      </div>
    ),
  },
]

export default function InvoicesPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Invoices"
        description="Manage your invoices and billing"
        action={{
          label: "Create Invoice",
          onClick: () => console.log("Create invoice clicked"),
        }}
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Invoice Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ColorfulCard variant="green">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Total Revenue</ColorfulCardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-green-700">$45,231</div>
              <p className="text-xs text-green-600">+20.1% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>

          <ColorfulCard variant="blue">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Paid Invoices</ColorfulCardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-blue-700">156</div>
              <p className="text-xs text-blue-600">+12% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>

          <ColorfulCard variant="orange">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Pending</ColorfulCardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-orange-700">23</div>
              <p className="text-xs text-orange-600">-5% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>

          <ColorfulCard variant="pink">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Overdue</ColorfulCardTitle>
              <AlertCircle className="h-4 w-4 text-pink-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-pink-700">8</div>
              <p className="text-xs text-pink-600">+2 from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>
        </div>

        {/* Quick Actions */}
        <ColorfulCard variant="purple">
          <ColorfulCardHeader>
            <ColorfulCardTitle>Invoice Actions</ColorfulCardTitle>
          </ColorfulCardHeader>
          <ColorfulCardContent>
            <div className="flex flex-wrap gap-2">
              <CustomButton variant="green" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                New Invoice
              </CustomButton>
              <CustomButton variant="blue" size="sm">
                <Send className="mr-2 h-4 w-4" />
                Send Reminders
              </CustomButton>
              <CustomButton variant="orange" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export All
              </CustomButton>
              <CustomButton variant="purple" size="sm">
                <DollarSign className="mr-2 h-4 w-4" />
                Payment Report
              </CustomButton>
            </div>
          </ColorfulCardContent>
        </ColorfulCard>

        {/* Invoices Table */}
        <DataTable
          title="All Invoices"
          description="Complete list of all invoices and their payment status."
          columns={invoiceColumns}
          data={invoices}
        />
      </div>
    </div>
  )
}
