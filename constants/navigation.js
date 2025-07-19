import { Home, Users, FileText, Building2, Settings, Stethoscope, ClipboardList, TrendingUp } from "lucide-react"

export const navItems = [
  {
    title: "ড্যাশবোর্ড",
    url: "/dashboard",
    icon: Home,
    isActive: false,
  },
  {
    title: "রোগী ব্যবস্থাপনা",
    icon: Users,
    isActive: false,
    items: [
      {
        title: "সকল রোগী",
        url: "/dashboard/patients",
      },
      {
        title: "নতুন রোগী",
        url: "/dashboard/patients/new",
      },
      {
        title: "রোগীর অভ্যাস",
        url: "/dashboard/patients/habits",
      },
    ],
  },
  {
    title: "কনসালটেশন",
    icon: Stethoscope,
    isActive: false,
    items: [
      {
        title: "সকল কনসালটেশন",
        url: "/dashboard/consultations",
      },
      {
        title: "নতুন কনসালটেশন",
        url: "/dashboard/consultations/new",
      },
      {
        title: "আজকের অ্যাপয়েন্টমেন্ট",
        url: "/dashboard/consultations/today",
      },
    ],
  },
  {
    title: "প্রেসক্রিপশন",
    icon: FileText,
    isActive: false,
    items: [
      {
        title: "সকল প্রেসক্রিপশন",
        url: "/dashboard/prescriptions",
      },
      {
        title: "ঔষধের তালিকা",
        url: "/dashboard/medicines",
      },
    ],
  },
  {
    title: "রিপোর্ট ও অ্যানালিটিক্স",
    icon: TrendingUp,
    isActive: false,
    items: [
      {
        title: "রোগীর রিপোর্ট",
        url: "/dashboard/reports/patients",
      },
      {
        title: "আয়ের রিপোর্ট",
        url: "/dashboard/reports/income",
      },
      {
        title: "চেম্বার রিপোর্ট",
        url: "/dashboard/reports/chambers",
      },
    ],
  },
  {
    title: "চেম্বার ব্যবস্থাপনা",
    url: "/dashboard/chambers",
    icon: Building2,
    isActive: false,
  },
  {
    title: "রোগের তালিকা",
    url: "/dashboard/diseases",
    icon: ClipboardList,
    isActive: false,
  },
  {
    title: "সেটিংস",
    url: "/dashboard/settings",
    icon: Settings,
    isActive: false,
  },
]
