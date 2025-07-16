// components/layout/Header.jsx
"use client";

import React from 'react'; // Explicit React import
import { Menu, Bell, Search, Sun, Moon, LogOut, Settings, UserCircle2 } from "lucide-react";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Contexts
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "next-themes";
import { useSidebar } from "@/lib/providers/SidebarProvider"; // Custom sidebar context hook

export function Header() {
  const { user, logout } = useAuth(); // Access user and logout from AuthContext
  const { theme, setTheme } = useTheme(); // Access theme and setTheme from next-themes
  const { setSidebarOpen } = useSidebar(); // Access setSidebarOpen from SidebarContext

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile sidebar toggle button - only visible on small screens */}
      <Button
        variant="ghost"
        size="icon"
        className="-m-2.5 p-2.5 text-foreground lg:hidden"
        onClick={() => setSidebarOpen(true)} // Opens the mobile sidebar sheet
        aria-label="Open sidebar menu"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      {/* Separator for mobile - visual divider */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      {/* Main content area of the header */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search Form (styled like Kiranism's search bar) */}
        <form className="relative flex flex-1 items-center" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="absolute left-3 h-5 w-5 text-muted-foreground" // Search icon styling
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="h-9 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search patients, consultations, or medicines..."
            type="search"
            name="search"
            aria-label="Search field"
          />
        </form>

        {/* Right-aligned action buttons and profile */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme toggle button */}
          <TooltipProvider delayDuration={200}> {/* Provides tooltip context */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")} // Toggles theme
                  className="text-muted-foreground hover:bg-muted/50" // Theme-aware button styling
                  aria-label="Toggle theme"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Theme</TooltipContent> {/* Tooltip content */}
            </Tooltip>
          </TooltipProvider>

          {/* Notifications button */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-muted/50"
                  aria-label="View notifications"
                >
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Separator for desktop */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          {/* Profile dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full"> {/* Avatar button */}
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.prefs?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal flex items-center gap-2">
                {/* User Avatar & Info inside dropdown */}
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.prefs?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium leading-none">{user?.name || "Dr. User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer"> {/* Settings option */}
                <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer"> {/* Profile option */}
                <UserCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}> {/* Logout option */}
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}