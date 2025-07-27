"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "ডা. মোহাম্মদ রহিম",
      title: "হোমিওপ্যাথিক চিকিৎসক",
      location: "ঢাকা",
      rating: 5,
      comment:
        "এই সিস্টেমটি আমার ক্লিনিকের কাজকর্মকে অনেক সহজ করে দিয়েছে। রোগীর তথ্য সংরক্ষণ এবং প্রেসক্রিপশন তৈরি করা এখন অনেক দ্রুত।",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "ডা. ফাতেমা খাতুন",
      title: "সিনিয়র হোমিওপ্যাথ",
      location: "চট্টগ্রাম",
      rating: 5,
      comment: "অসাধারণ একটি সিস্টেম! রোগীর অভ্যাস ট্র্যাকিং ফিচারটি বিশেষভাবে উপকারী। আমার রোগীরাও এই ডিজিটাল সেবায় খুশি।",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "ডা. আব্দুল করিম",
      title: "হোমিওপ্যাথিক কনসালট্যান্ট",
      location: "সিলেট",
      rating: 5,
      comment: "প্রযুক্তির সাথে চিকিৎসার এমন সুন্দর মিশ্রণ আগে দেখিনি। QR কোড দিয়ে প্রেসক্রিপশন দেখার ব্যবস্থাটি চমৎকার।",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300">
            💬 ব্যবহারকারীর মতামত
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ডাক্তারদের অভিজ্ঞতা
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            দেশের বিভিন্ন প্রান্তের হোমিওপ্যাথিক চিকিৎসকদের মতামত
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-gray-900"
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-primary/30" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">"{testimonial.comment}"</p>

                {/* Doctor Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 px-6 py-3 rounded-full shadow-lg">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900 dark:text-white">৪.৯/৫</span>
            <span className="text-gray-600 dark:text-gray-400">গড় রেটিং</span>
            <span className="text-sm text-gray-500 dark:text-gray-500">(৫০০+ রিভিউ)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
