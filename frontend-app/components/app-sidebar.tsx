import {
  Calendar,
  Home,
  Search,
  Settings,
  Users,
  BarChart3,
  FileText,
  Mail,
  ShoppingCart,
  BookOpen,
  ShoppingBag,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import ShopDropdown from "@/components/ShopDropdown"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Onboarding",
    url: "/onboarding",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
  },
  {
    title: "Mail Campaigns",
    url: "/mail-campaigns",
    icon: Mail,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Shop Sync",
    url: "/shop-sync",
    icon: ShoppingBag,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </div>
          <span className="font-semibold">Dashboard</span>
        </div>
        <div className="px-4 py-2">
          <ShopDropdown />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-sm text-muted-foreground">© 2024 Dashboard App</div>
      </SidebarFooter>
    </Sidebar>
  )
}
