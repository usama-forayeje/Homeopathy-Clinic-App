// components/layout/DashboardLayout.jsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useSidebar } from "@/lib/providers/SidebarProvider"; // Import useSidebar hook

export function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useSidebar(); // Get sidebar state and setter from context

  useEffect(() => {
    // Redirect unauthenticated users to landing page
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while auth state is being checked
  }

  if (!user) {
    return null; // Don't render anything if not authenticated (redirect handled by useEffect)
  }

  return (
    <div className="flex min-h-screen bg-background"> {/* Use theme background color */}
      {/* Mobile Sidebar (controlled by state from Header) */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* For desktop, Sidebar is always open. Its internal state is not managed by prop `open` here. */}
        {/* Passing `setOpen` prop is still okay, but Sidebar now internally uses useSidebar for mobile trigger */}
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 lg:ml-72"> {/* lg:ml-72 because desktop sidebar is 72px wide */}
        <Header /> {/* Header now uses useSidebar to toggle mobile sidebar */}
        <main className="flex-1 py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}