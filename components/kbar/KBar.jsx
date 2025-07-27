"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function KBar({ children }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const commands = [
    {
      group: "পেজসমূহ",
      items: [
        { title: "ড্যাশবোর্ড", href: "/dashboard", shortcut: "d" },
        { title: "রোগীসমূহ", href: "/dashboard/patients", shortcut: "p" },
        { title: "কনসালটেশন", href: "/dashboard/consultations", shortcut: "c" },
        { title: "চেম্বারসমূহ", href: "/dashboard/chambers", shortcut: "h" },
        { title: "ঔষধ", href: "/dashboard/medicines", shortcut: "m" },
        { title: "অভ্যাসের সংজ্ঞা", href: "/dashboard/habit-definitions", shortcut: "b" },
        { title: "সেটিংস", href: "/dashboard/settings", shortcut: "s" },
      ],
    },
    {
      group: "দ্রুত অ্যাকশন",
      items: [
        { title: "নতুন রোগী যোগ করুন", href: "/dashboard/patients/new" },
        { title: "নতুন কনসালটেশন", href: "/dashboard/consultations/new" },
        { title: "নতুন চেম্বার যোগ করুন", href: "/dashboard/chambers/new" },
        { title: "নতুন অভ্যাস সংজ্ঞা", href: "/dashboard/habit-definitions" },
      ],
    },
  ]

  return (
    <>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="কমান্ড খুঁজুন বা পেজে যান..." />
        <CommandList>
          <CommandEmpty>কোনো ফলাফল পাওয়া যায়নি।</CommandEmpty>
          {commands.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    router.push(item.href)
                    setOpen(false)
                  }}
                >
                  <span>{item.title}</span>
                  {item.shortcut && <span className="ml-auto text-xs text-muted-foreground">⌘{item.shortcut}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
