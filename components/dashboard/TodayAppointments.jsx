"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export function TodayAppointments({ showAll = false }) {
  const upcomingAppointments = [
    {
      id: "1",
      time: "১০:০০ AM",
      patient: "রাশিদা খাতুন",
      type: "নতুন কনসালটেশন",
      status: "confirmed",
    },
    {
      id: "2",
      time: "১১:৩০ AM",
      patient: "আব্দুল করিম",
      type: "ফলো-আপ",
      status: "confirmed",
    },
    {
      id: "3",
      time: "২:০০ PM",
      patient: "নাসির উদ্দিন",
      type: "চেক-আপ",
      status: "pending",
    },
    {
      id: "4",
      time: "৩:৩০ PM",
      patient: "রোকেয়া বেগম",
      type: "নতুন কনসালটেশন",
      status: "confirmed",
    },
  ]

  const displayAppointments = showAll ? upcomingAppointments : upcomingAppointments.slice(0, 4)

  return (
    <div className="space-y-4">
      {!showAll && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/consultations">
              সব দেখুন
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {displayAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{appointment.patient}</p>
                <span className="text-sm font-medium text-primary">{appointment.time}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-muted-foreground">{appointment.type}</p>
                <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                  {appointment.status === "confirmed" ? "নিশ্চিত" : "অপেক্ষমান"}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
