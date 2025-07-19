"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function NotificationBell() {
  const [notifications] = useState([
    {
      id: 1,
      title: "নতুন অ্যাপয়েন্টমেন্ট",
      message: "আহমেদ হাসান আজ ৩:০০ PM এ অ্যাপয়েন্টমেন্ট বুক করেছেন",
      time: "৫ মিনিট আগে",
      unread: true,
    },
    {
      id: 2,
      title: "ফলো-আপ রিমাইন্ডার",
      message: "ফাতিমা খাতুনের ফলো-আপ আগামীকাল",
      time: "১ ঘন্টা আগে",
      unread: true,
    },
    {
      id: 3,
      title: "পেমেন্ট সম্পন্ন",
      message: "মোহাম্মদ রহিমের পেমেন্ট সফলভাবে সম্পন্ন হয়েছে",
      time: "২ ঘন্টা আগে",
      unread: false,
    },
  ])

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel>নোটিফিকেশন</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>কোনো নোটিফিকেশন নেই</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
              <div className="flex w-full items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
                {notification.unread && <div className="h-2 w-2 bg-blue-500 rounded-full mt-1" />}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
