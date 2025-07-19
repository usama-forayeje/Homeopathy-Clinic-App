"use client"
import { Calendar, FileText, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "consultation",
      title: "নতুন কনসালটেশন সম্পন্ন",
      description: "আহমেদ হাসানের সাথে কনসালটেশন সম্পন্ন হয়েছে",
      time: "৫ মিনিট আগে",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      id: 2,
      type: "prescription",
      title: "প্রেসক্রিপশন তৈরি",
      description: "ফাতিমা খাতুনের জন্য নতুন প্রেসক্রিপশন তৈরি করা হয়েছে",
      time: "১৫ মিনিট আগে",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      id: 3,
      type: "patient",
      title: "নতুন রোগী নিবন্ধন",
      description: "মোহাম্মদ রহিম নতুন রোগী হিসেবে নিবন্ধিত হয়েছেন",
      time: "৩০ মিনিট আগে",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      id: 4,
      type: "appointment",
      title: "অ্যাপয়েন্টমেন্ট নিশ্চিত",
      description: "সালমা বেগমের আগামীকালের অ্যাপয়েন্টমেন্ট নিশ্চিত করা হয়েছে",
      time: "১ ঘন্টা আগে",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      id: 5,
      type: "reminder",
      title: "ফলো-আপ রিমাইন্ডার",
      description: "করিম উদ্দিনের ফলো-আপ আগামীকাল নির্ধারিত",
      time: "২ ঘন্টা আগে",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${activity.bgColor}`}>
            <activity.icon className={`h-4 w-4 ${activity.color}`} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.description}</p>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
