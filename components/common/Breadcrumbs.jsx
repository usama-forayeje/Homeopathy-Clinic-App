"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Breadcrumbs() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  const breadcrumbItems = [
    { name: "হোম", href: "/dashboard", icon: Home },
    ...pathSegments.slice(1).map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 2).join("/")
      const name = getBreadcrumbName(segment)
      return { name, href }
    }),
  ]

  function getBreadcrumbName(segment) {
    const nameMap = {
      dashboard: "ড্যাশবোর্ড",
      patients: "রোগীসমূহ",
      consultations: "কনসালটেশন",
      chambers: "চেম্বারসমূহ",
      medicines: "ঔষধ",
      "habit-definitions": "অভ্যাসের সংজ্ঞা",
      settings: "সেটিংস",
      new: "নতুন",
      edit: "সম্পাদনা",
    }
    return nameMap[segment] || segment
  }

  if (pathSegments.length <= 1) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="flex items-center gap-1">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href} className="flex items-center gap-1">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
