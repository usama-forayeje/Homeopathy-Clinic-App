"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

export function SearchInput() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const searchItems = [
    {
      group: "পেজসমূহ",
      items: [
        { title: "রোগীসমূহ", href: "/dashboard/patients" },
        { title: "কনসালটেশন", href: "/dashboard/consultations" },
        { title: "প্রেসক্রিপশন", href: "/dashboard/prescriptions" },
        { title: "চেম্বারসমূহ", href: "/dashboard/chambers" },
      ],
    },
    {
      group: "দ্রুত অ্যাকশন",
      items: [
        { title: "নতুন রোগী যোগ করুন", href: "/dashboard/patients/new" },
        { title: "নতুন কনসালটেশন", href: "/dashboard/consultations/new" },
        { title: "সেটিংস", href: "/dashboard/settings" },
      ],
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">খুঁজুন...</span>
        <span className="sr-only">Search</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="রোগী, কনসালটেশন বা অন্য কিছু খুঁজুন..." />
        <CommandList>
          <CommandEmpty>কোনো ফলাফল পাওয়া যায়নি।</CommandEmpty>
          {searchItems.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    router.push(item.href)
                    setOpen(false)
                  }}
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
