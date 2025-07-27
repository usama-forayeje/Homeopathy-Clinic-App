"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"

export function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "ফোন",
      details: ["+৮৮০ ১৭১২-৩৪৫৬৭৮", "+৮৮০ ১৯১২-৩৪৫৬৭৮"],
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Mail,
      title: "ইমেইল",
      details: ["support@popularhomeocare.com", "info@popularhomeocare.com"],
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: MapPin,
      title: "ঠিকানা",
      details: ["১২৩ ধানমন্ডি, ঢাকা-১২০৫", "বাংলাদেশ"],
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: Clock,
      title: "সময়সূচী",
      details: ["সকাল ৯টা - রাত ৯টা", "সপ্তাহের ৭ দিন"],
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ]

  return (
    <section id="contact" className="py-20 lg:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
            📞 যোগাযোগ
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            আমাদের সাথে যোগাযোগ করুন
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">যোগাযোগের তথ্য</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg ${info.bgColor} flex items-center justify-center mb-4`}>
                        <info.icon className={`h-6 w-6 ${info.color}`} />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{info.title}</h4>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 dark:text-gray-300 text-sm">
                          {detail}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">ম্যাপ লোড হচ্ছে...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">আমাদের বার্তা পাঠান</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">নাম *</label>
                  <Input placeholder="আপনার নাম" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ফোন নম্বর *</label>
                  <Input placeholder="আপনার ফোন নম্বর" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ইমেইল *</label>
                <Input type="email" placeholder="আপনার ইমেইল" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">বিষয়</label>
                <Input placeholder="বার্তার বিষয়" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">বার্তা *</label>
                <Textarea placeholder="আপনার বার্তা লিখুন..." rows={5} />
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                <Send className="w-4 h-4 mr-2" />
                বার্তা পাঠান
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
