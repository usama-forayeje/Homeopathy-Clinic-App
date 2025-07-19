"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, User } from "lucide-react"
import Link from "next/link"

export function RecentPatients({ showAll = false }) {
  const recentPatients = [
    {
      id: "1",
      name: "আহমেদ হাসান",
      age: 35,
      lastVisit: "২ ঘন্টা আগে",
      status: "নতুন",
      avatar: "/placeholder.svg?height=40&width=40&text=আহ",
    },
    {
      id: "2",
      name: "ফাতিমা খাতুন",
      age: 28,
      lastVisit: "৫ ঘন্টা আগে",
      status: "ফলো-আপ",
      avatar: "/placeholder.svg?height=40&width=40&text=ফা",
    },
    {
      id: "3",
      name: "মোহাম্মদ রহিম",
      age: 45,
      lastVisit: "১ দিন আগে",
      status: "চিকিৎসাধীন",
      avatar: "/placeholder.svg?height=40&width=40&text=মো",
    },
    {
      id: "4",
      name: "সালমা বেগম",
      age: 32,
      lastVisit: "২ দিন আগে",
      status: "সুস্থ",
      avatar: "/placeholder.svg?height=40&width=40&text=সা",
    },
    {
      id: "5",
      name: "করিম উদ্দিন",
      age: 52,
      lastVisit: "৩ দিন আগে",
      status: "ফলো-আপ",
      avatar: "/placeholder.svg?height=40&width=40&text=ক",
    },
  ]

  const displayPatients = showAll ? recentPatients : recentPatients.slice(0, 5)

  return (
    <div className="space-y-4">
      {!showAll && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">সাম্প্রতিক রোগীসমূহ</h3>
            <p className="text-sm text-muted-foreground">সর্বশেষ ভিজিট করা রোগীদের তালিকা</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/patients">
              সব দেখুন
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {displayPatients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-muted-foreground">
                  বয়স: {patient.age} | {patient.lastVisit}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  patient.status === "নতুন"
                    ? "default"
                    : patient.status === "ফলো-আপ"
                      ? "secondary"
                      : patient.status === "সুস্থ"
                        ? "outline"
                        : "destructive"
                }
              >
                {patient.status}
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/patients/${patient.id}`}>দেখুন</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
