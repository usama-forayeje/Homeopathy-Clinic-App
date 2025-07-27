"use client"
import { useAuth } from "@/providers/AuthProvider"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { SearchInput } from "@/components/common/SearchInput"
import { UserNav } from "./UserNav"
import { NotificationBell } from "@/components/common/NotificationBell"
import { ThemeSelector } from "../ui/theme-selector"
import { ModeToggle } from "../common/theme-toggle"
import { cn } from "@/lib/utils"

export function Header({ className, ...props }) { 
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6",
        // Remove left, width, right, and fixed positioning if they were here.
        // Tailwind classes like `w-full` are usually fine if the parent defines the width.
        "w-full", // Ensure it takes full width of its parent
        className
      )}
      {...props}
    >
      {/* Left side: Sidebar Trigger, Separator, Breadcrumbs */}
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      {/* Right side: Search, Notifications, UserNav, Theme Toggles */}
      <div className="flex flex-1 items-center justify-end gap-2 px-4">
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        {/* <NotificationBell /> */}

        <ModeToggle />
        <UserNav user={user} logout={logout} />

        {/* <ThemeSelector /> */}
      </div>
    </header>
  );
}