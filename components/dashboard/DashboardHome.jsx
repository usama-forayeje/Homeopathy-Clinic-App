"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, Plus, Activity, DollarSign, Stethoscope } from "lucide-react"
import Link from "next/link"
import { StatsCards } from "./StatsCards"
import { RecentPatients } from "./RecentPatients"
import { TodayAppointments } from "./TodayAppointments"
import { QuickActions } from "./QuickActions"
import { RecentActivity } from "./RecentActivity"

export function DashboardHome() {
  return (
    <div className="flex-1 space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">স্বাগতম, ড. সাহেব! 👋</h1>
          <p className="text-muted-foreground">
            আজকের তারিখ: {new Date().toLocaleDateString("bn-BD")} | আজ আপনার ২৮টি অ্যাপয়েন্টমেন্ট রয়েছে
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/patients/new">
              <Plus className="mr-2 h-4 w-4" />
              নতুন রোগী
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/consultations/new">
              <Calendar className="mr-2 h-4 w-4" />
              কনসালটেশন
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">ওভারভিউ</TabsTrigger>
          <TabsTrigger value="patients">রোগীসমূহ</TabsTrigger>
          <TabsTrigger value="appointments">অ্যাপয়েন্টমেন্ট</TabsTrigger>
          <TabsTrigger value="analytics">অ্যানালিটিক্স</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>সাম্প্রতিক কার্যকলাপ</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <RecentActivity />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>আজকের অ্যাপয়েন্টমেন্ট</CardTitle>
                <CardDescription>আজকের নির্ধারিত সময়সূচী</CardDescription>
              </CardHeader>
              <CardContent>
                <TodayAppointments />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>সাম্প্রতিক রোগীসমূহ</CardTitle>
                <CardDescription>সর্বশেষ ভিজিট করা রোগীদের তালিকা</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPatients />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>দ্রুত অ্যাকশন</CardTitle>
                <CardDescription>সাধারণ কাজগুলো দ্রুত সম্পন্ন করুন</CardDescription>
              </CardHeader>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <RecentPatients showAll />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <TodayAppointments showAll />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">এই মাসের আয়</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৮৫,০০০ ৳</div>
                <p className="text-xs text-muted-foreground">+২০.১% গত মাস থেকে</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">নতুন রোগী</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+৪৫</div>
                <p className="text-xs text-muted-foreground">+১৮০.১% গত মাস থেকে</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">কনসালটেশন</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+১২৩</div>
                <p className="text-xs text-muted-foreground">+১৯% গত মাস থেকে</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">সক্রিয় রোগী</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+৫৭৩</div>
                <p className="text-xs text-muted-foreground">+২০১ গত মাস থেকে</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
