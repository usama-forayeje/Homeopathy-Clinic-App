// components/layout/sidebar.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useSidebar } from '@/lib/providers/SidebarProvider'; 
import {
  Home,
  Users,
  BriefcaseMedical,
  Stethoscope,
  Pill,
  Syringe,
  Calendar,
  Settings,
  Menu,
} from 'lucide-react'; // আইকন
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <>
      {/* ডেস্কটপ সাইডবার */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r bg-background lg:flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
            {/* আপনার লোগো বা অ্যাপের নাম */}
            <img src="/assets/logo.png" alt="Logo" className={cn("h-8 w-auto transition-all", sidebarOpen ? "block" : "hidden")} />
            <span className={cn("transition-all duration-300", sidebarOpen ? "opacity-100 block" : "opacity-0 hidden")}>ক্লিনিক অ্যাপ</span>
            <span className={cn("transition-all duration-300", sidebarOpen ? "opacity-0 hidden" : "opacity-100 block text-xl")}>CA</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid items-start gap-1 px-2 text-sm font-medium">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                <span className={cn("transition-all duration-300", sidebarOpen ? "opacity-100 block" : "opacity-0 hidden")}>ড্যাশবোর্ড</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/patients"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                <span className={cn("transition-all duration-300", sidebarOpen ? "opacity-100 block" : "opacity-0 hidden")}>রোগী</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/consultations"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BriefcaseMedical className="h-4 w-4" />
                <span className={cn("transition-all duration-300", sidebarOpen ? "opacity-100 block" : "opacity-0 hidden")}>পরামর্শ</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/medicines"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Pill className="h-4 w-4" />
                <span className={cn("transition-all duration-300", sidebarOpen ? "opacity-100 block" : "opacity-0 hidden")}>ঔষধ</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/diseases"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Stethoscope className="h-4 w-4" />
                <span className={cn("transition-all duration-300", sidebarOpen ? "opacity-100 block" : "opacity-0 hidden")}>রোগ</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/appointments"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Calendar className="h-4 w-4" />
                <span className={cn("transition-all duration-300", sidebarOpen ? "opacity-100 block" : "opacity-0 hidden")}>অ্যাপয়েন্টমেন্ট</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                <span className={cn("transition-all duration-300", sidebarOpen ? "opacity-100 block" : "opacity-0 hidden")}>সেটিংস</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* মোবাইল সাইডবার ট্রিগার (Header.jsx এও আছে, এটি Header এর বাইরে সাইডবারের নিজস্ব ট্রিগার) */}
      {/* এটি সাধারণত Header এর মধ্যে থাকে, তাই এখানে প্রয়োজন নাও হতে পারে */}
    </>
  );
}