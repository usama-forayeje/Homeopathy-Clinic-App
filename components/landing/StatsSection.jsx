"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    {
      number: "১০০০+",
      label: "সন্তুষ্ট ডাক্তার",
      description: "দেশব্যাপী ব্যবহারকারী",
    },
    {
      number: "৫০,০০০+",
      label: "রোগীর রেকর্ড",
      description: "নিরাপদে সংরক্ষিত",
    },
    {
      number: "৯৯.৯%",
      label: "আপটাইম",
      description: "নির্ভরযোগ্য সেবা",
    },
    {
      number: "২৪/৭",
      label: "সাপোর্ট",
      description: "সর্বদা সহায়তা",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 via-blue-50 to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`text-center border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-500 delay-${index * 100} hover:scale-105 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <CardContent className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
