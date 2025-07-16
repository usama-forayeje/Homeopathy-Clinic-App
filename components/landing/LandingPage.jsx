"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/providers/AuthProvider"
import { useRouter } from "next/navigation"
import {
  Stethoscope,
  Users,
  Calendar,
  FileText,
  Shield,
  Zap,
  Heart,
  Activity,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

export function LandingPage() {
  const { user, loginWithGoogle, loading } = useAuth()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const features = [
    {
      icon: Users,
      title: "রোগী ব্যবস্থাপনা",
      description: "সম্পূর্ণ রোগীর তথ্য, ইতিহাস এবং যোগাযোগের বিবরণ সংরক্ষণ করুন",
      color: "text-blue-500",
    },
    {
      icon: Calendar,
      title: "কনসালটেশন ট্র্যাকিং",
      description: "প্রতিটি ভিজিটের বিস্তারিত রেকর্ড এবং ফলো-আপ সময়সূচী",
      color: "text-green-500",
    },
    {
      icon: FileText,
      title: "প্রেসক্রিপশন ব্যবস্থাপনা",
      description: "ডিজিটাল প্রেসক্রিপশন তৈরি এবং ঔষধের ইতিহাস সংরক্ষণ",
      color: "text-purple-500",
    },
    {
      icon: Activity,
      title: "রোগীর অভ্যাস ট্র্যাকিং",
      description: "জীবনযাত্রার অভ্যাস এবং স্বাস্থ্য প্যাটার্ন পর্যবেক্ষণ",
      color: "text-orange-500",
    },
    {
      icon: Shield,
      title: "নিরাপদ ডেটা",
      description: "এনক্রিপ্টেড ডেটা স্টোরেজ এবং নিরাপদ অ্যাক্সেস নিয়ন্ত্রণ",
      color: "text-red-500",
    },
    {
      icon: Zap,
      title: "দ্রুত অ্যাক্সেস",
      description: "তাৎক্ষণিক রোগীর তথ্য অনুসন্ধান এবং রিপোর্ট তৈরি",
      color: "text-yellow-500",
    },
  ]

  const stats = [
    { number: "১০০০+", label: "সন্তুষ্ট ডাক্তার" },
    { number: "৫০,০০০+", label: "রোগীর রেকর্ড" },
    { number: "৯৯.৯%", label: "আপটাইম" },
    { number: "২৪/৭", label: "সাপোর্ট" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">হোমিওকেয়ার প্রো</span>
          </div>
          <Button
            onClick={loginWithGoogle}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
            Google দিয়ে লগইন
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className={`container mx-auto px-4 py-20 text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">আধুনিক হোমিওপ্যাথিক সমাধান</Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          আপনার ক্লিনিকের জন্য
          <span className="text-primary block">সম্পূর্ণ ডিজিটাল সমাধান</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          রোগীর তথ্য, কনসালটেশন, প্রেসক্রিপশন এবং ক্লিনিক ব্যবস্থাপনার জন্য একটি আধুনিক, নিরাপদ এবং ব্যবহারবান্ধব প্ল্যাটফর্ম
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={loginWithGoogle}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Heart className="w-5 h-5 mr-2" />
            এখনই শুরু করুন
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:bg-primary/5 bg-transparent"
          >
            ডেমো দেখুন
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-500 delay-${index * 100} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">বৈশিষ্ট্যসমূহ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            কেন আমাদের সিস্টেম বেছে নেবেন?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            আধুনিক প্রযুক্তি এবং ব্যবহারকারী-বান্ধব ইন্টারফেসের সমন্বয়ে তৈরি
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group hover:shadow-xl transition-all duration-500 delay-${index * 100} border-0 shadow-md hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">সুবিধাসমূহ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                আপনার ক্লিনিকের দক্ষতা বৃদ্ধি করুন
              </h2>
              <div className="space-y-4">
                {[
                  "কাগজের ফাইলের ঝামেলা থেকে মুক্তি",
                  "রোগীর সম্পূর্ণ ইতিহাস এক জায়গায়",
                  "দ্রুত রিপোর্ট এবং অ্যানালিটিক্স",
                  "নিরাপদ ক্লাউড স্টোরেজ",
                  "যেকোনো ডিভাইস থেকে অ্যাক্সেস",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white">
                <div className="flex items-center mb-4">
                  <Clock className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">সময় সাশ্রয়</h3>
                </div>
                <p className="text-blue-100 mb-6">প্রতিদিন গড়ে ২-৩ ঘন্টা সময় সাশ্রয় করুন এবং আরও বেশি রোগীর সেবা দিন</p>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-300 mr-1" />
                  <Star className="h-5 w-5 text-yellow-300 mr-1" />
                  <Star className="h-5 w-5 text-yellow-300 mr-1" />
                  <Star className="h-5 w-5 text-yellow-300 mr-1" />
                  <Star className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-blue-100">৪.৯/৫ রেটিং</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            আজই শুরু করুন আপনার ডিজিটাল যাত্রা
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            হাজারো ডাক্তারের পছন্দের প্ল্যাটফর্মে যোগ দিন এবং আপনার ক্লিনিকের সেবার মান উন্নত করুন
          </p>
          <Button
            size="lg"
            onClick={loginWithGoogle}
            className="bg-primary hover:bg-primary/90 text-white px-12 py-4 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <Heart className="w-6 h-6 mr-2" />
            বিনামূল্যে শুরু করুন
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="p-2 bg-primary rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">হোমিওকেয়ার প্রো</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; ২০২৪ হোমিওকেয়ার প্রো। সকল অধিকার সংরক্ষিত।</p>
              <p className="mt-1">আধুনিক হোমিওপ্যাথিক ক্লিনিক ব্যবস্থাপনার জন্য</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
