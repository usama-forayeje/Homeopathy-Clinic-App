
"use client";

import React from 'react';
import { useSidebar } from '@/lib/providers/SidebarProvider';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Sidebar } from '../ui/sidebar';


export function DashboardShell({ children, defaultSidebarOpen }) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  // defaultSidebarOpen ভ্যালু ব্যবহার করে সাইডবারের প্রাথমিক অবস্থা সেট করুন
  React.useEffect(() => {
    if (defaultSidebarOpen !== undefined) {
      setSidebarOpen(defaultSidebarOpen);
    }
  }, [defaultSidebarOpen, setSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* বাম সাইডবার - এটি DashboardShell এর মধ্যেই থাকবে */}
      <Sidebar />

      {/* মূল কন্টেন্ট এরিয়া */}
      <main
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16" // সাইডবার খোলা বা বন্ধের উপর ভিত্তি করে মার্জিন
        )}
      >
        {/* হেডার - এটিও DashboardShell এর মধ্যেই থাকবে */}
        <Header />

        {/* পেজের কন্টেন্ট */}
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}