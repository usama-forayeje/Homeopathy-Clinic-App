"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function UserAvatarProfile({ user, className, showInfo = false, ...props }) {
  if (!user) return null

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (showInfo) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className={cn("h-8 w-8", className)} {...props}>
          <AvatarImage src={user.prefs?.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>
    )
  }

  return (
    <Avatar className={cn("h-8 w-8", className)} {...props}>
      <AvatarImage src={user.prefs?.avatar || "/placeholder.svg"} alt={user.name} />
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  )
}
