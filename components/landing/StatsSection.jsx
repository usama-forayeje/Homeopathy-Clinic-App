"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, Award, Clock } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Patients Managed",
      description: "Successfully managing patient records",
    },
    {
      icon: FileText,
      number: "50,000+",
      label: "Consultations",
      description: "Digital consultations recorded",
    },
    {
      icon: Award,
      number: "99.9%",
      label: "Uptime",
      description: "Reliable system availability",
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Support",
      description: "Round-the-clock assistance",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Trusted by Healthcare Professionals</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of homeopathic practitioners who trust our platform for their daily operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-md border-white/20 text-center group hover:bg-white/20 transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
                <div className="text-blue-100 text-sm">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
