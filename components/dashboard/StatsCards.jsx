"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, FileText, TrendingUp } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "মোট রোগী",
      value: "১,২৩৪",
      change: "+১২%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "আজকের কনসালটেশন",
      value: "২৮",
      change: "+৮%",
      changeType: "positive",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "এই মাসের প্রেসক্রিপশন",
      value: "৫৬৭",
      change: "+১৫%",
      changeType: "positive",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "মাসিক আয়",
      value: "৮৫,০০০ ৳",
      change: "+২২%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center mt-1">
              <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                {stat.change}
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">গত মাস থেকে</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
