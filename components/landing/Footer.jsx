"use client"

import { Stethoscope, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const footerLinks = {
    company: [
      { name: "আমাদের সম্পর্ক��", href: "#about" },
      { name: "সেবাসমূহ", href: "#services" },
      { name: "বৈশিষ্ট্য", href: "#features" },
      { name: "যোগাযোগ", href: "#contact" },
    ],
    support: [
      { name: "সাহায্য কেন্দ্র", href: "/help" },
      { name: "ডকুমেন্টেশন", href: "/docs" },
      { name: "API রেফারেন্স", href: "/api" },
      { name: "স্ট্যাটাস", href: "/status" },
    ],
    legal: [
      { name: "গোপনীয়তা নীতি", href: "/privacy" },
      { name: "ব্যবহারের শর্তাবলী", href: "/terms" },
      { name: "কুকি নীতি", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-700" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-primary rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Popular Homeo Care</span>
                <p className="text-sm text-gray-400">আধুনিক হোমিওপ্যাথিক সেবা</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              বাংলাদেশের সবচেয়ে আধুনিক হোমিওপ্যাথিক ক্লিনিক ম্যানেজমেন্ট সিস্টেম। ডাক্তার এবং রোগীদের জন্য একটি সম্পূর্ণ ডিজিটাল সমাধান।
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+৮৮০ ১৭১২-৩৪৫৬৭৮</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@popularhomeocare.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>ধানমন্ডি, ঢাকা-১২০৫</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">কোম্পানি</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">সাপোর্ট</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">আইনি</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">© ২০২৪ Popular Homeo Care। সকল অধিকার সংরক্ষিত।</div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`text-gray-400 transition-colors duration-200 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
