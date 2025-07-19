import { DashboardLayoutWrapper } from "@/components/layout/DashboardLayoutWrapper"
import { ActiveThemeProvider } from "@/components/ui/active-theme"

export const metadata = {
  title: "হোমিওকেয়ার প্রো - ড্যাশবোর্ড",
  description: "আধুনিক হোমিওপ্যাথিক ক্লিনিক ব্যবস্থাপনা সিস্টেম",
}

export default async function DashboardLayout({ children }) {
  return (
    <ActiveThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
    </ActiveThemeProvider>
  )
}