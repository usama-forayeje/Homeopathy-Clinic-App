"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Smartphone,
  Cloud,
  Lock,
  Headphones,
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "রোগী ব্যবস্থাপনা",
      description: "সম্পূর্ণ রোগীর তথ্য, ইতিহাস এবং যোগাযোগের বিবরণ সংরক্ষণ করুন",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Calendar,
      title: "কনসালটেশন ট্র্যাকিং",
      description: "প্রতিটি ভিজিটের বিস্তারিত রেকর্ড এবং ফলো-আপ সময়সূচী",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: FileText,
      title: "প্রেসক্রিপশন ব্যবস্থাপনা",
      description: "ডিজিটাল প্রেসক্রিপশন তৈরি এবং ঔষধের ইতিহাস সংরক্ষণ",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Activity,
      title: "রোগীর অভ্যাস ট্র্যাকিং",
      description: "জীবনযাত্রার অভ্যাস এবং স্বাস্থ্য প্যাটার্ন পর্যবেক্ষণ",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: BarChart3,
      title: "রিপোর্ট ও অ্যানালিটিক্স",
      description: "বিস্তারিত রিপোর্ট এবং ব্যবসায়িক অন্তর্দৃষ্টি",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      icon: Shield,
      title: "নিরাপদ ডেটা",
      description: "এনক্রিপ্টেড ডেটা স্টোরেজ এবং নিরাপদ অ্যাক্সেস নিয়ন্ত্রণ",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: Zap,
      title: "দ্রুত অ্যাক্সেস",
      description: "তাৎক্ষণিক রোগীর তথ্য অনুসন্ধান এবং রিপোর্ট তৈরি",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: Clock,
      title: "২৪/৭ উপলব্ধতা",
      description: "যেকোনো সময়, যেকোনো জায়গা থেকে অ্যাক্সেস করুন",
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      icon: Smartphone,
      title: "মোবাইল ফ্রেন্ডলি",
      description: "সকল ডিভাইসে সুন্দর এবং ব্যবহারবান্ধব ইন্টারফেস",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
  ]

  const additionalFeatures = [
    { icon: Cloud, title: "ক্লাউড ব্যাকআপ", description: "স্বয়ংক্রিয় ডেটা ব্যাকআপ" },
    { icon: Lock, title: "GDPR কমপ্লায়েন্ট", description: "আন্তর্জাতিক নিরাপত্তা মান" },
    { icon: Headphones, title: "২৪/৭ সাপোর্ট", description: "সর্বদা সহায়তা প্রস্তুত" },
  ]

  return (
    <section id="features" className="py-20 lg:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300">
            ✨ বৈশিষ্ট্যসমূহ
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            কেন আমাদের সিস্টেম বেছে নেবেন?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            আধুনিক প্রযুক্তি এবং ব্যবহারকারী-বান্ধব ইন্টারফেসের সমন্বয়ে তৈরি একটি সম্পূর্ণ সমাধান
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-500 border-0 shadow-md hover:scale-105 bg-white dark:bg-gray-800"
            >
              <CardHeader>
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">আরও বৈশিষ্ট্য</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
