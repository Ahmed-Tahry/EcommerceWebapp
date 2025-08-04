import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { TrendingUp, Users, Eye, MousePointer } from "lucide-react"

export default function Analytics() {
  return (
    <div className="flex flex-col">
      <Header title="Analytics" description="Detailed analytics and insights" />

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Analytics Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Page Views"
            value="12,345"
            description="Total page views this month"
            icon={Eye}
            trend={{ value: "12.5%", isPositive: true }}
          />
          <StatsCard
            title="Unique Visitors"
            value="8,234"
            description="Unique visitors this month"
            icon={Users}
            trend={{ value: "8.2%", isPositive: true }}
          />
          <StatsCard
            title="Click Rate"
            value="3.2%"
            description="Average click-through rate"
            icon={MousePointer}
            trend={{ value: "0.5%", isPositive: false }}
          />
          <StatsCard
            title="Conversion Rate"
            value="2.4%"
            description="Conversion rate this month"
            icon={TrendingUp}
            trend={{ value: "0.8%", isPositive: true }}
          />
        </div>

        {/* Analytics Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="Traffic Overview" description="Website traffic for the last 30 days">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Traffic chart placeholder
            </div>
          </ChartCard>
          <ChartCard title="User Engagement" description="User engagement metrics">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Engagement chart placeholder
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Revenue Analytics" description="Revenue breakdown by source">
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Revenue analytics chart placeholder
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
