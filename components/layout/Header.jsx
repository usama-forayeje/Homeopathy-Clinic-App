"use client";

import React from "react";
import { useSidebar } from "@/lib/providers/SidebarProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/layout/UserNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Search, Menu } from "lucide-react"; // Menu আইকন যোগ করা হয়েছে
import { CommandMenu } from "@/components/command-menu"; // CommandMenu
import Link from "next/link";

export function Header() {
  const { setSidebarOpen } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* মোবাইল সাইডবার ট্রিগার */}
        <Sheet onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {/* এখানে আপনার মোবাইল Sidebar কম্পোনেন্ট বসবে */}
            <h2 className="text-xl font-semibold p-4 border-b">ক্লিনিক অ্যাপ</h2>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
              <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">ড্যাশবোর্ড</Link>
              <Link href="/dashboard/patients" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">রোগী</Link>
              <Link href="/dashboard/consultations" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">পরামর্শ</Link>
              <Link href="/dashboard/medicines" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">ঔষধ</Link>
              <Link href="/dashboard/diseases" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">রোগ</Link>
              <Link href="/dashboard/appointments" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">অ্যাপয়েন্টমেন্ট</Link>
              <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">সেটিংস</Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* সার্চ বার / কীবোর্ড শর্টকাট ট্রিগার */}
        <div className="ml-auto flex items-center gap-4">
          <CommandMenu /> {/* KBar/cmdk based search */}
          {/* অথবা আপনি যদি একটি সাধারণ সার্চ ইনপুট চান: */}
          {/* <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full pl-9" />
          </div> */}

          {/* থিম টগল */}
          <ThemeToggle />

          {/* ইউজার প্রোফাইল ড্রপডাউন */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}