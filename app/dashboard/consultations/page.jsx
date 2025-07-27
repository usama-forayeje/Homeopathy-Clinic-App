"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Plus, Search, Filter, Calendar, Clock, User, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/common/PageContainer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import consultationsService from "@/services/consultations"
import Link from "next/link"

export default function ConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const {
    data: consultations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["consultations"],
    queryFn: () => consultationsService.getAllConsultations(),
    staleTime: 2 * 60 * 1000,
  })

  const { data: todayConsultations } = useQuery({
    queryKey: ["consultations", "today"],
    queryFn: () => consultationsService.getTodayConsultations(),
    staleTime: 1 * 60 * 1000,
  })

  const filteredConsultations =
    consultations?.filter(
      (consultation) =>
        consultation.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.complaint?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">কনসালটেশন লোড হচ্ছে...</span>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-red-500 p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">ত্রুটি ঘটেছে</h2>
          <p>কনসালটেশন লোড করতে সমস্যা হয়েছে: {error.message}</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">কনসালটেশন ব্যবস্থাপনা</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">সকল কনসালটেশন এবং রোগীর ভিজিট ট্র্যাক করুন</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/patients/new">
              <Plus className="mr-2 h-4 w-4" />
              নতুন কনসালটেশন
            </Link>
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="রোগীর নাম বা অভিযোগ দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                ফিল্টার
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">সকল কনসালটেশন</TabsTrigger>
            <TabsTrigger value="today">আজকের কনসালটেশন</TabsTrigger>
            <TabsTrigger value="upcoming">আসন্ন অ্যাপয়েন্টমেন্ট</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <ConsultationsList consultations={filteredConsultations} />
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            <ConsultationsList consultations={todayConsultations || []} />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">আসন্ন অ্যাপয়েন্টমেন্ট</h3>
              <p className="text-gray-600 dark:text-gray-400">এই ফিচারটি শীঘ্রই আসছে</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}

function ConsultationsList({ consultations }) {
  if (consultations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">কোনো কনসালটেশন পাওয়া যায়নি</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">নতুন রোগী যোগ করে কনসালটেশন শুরু করুন।</p>
          <Button asChild>
            <Link href="/dashboard/patients/new">
              <Plus className="mr-2 h-4 w-4" />
              নতুন কনসালটেশন
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {consultations.map((consultation) => (
        <Card key={consultation.$id} className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {consultation.patientName || "নাম নেই"}
                </CardTitle>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(consultation.date).toLocaleDateString("bn-BD")}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {consultation.time}
                  </span>
                </CardDescription>
              </div>
              <Badge variant="secondary">কনসালটেশন</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">রোগীর অভিযোগ:</h4>
              <p className="text-gray-600 dark:text-gray-400">{consultation.complaint || "কোনো অভিযোগ নেই"}</p>
            </div>

            {consultation.diagnosis && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">রোগ নির্ণয়:</h4>
                <p className="text-gray-600 dark:text-gray-400">{consultation.diagnosis}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span>রোগী ID: {consultation.patientId}</span>
              </div>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/consultations/${consultation.$id}`}>বিস্তারিত দেখুন</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
