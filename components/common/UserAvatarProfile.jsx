import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function UserAvatarProfile({ className, showInfo, user }) {
  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      <Avatar className={cn("h-8 w-8", className)}>
        <AvatarImage src={user.prefs?.avatar || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback>{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
      </Avatar>
      {showInfo && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        </div>
      )}
    </div>
  )
}
