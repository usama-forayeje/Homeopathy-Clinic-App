"use client"

import { Button } from "@/components/ui/button"
import { Users, Calendar, FileText, Building2, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "নতুন রোগী",
      description: "নতুন রোগী যোগ করুন",
      icon: Users,
      href: "/dashboard/patients/new",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "কনসালটেশন",
      description: "নতুন কনসালটেশন শুরু করুন",
      icon: Calendar,
      href: "/dashboard/consultations/new",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "প্রেসক্রিপশন",
      description: "প্রেসক্রিপশন দেখুন",
      icon: FileText,
      href: "/dashboard/prescriptions",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "চেম্বার",
      description: "চেম্বার ব্যবস্থাপনা",
      icon: Building2,
      href: "/dashboard/chambers",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "সেটিংস",
      description: "সিস্টেম সেটিংস",
      icon: Settings,
      href: "/dashboard/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-900/20",
    },
  ]

  return (
    <div className="grid gap-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="ghost"
          className="h-auto p-3 justify-start bg-transparent hover:bg-accent/50"
          asChild
        >
          <Link href={action.href}>
            <div className={`p-2 rounded-lg mr-3 ${action.bgColor}`}>
              <action.icon className={`h-4 w-4 ${action.color}`} />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        </Button>
      ))}
    </div>
  )
}
