import { Header } from "@/components/dashboard/header"
import { DataTable } from "@/components/dashboard/data-table"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import {
  ColorfulCard,
  ColorfulCardContent,
  ColorfulCardHeader,
  ColorfulCardTitle,
  ColorfulCardDescription,
} from "@/components/ui/colorful-card"
import { Mail, Send, Users, TrendingUp, Eye, Edit, Trash2, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const campaigns = [
  {
    id: "CAMP-001",
    name: "Summer Sale 2024",
    subject: "🌞 Summer Sale - Up to 50% Off!",
    status: "Sent",
    recipients: 15420,
    openRate: "24.5%",
    clickRate: "3.2%",
    sentDate: "2024-01-15",
    type: "Promotional",
  },
  {
    id: "CAMP-002",
    name: "Welcome Series",
    subject: "Welcome to our community! 👋",
    status: "Active",
    recipients: 8930,
    openRate: "45.8%",
    clickRate: "8.1%",
    sentDate: "2024-01-10",
    type: "Welcome",
  },
  {
    id: "CAMP-003",
    name: "Product Update",
    subject: "New Features You'll Love ✨",
    status: "Draft",
    recipients: 12500,
    openRate: "0%",
    clickRate: "0%",
    sentDate: "-",
    type: "Update",
  },
  {
    id: "CAMP-004",
    name: "Newsletter #42",
    subject: "Weekly Insights & Tips",
    status: "Scheduled",
    recipients: 18750,
    openRate: "0%",
    clickRate: "0%",
    sentDate: "2024-01-20",
    type: "Newsletter",
  },
]

const campaignColumns = [
  { key: "name", label: "Campaign Name" },
  { key: "subject", label: "Subject" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => {
      const variants: Record<string, string> = {
        Sent: "bg-green-100 text-green-800 border-green-200",
        Active: "bg-blue-100 text-blue-800 border-blue-200",
        Draft: "bg-gray-100 text-gray-800 border-gray-200",
        Scheduled: "bg-purple-100 text-purple-800 border-purple-200",
      }
      return <Badge className={variants[value] || "bg-gray-100 text-gray-800"}>{value}</Badge>
    },
  },
  {
    key: "type",
    label: "Type",
    render: (value: string) => {
      const variants: Record<string, string> = {
        Promotional: "bg-orange-100 text-orange-800 border-orange-200",
        Welcome: "bg-cyan-100 text-cyan-800 border-cyan-200",
        Update: "bg-pink-100 text-pink-800 border-pink-200",
        Newsletter: "bg-indigo-100 text-indigo-800 border-indigo-200",
      }
      return <Badge className={variants[value] || "bg-gray-100 text-gray-800"}>{value}</Badge>
    },
  },
  { key: "recipients", label: "Recipients" },
  { key: "openRate", label: "Open Rate" },
  { key: "clickRate", label: "Click Rate" },
  {
    key: "actions",
    label: "Actions",
    render: (value: any, row: any) => (
      <div className="flex gap-1">
        <CustomButton variant="blue" size="sm">
          <Eye className="h-3 w-3" />
        </CustomButton>
        <CustomButton variant="green" size="sm">
          <Edit className="h-3 w-3" />
        </CustomButton>
        {row.status === "Draft" && (
          <CustomButton variant="purple" size="sm">
            <Send className="h-3 w-3" />
          </CustomButton>
        )}
        <CustomButton variant="pink" size="sm">
          <Trash2 className="h-3 w-3" />
        </CustomButton>
      </div>
    ),
  },
]

export default function MailCampaignsPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Mail Campaigns"
        description="Create and manage your email marketing campaigns"
        action={{
          label: "New Campaign",
          onClick: () => console.log("New campaign clicked"),
        }}
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Campaign Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ColorfulCard variant="blue">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Total Campaigns</ColorfulCardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-blue-700">127</div>
              <p className="text-xs text-blue-600">+8 this month</p>
            </ColorfulCardContent>
          </ColorfulCard>

          <ColorfulCard variant="green">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Total Subscribers</ColorfulCardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-green-700">45,231</div>
              <p className="text-xs text-green-600">+12% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>

          <ColorfulCard variant="purple">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Avg. Open Rate</ColorfulCardTitle>
              <Eye className="h-4 w-4 text-purple-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-purple-700">28.4%</div>
              <p className="text-xs text-purple-600">+2.1% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>

          <ColorfulCard variant="orange">
            <ColorfulCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <ColorfulCardTitle className="text-sm font-medium">Avg. Click Rate</ColorfulCardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </ColorfulCardHeader>
            <ColorfulCardContent>
              <div className="text-2xl font-bold text-orange-700">4.7%</div>
              <p className="text-xs text-orange-600">+0.8% from last month</p>
            </ColorfulCardContent>
          </ColorfulCard>
        </div>

        {/* Quick Campaign Creator */}
        <ColorfulCard variant="cyan">
          <ColorfulCardHeader>
            <ColorfulCardTitle>Quick Campaign Creator</ColorfulCardTitle>
            <ColorfulCardDescription>Create a new email campaign quickly</ColorfulCardDescription>
          </ColorfulCardHeader>
          <ColorfulCardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name</Label>
                <CustomInput id="campaignName" placeholder="Enter campaign name" variant="cyan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <CustomInput id="subject" placeholder="Enter email subject" variant="cyan" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Email Content</Label>
              <Textarea
                id="content"
                placeholder="Write your email content here..."
                className="min-h-[100px] border-cyan-200 focus-visible:ring-cyan-500"
              />
            </div>
            <div className="flex gap-2">
              <CustomButton variant="cyan">
                <Send className="mr-2 h-4 w-4" />
                Send Now
              </CustomButton>
              <CustomButton variant="blue">
                <Play className="mr-2 h-4 w-4" />
                Schedule
              </CustomButton>
              <CustomButton variant="green">Save Draft</CustomButton>
            </div>
          </ColorfulCardContent>
        </ColorfulCard>

        {/* Campaign Templates */}
        <ColorfulCard variant="pink">
          <ColorfulCardHeader>
            <ColorfulCardTitle>Campaign Templates</ColorfulCardTitle>
            <ColorfulCardDescription>Choose from pre-designed templates</ColorfulCardDescription>
          </ColorfulCardHeader>
          <ColorfulCardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border border-pink-200 rounded-lg bg-pink-50/50 hover:bg-pink-100/50 cursor-pointer transition-colors">
                <div className="text-sm font-medium text-pink-800">Welcome Email</div>
                <div className="text-xs text-pink-600 mt-1">Perfect for new subscribers</div>
              </div>
              <div className="p-4 border border-purple-200 rounded-lg bg-purple-50/50 hover:bg-purple-100/50 cursor-pointer transition-colors">
                <div className="text-sm font-medium text-purple-800">Newsletter</div>
                <div className="text-xs text-purple-600 mt-1">Weekly updates template</div>
              </div>
              <div className="p-4 border border-orange-200 rounded-lg bg-orange-50/50 hover:bg-orange-100/50 cursor-pointer transition-colors">
                <div className="text-sm font-medium text-orange-800">Promotional</div>
                <div className="text-xs text-orange-600 mt-1">Sales and offers template</div>
              </div>
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 cursor-pointer transition-colors">
                <div className="text-sm font-medium text-blue-800">Product Update</div>
                <div className="text-xs text-blue-600 mt-1">Feature announcements</div>
              </div>
            </div>
          </ColorfulCardContent>
        </ColorfulCard>

        {/* Campaigns Table */}
        <DataTable
          title="All Campaigns"
          description="Complete list of all your email campaigns and their performance."
          columns={campaignColumns}
          data={campaigns}
        />
      </div>
    </div>
  )
}
