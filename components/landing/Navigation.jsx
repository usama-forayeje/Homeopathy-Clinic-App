"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthProvider"
import { Stethoscope, Menu, X, User, Shield } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loginWithGoogle } = useAuth()

  const navItems = [
    { name: "হোম", href: "#home" },
    { name: "বৈশিষ্ট্য", href: "#features" },
    { name: "সেবাসমূহ", href: "#services" },
    { name: "যোগাযোগ", href: "#contact" },
    { name: "সম্পর্কে", href: "#about" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white">Popular Homeo Care</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">আধুনিক হোমিওপ্যাথিক সেবা</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-2">
                {user.labels?.includes("admin") && (
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">
                      <Shield className="mr-2 h-4 w-4" />
                      ড্যাশবোর্ড
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={loginWithGoogle} className="bg-primary hover:bg-primary/90">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                লগইন
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle />
                {user ? (
                  <div className="flex items-center space-x-2">
                    {user.labels?.includes("admin") && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard">
                          <Shield className="mr-2 h-4 w-4" />
                          ড্যাশবোর্ড
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button onClick={loginWithGoogle} size="sm">
                    লগইন
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
