// components/layout/DashboardLayoutWrapper.jsx
"use client"

import { useEffect } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { KBar } from "@/components/kbar/KBar"
import { AppSidebar } from "./AppSidebar"
import { Header } from "./Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"

export function DashboardLayoutWrapper({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <KBar>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* ✅ Add padding-top to shift content below the fixed header */}
          <main className="pt-16"> {/* Adjust 'pt-16' if your header height changes */}
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  )
}