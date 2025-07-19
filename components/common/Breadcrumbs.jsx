"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { Fragment } from "react"

const pathNameMap = {
  dashboard: "ড্যাশবোর্ড",
  patients: "রোগীসমূহ",
  consultations: "কনসালটেশন",
  prescriptions: "প্রেসক্রিপশন",
  habits: "রোগীর অভ্যাস",
  chambers: "চেম্বারসমূহ",
  diseases: "রোগসমূহ",
  settings: "সেটিংস",
  profile: "প্রোফাইল",
  new: "নতুন",
  edit: "সম্পাদনা",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {pathSegments.slice(1).map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 2).join("/")
        const isLast = index === pathSegments.length - 2
        const displayName = pathNameMap[segment] || segment

        return (
          <Fragment key={segment}>
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-foreground">{displayName}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {displayName}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
