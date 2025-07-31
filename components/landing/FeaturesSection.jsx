"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Pill,
  Calendar,
  BarChart3,
  Shield,
  Smartphone,
  Database,
  Stethoscope,
  Heart,
  Activity,
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Patient Management",
      description:
        "Comprehensive patient records with detailed medical history, contact information, and treatment tracking.",
      color: "bg-blue-500",
    },
    {
      icon: Stethoscope,
      title: "Consultation Records",
      description: "Detailed consultation notes, symptoms tracking, diagnosis, and treatment plans all in one place.",
      color: "bg-green-500",
    },
    {
      icon: Pill,
      title: "Prescription Management",
      description: "Digital prescription system with medicine database, dosage instructions, and treatment protocols.",
      color: "bg-purple-500",
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Efficient appointment booking system with automated reminders and follow-up scheduling.",
      color: "bg-orange-500",
    },
    {
      icon: Database,
      title: "Multi-Chamber Support",
      description: "Manage multiple clinic locations with centralized patient data and cross-chamber accessibility.",
      color: "bg-teal-500",
    },
    {
      icon: Activity,
      title: "Patient Habits Tracking",
      description: "Monitor patient lifestyle habits, dietary patterns, and behavioral changes over time.",
      color: "bg-pink-500",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive reporting system with patient statistics, treatment outcomes, and business insights.",
      color: "bg-indigo-500",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "HIPAA-compliant data security with encrypted storage and secure access controls.",
      color: "bg-red-500",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Access your clinic management system from any device with our responsive web application.",
      color: "bg-yellow-500",
    },
  ]

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-4">
            <Heart className="h-4 w-4 mr-2" />
            Comprehensive Features
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {" "}
              Modern Healthcare
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive clinic management system provides all the tools you need to deliver exceptional
            homeopathic care while streamlining your practice operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
