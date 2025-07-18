// components/layout/dashboard-shell.jsx
"use client"; // এটি একটি ক্লায়েন্ট কম্পোনেন্ট

import React from 'react';
import { useSidebar } from '@/lib/providers/SidebarProvider'; // Sidebar Context থেকে
import { Header } from '@/components/layout/Header'; // আপনার হেডার কম্পোনেন্ট
import { cn } from '@/lib/utils'; // cn ইউটিলিটি
import { Sidebar } from './Sidebar';

export function DashboardShell({ children, defaultSidebarOpen }) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  // যদি defaultSidebarOpen সেট করা থাকে, তাহলে প্রাথমিক অবস্থায় সেটি ব্যবহার করুন।
  // useEffect ব্যবহার করে ক্লায়েন্ট-সাইডে স্টেট সিঙ্ক করা
  React.useEffect(() => {
    if (defaultSidebarOpen !== undefined) {
      setSidebarOpen(defaultSidebarOpen);
    }
  }, [defaultSidebarOpen, setSidebarOpen]);

  return (
    <div className="flex min-h-screen">
      {/* বাম সাইডবার */}
      <Sidebar />

      {/* মূল কন্টেন্ট এরিয়া */}
      <main
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16" // সাইডবার খোলা বা বন্ধের উপর ভিত্তি করে মার্জিন
        )}
      >
        {/* হেডার */}
        <Header />

        {/* পেজের কন্টেন্ট */}
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}