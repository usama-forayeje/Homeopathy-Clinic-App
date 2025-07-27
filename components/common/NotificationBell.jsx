"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Check, X } from "lucide-react"

export function NotificationBell() {
  const [notifications] = useState([
    {
      id: 1,
      title: "নতুন রোগী নিবন্ধিত",
      message: "মোহাম্মদ রহিম নামে একজন নতুন রোগী নিবন্ধিত হয়েছেন",
      time: "৫ মিনিট আগে",
      read: false,
    },
    {
      id: 2,
      title: "ফলো-আপ অ্যাপয়েন্টমেন্ট",
      message: "ফাতেমা খাতুনের ফলো-আপ আজ বিকাল ৩টায়",
      time: "১ ঘন্টা আগে",
      read: false,
    },
    {
      id: 3,
      title: "সিস্টেম আপডেট",
      message: "নতুন ফিচার যোগ করা হয়েছে",
      time: "২ ঘন্টা আগে",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          নোটিফিকেশন
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} নতুন
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>কোনো নোটিফিকেশন নেই</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-primary">সব দেখুন</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
