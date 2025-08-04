import { Header } from "@/components/dashboard/header"
import { DataTable } from "@/components/dashboard/data-table"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Users, UserPlus, UserCheck, UserX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "2024-01-10",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "2024-01-05",
  },
]

const userColumns = [
  {
    key: "name",
    label: "User",
    render: (value: string, row: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.avatar || "/placeholder.svg"} />
          <AvatarFallback>
            {value
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      </div>
    ),
  },
  { key: "role", label: "Role" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <Badge variant={value === "Active" ? "default" : "secondary"}>{value}</Badge>,
  },
  { key: "joinDate", label: "Join Date" },
]

export default function UsersPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Users"
        description="Manage your users and their permissions"
        action={{
          label: "Add User",
          onClick: () => console.log("Add user clicked"),
        }}
      />

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* User Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value="2,350"
            description="All registered users"
            icon={Users}
            trend={{ value: "12%", isPositive: true }}
          />
          <StatsCard
            title="New Users"
            value="145"
            description="New users this month"
            icon={UserPlus}
            trend={{ value: "8%", isPositive: true }}
          />
          <StatsCard
            title="Active Users"
            value="1,890"
            description="Currently active users"
            icon={UserCheck}
            trend={{ value: "5%", isPositive: true }}
          />
          <StatsCard
            title="Inactive Users"
            value="460"
            description="Inactive users"
            icon={UserX}
            trend={{ value: "2%", isPositive: false }}
          />
        </div>

        {/* Users Table */}
        <DataTable
          title="All Users"
          description="A list of all users in your system."
          columns={userColumns}
          data={users}
        />
      </div>
    </div>
  )
}
