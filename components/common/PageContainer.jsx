"use client"

import { cn } from "@/lib/utils"

export function PageContainer({ children, className, ...props }) {
  return (
    <div className={cn("container mx-auto px-4 py-6", className)} {...props}>
      {children}
    </div>
  )
}
