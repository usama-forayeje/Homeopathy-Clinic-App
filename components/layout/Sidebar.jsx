"use client";

import React from "react"; 
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Building2,
  Settings,
  Home,
  X,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button"; 
import { Dialog, DialogContent } from "@/components/ui/dialog"; 
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "ড্যাশবোর্ড", href: "/dashboard", icon: Home },
  { name: "রোগীসমূহ", href: "/dashboard/patients", icon: Users },
  { name: "কনসালটেশন", href: "/dashboard/consultations", icon: Calendar },
  { name: "প্রেসক্রিপশন", href: "/dashboard/prescriptions", icon: FileText },
  { name: "রোগীর অভ্যাস", href: "/dashboard/habits", icon: Activity },
  { name: "চেম্বারসমূহ", href: "/dashboard/chambers", icon: Building2 },
  { name: "সেটিংস", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ open, setOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar - uses Shadcn Sheet component */}
      <Sheet open={open} onOpenChange={setOpen}>
        {/* SheetTrigger is typically a button to open the sheet, but here `open` prop handles it */}
        {/* <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">Open Sidebar</Button>
        </SheetTrigger> */}
        <SheetContent side="left" className="p-0 border-r-0 w-72"> {/* `w-72` for consistent width */}
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <SheetTitle className="sr-only">হোমিওকেয়ার প্রো নেভিগেশন</SheetTitle> {/* Accessibility */}
            <div className="flex h-16 shrink-0 items-center">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary rounded-lg">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">হোমিওকেয়ার প্রো</span>
              </div>
            </div>
            {/* Close button is automatically handled by Sheet, but if you want custom, add here */}
            {/* <Button variant="ghost" className="absolute right-4 top-4" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Button> */}
          </SheetHeader>
          <nav className="flex flex-1 flex-col px-6 py-5">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-primary text-white"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                        )}
                        onClick={() => setOpen(false)} // মোবাইল সাইডবার বন্ধ করতে
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">হোমিওকেয়ার প্রো</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-primary text-white"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}