// components/dashboard/DashboardHome.jsx
"use client";

import React from 'react'; // Added React import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, FileText, TrendingUp, Clock, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

// You will replace these mock data with actual data fetched from Appwrite using React Query
export function DashboardHome() {
  const stats = [
    {
      title: "মোট রোগী",
      value: "১,২৩৪",
      change: "+১২%",
      changeType: "positive",
      icon: Users,
      color: "text-primary", // Using primary color
      bgColor: "bg-primary/10", // Using primary color with opacity
    },
    {
      title: "আজকের কনসালটেশন",
      value: "২৮",
      change: "+৮%",
      changeType: "positive",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "এই মাসের প্রেসক্রিপশন",
      value: "৫৬৭",
      change: "+১৫%",
      changeType: "positive",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "মাসিক আয়",
      value: "৮৫,০০০ ৳",
      change: "+২২%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentPatients = [
    { name: "আহমেদ হাসান", age: 35, lastVisit: "২ ঘন্টা আগে", status: "নতুন" },
    { name: "ফাতিমা খাতুন", age: 28, lastVisit: "৫ ঘন্টা আগে", status: "ফলো-আপ" },
    { name: "মোহাম্মদ রহিম", age: 45, lastVisit: "১ দিন আগে", status: "চিকিৎসাধীন" },
    { name: "সালমা বেগম", age: 32, lastVisit: "২ দিন আগে", status: "সুস্থ" },
    { name: "করিম উদ্দিন", age: 52, lastVisit: "৩ দিন আগে", status: "ফলো-আপ" },
  ];

  const upcomingAppointments = [
    { time: "১০:০০ AM", patient: "রাশিদা খাতুন", type: "নতুন কনসালটেশন" },
    { time: "১১:৩০ AM", patient: "আব্দুল করিম", type: "ফলো-আপ" },
    { time: "২:০০ PM", patient: "নাসির উদ্দিন", type: "চেক-আপ" },
    { time: "৩:৩০ PM", patient: "রোকেয়া বেগম", type: "নতুন কনসালটেশন" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">স্বাগতম, ড. সাহেব! 👋</h1>
          <p className="mt-2 text-muted-foreground">
            আজকের তারিখ: {new Date().toLocaleDateString("bn-BD")} | আজ আপনার ২৮টি অ্যাপয়েন্টমেন্ট রয়েছে
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button asChild>
            <Link href="/dashboard/patients/new">
              <Plus className="h-4 w-4 mr-2" />
              নতুন রোগী
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/consultations/new">
              <Calendar className="h-4 w-4 mr-2" />
              কনসালটেশন
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center mt-1">
                <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">গত মাস থেকে</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">সাম্প্রতিক রোগীসমূহ</CardTitle>
                <CardDescription className="text-muted-foreground">সর্বশেষ ভিজিট করা রোগীদের তালিকা</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/patients">
                  সব দেখুন
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">{patient.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        বয়স: {patient.age} | {patient.lastVisit}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      patient.status === "নতুন"
                        ? "default"
                        : patient.status === "ফলো-আপ"
                          ? "secondary"
                          : patient.status === "সুস্থ"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {patient.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">আজকের অ্যাপয়েন্টমেন্ট</CardTitle>
                <CardDescription className="text-muted-foreground">আজকের নির্ধারিত সময়সূচী</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/consultations">
                  সব দেখুন
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{appointment.patient}</p>
                      <span className="text-sm font-medium text-primary">{appointment.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">দ্রুত অ্যাকশন</CardTitle>
          <CardDescription className="text-muted-foreground">সাধারণ কাজগুলো দ্রুত সম্পন্ন করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/dashboard/patients/new">
                <Users className="h-6 w-6" />
                <span>নতুন রোগী যোগ করুন</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/dashboard/consultations/new">
                <Calendar className="h-6 w-6" />
                <span>কনসালটেশন শুরু করুন</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/dashboard/prescriptions">
                <FileText className="h-6 w-6" />
                <span>প্রেসক্রিপশন দেখুন</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}