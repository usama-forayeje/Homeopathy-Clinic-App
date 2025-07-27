import { DashboardLayoutWrapper } from "@/components/layout/DashboardLayoutWrapper"
import { ActiveThemeProvider } from "@/components/ui/active-theme"

export const metadata = {
  title: "Popular Homeo Care - Dashboard",
  description: "A modern homeopathic clinic management system",
}

export default async function DashboardLayout({ children }) {
  return (
    <ActiveThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
    </ActiveThemeProvider>
  )
}
