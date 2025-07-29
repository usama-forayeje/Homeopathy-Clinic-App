import { Home, Users, FileText, Building2, Settings, Stethoscope, ClipboardList, TrendingUp } from "lucide-react"

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: false,
  },
  {
    title: "Patient Management",
    icon: Users,
    isActive: false,
    items: [
      {
        title: "All Patients",
        url: "/dashboard/patients",
      },
      {
        title: "Add New Patient",
        url: "/dashboard/patients/new",
      },
    ],
  },
  {
    title: "Consultations",
    icon: Stethoscope,
    isActive: false,
    items: [
      {
        title: "All Consultations",
        url: "/dashboard/consultations",
      },
      {
        title: "New Consultation",
        url: "/dashboard/consultations/new",
      },
    ],
  },
  {
    title: "Reports & Analytics",
    icon: TrendingUp,
    isActive: false,
    items: [
      {
        title: "Patient Reports",
        url: "/dashboard/reports/patients",
      },
      {
        title: "Income Reports",
        url: "/dashboard/reports/income",
      },
      {
        title: "Chamber Reports",
        url: "/dashboard/reports/chambers",
      },
    ],
  },
  {
    title: "Medicine",
    url: "/dashboard/medicines",
    icon: FileText,
    isActive: false,
  },
  {
    title: "Instructions",
    url: "/dashboard/instructions",
    icon: FileText,
    isActive: false,
  },
  {
    title: "Chambers",
    url: "/dashboard/chambers",
    icon: Building2,
    isActive: false,
  },
  {
    title: "Habit Definitions",
    url: "/dashboard/habit-definitions",
    icon: ClipboardList,
    isActive: false,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    isActive: false,
    items: [
      {
        title: "Profile Settings",
        url: "/dashboard/settings/profile",
      },
      {
        title: "Add New Instruction",
        url: "/dashboard/instructions/add",
      },
    ],
  },
]
