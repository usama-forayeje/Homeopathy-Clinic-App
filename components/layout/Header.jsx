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

export function Header({ setSidebarOpen }) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {/* বাম পাশের অংশ: সাইডবার ট্রিগার, সেপারেটর, ব্রেডক্রাম্বস */}
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 px-4">
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        <NotificationBell />

        <UserNav user={user} logout={logout} />

        <ModeToggle />

        <ThemeSelector />
      </div>
    </header>
  );
}
