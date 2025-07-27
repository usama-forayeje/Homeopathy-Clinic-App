"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2, Edit, Trash2, MapPin, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/common/PageContainer"
import { AddChamberModal } from "@/components/dialogs/AddChamberModal"
import { useChamberMutations } from "@/hooks/useChambers"
import chamberService from "@/services/chambers"
import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ChambersListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: chambers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chambers"],
    queryFn: () => chambersService.getChambers(),
    staleTime: 5 * 60 * 1000,
  })

  const { deleteChamberMutation } = useChamberMutations()

  const handleDeleteChamber = async (chamberId) => {
    if (confirm("আপনি কি নিশ্চিত যে এই চেম্বারটি মুছে ফেলতে চান?")) {
      await deleteChamberMutation.mutateAsync(chamberId)
    }
  }

  const filteredChambers =
    chambers?.filter(
      (chamber) =>
        chamber.chamberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chamber.location?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">চেম্বার লোড হচ্ছে...</span>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-red-500 p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">ত্রুটি ঘটেছে</h2>
          <p>চেম্বার লোড করতে সমস্যা হয়েছে: {error.message}</p>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">আমার সকল চেম্বার</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">মোট {chambers?.length || 0}টি চেম্বার রয়েছে</p>
          </div>
          <AddChamberModal />
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="চেম্বারের নাম বা অবস্থান দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Chambers Grid */}
        {filteredChambers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "কোনো চেম্বার পাওয়া যায়নি" : "কোনো চেম্বার যোগ করা হয়নি"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো চেম্বার নেই।"
                  : "আপনার প্রথম চেম্বার যোগ করুন এবং রোগী ব্যবস্থাপনা শুরু করুন।"}
              </p>
              {!searchTerm && <AddChamberModal />}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChambers.map((chamber) => (
              <Card key={chamber.$id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {chamber.chamberName}
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {chamber.location || "অবস্থান নির্দিষ্ট নয়"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      সক্রিয়
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{chamber.contactNumber || "ফোন নম্বর নেই"}</span>
                    </div>

                    {chamber.contactPerson && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">যোগাযোগকারী:</span>
                        <span className="ml-2">{chamber.contactPerson}</span>
                      </div>
                    )}

                    {chamber.openingHours && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{chamber.openingHours}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {chamber.notes && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">নোট:</span> {chamber.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                      <Link href={`/dashboard/chambers/${chamber.$id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        এডিট
                      </Link>
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteChamber(chamber.$id)}
                      disabled={deleteChamberMutation.isPending}
                      className="flex-1"
                    >
                      {deleteChamberMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      ডিলিট
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
