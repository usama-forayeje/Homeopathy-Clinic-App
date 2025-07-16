"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal, Phone, Calendar, User } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with actual data fetching
  const patients = [
    {
      id: "1",
      name: "আহমেদ হাসান",
      age: 35,
      gender: "পুরুষ",
      phoneNumber: "০১৭১২৩৪৫৬৭ৈ",
      lastVisitDate: "২০২৪-০১-১৫",
      totalVisits: 5,
      status: "সক্রিয়",
    },
    {
      id: "2",
      name: "ফাতিমা খাতুন",
      age: 28,
      gender: "মহিলা",
      phoneNumber: "০১৮১২৩৪৫৬৭৮",
      lastVisitDate: "২০২৪-০১-১২",
      totalVisits: 3,
      status: "সক্রিয়",
    },
    {
      id: "3",
      name: "মোহাম্মদ রহিম",
      age: 45,
      gender: "পুরুষ",
      phoneNumber: "০১৯১২৩৪৫৬৭৯",
      lastVisitDate: "২০২৪-০১-১০",
      totalVisits: 8,
      status: "নিষ্ক্রিয়",
    },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.phoneNumber.includes(searchTerm),
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">রোগীসমূহ</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">মোট {patients.length} জন রোগীর তথ্য রয়েছে</p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link href="/dashboard/patients/new">
            <Plus className="h-4 w-4 mr-2" />
            নতুন রোগী যোগ করুন
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
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

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>
                      {patient.gender} • {patient.age} বছর
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/patients/${patient.id}`}>বিস্তারিত দেখুন</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/patients/${patient.id}/edit`}>সম্পাদনা করুন</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/patients/${patient.id}/consultations/new`}>নতুন কনসালটেশন</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                {patient.phoneNumber}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                শেষ ভিজিট: {new Date(patient.lastVisitDate).toLocaleDateString("bn-BD")}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">মোট ভিজিট: {patient.totalVisits}</span>
                <Badge variant={patient.status === "সক্রিয়" ? "default" : "secondary"}>{patient.status}</Badge>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href={`/dashboard/patients/${patient.id}`}>বিস্তারিত দেখুন</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">কোনো রোগী পাওয়া যায়নি</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">আপনার অনুসন্ধানের সাথে মিলে এমন কোনো রোগী নেই।</p>
            <Button asChild>
              <Link href="/dashboard/patients/new">
                <Plus className="h-4 w-4 mr-2" />
                প্রথম রোগী যোগ করুন
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
