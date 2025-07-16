// components/layout/Sidebar.jsx
"use client";

import React from "react"; // Explicit React import
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils"; // For merging Tailwind classes
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Building2,
  Settings,
  Home,
  X, // Used for close button in mobile sidebar
  Stethoscope, // Your app logo icon
  CircleUserRound, // For user profile icon in sidebar
  PlusCircle, // Example for "Add New" action icon
  LogOut, // For logout button icon in sidebar
} from "lucide-react";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Contexts
import { useSidebar } from "@/lib/providers/SidebarProvider"; // Custom sidebar context hook
import { useAuth } from "@/providers/AuthProvider"; // Authentication context hook

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Consultations", href: "/dashboard/consultations", icon: Calendar },
  { name: "Prescriptions", href: "/dashboard/prescriptions", icon: FileText },
  { name: "Patient Habits", href: "/dashboard/habits", icon: Activity },
  { name: "Chambers", href: "/dashboard/chambers", icon: Building2 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ open, setOpen }) {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Get user info and logout function from AuthContext

  // Helper function to check if the current path is active or part of an active group
  const isActive = (href) => {
    // Check for exact match or if the current path starts with the href (for nested routes)
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Sidebar - uses Shadcn Sheet component for slide-in effect */}
      {/* This Sheet's visibility is controlled by the 'open' prop passed from DashboardLayout */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 border-r-0 w-72 bg-background flex flex-col">
          {/* Sheet Header: App Logo and Name */}
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle className="sr-only">HomeoCare Pro Navigation</SheetTitle> {/* For accessibility */}
            <div className="flex h-16 shrink-0 items-center justify-between">
              {/* Logo Link */}
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="p-2 bg-primary rounded-lg">
                  <Stethoscope className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">HomeoCare Pro</span>
              </Link>
              {/* Close button for mobile sidebar (optional, Sheet handles click outside/Esc too) */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)} 
                className="lg:hidden text-muted-foreground hover:text-foreground"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </SheetHeader>

          {/* Sheet Navigation Content */}
          <nav className="flex flex-1 flex-col px-6 py-5 overflow-y-auto">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {/* Main Navigation Links */}
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <TooltipProvider delayDuration={200}> {/* Tooltip for each navigation item */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                isActive(item.href) // Apply active styling
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/10",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors items-center"
                              )}
                              onClick={() => setOpen(false)} // Close mobile sidebar on navigation click
                            >
                              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                              {item.name}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">{item.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Quick Actions / New Entry Section */}
              <li className="mt-auto py-4"> {/* Pushes this section to the bottom */}
                <Separator className="my-4 bg-border/50" /> {/* Visual separator */}
                <span className="text-xs font-semibold leading-6 text-muted-foreground px-2">Quick Actions</span>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  <li>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="/dashboard/patients/new"
                            className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors items-center text-muted-foreground hover:text-foreground hover:bg-muted/10"
                            onClick={() => setOpen(false)}
                          >
                            <PlusCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                            Add New Patient
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Create a new patient record</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                  {/* You can add more quick actions here as needed */}
                </ul>
              </li>

              {/* User Profile / Logout Section at the bottom of the sidebar */}
              <li className="pb-2"> {/* Padding at the bottom */}
                <Separator className="my-4 bg-border/50" />
                {user && (
                  <div className="flex items-center gap-x-3 p-2 text-sm font-semibold leading-6 text-foreground">
                    <CircleUserRound className="h-6 w-6" aria-hidden="true" />
                    <span className="truncate">{user.name || "Dr. User"}</span> {/* Display user's name */}
                  </div>
                )}
                {user?.email && (
                  <p className="text-xs text-muted-foreground ml-9 mt-1 truncate">{user.email}</p>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={logout} // Logout functionality
                >
                  <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Static sidebar for desktop - Always visible on larger screens (lg breakpoint and above) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-background px-6 py-5">
          {/* Logo and App Name */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HomeoCare Pro</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {/* Main Navigation Links */}
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                isActive(item.href)
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/10",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors items-center"
                              )}
                            >
                              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                              {item.name}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">{item.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Quick Actions / New Entry Section */}
              <li className="mt-auto py-4">
                <Separator className="my-4 bg-border/50" />
                <span className="text-xs font-semibold leading-6 text-muted-foreground px-2">Quick Actions</span>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  <li>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="/dashboard/patients/new"
                            className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors items-center text-muted-foreground hover:text-foreground hover:bg-muted/10"
                          >
                            <PlusCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                            Add New Patient
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Create a new patient record</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                  {/* More quick actions here if desired */}
                </ul>
              </li>

              {/* User Profile / Logout Section at the bottom */}
              <li className="pb-2">
                <Separator className="my-4 bg-border/50" />
                {user && (
                  <div className="flex items-center gap-x-3 p-2 text-sm font-semibold leading-6 text-foreground">
                    <CircleUserRound className="h-6 w-6" aria-hidden="true" />
                    <span className="truncate">{user.name || "Dr. User"}</span>
                  </div>
                )}
                {user?.email && (
                  <p className="text-xs text-muted-foreground ml-9 mt-1 truncate">{user.email}</p>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}