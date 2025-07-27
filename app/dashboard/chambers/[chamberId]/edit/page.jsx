"use client"

import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ChamberForm } from "@/components/forms/ChamberForm"
import { useChamberMutations } from "@/hooks/useChambers"
import chambersService from "@/services/chambers"
import { Loader2, ArrowLeft } from "lucide-react"
import { PageContainer } from "@/components/common/PageContainer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export default function EditChamberPage({ params }) {
  const actualParams = React.use(params)
  const { chamberId } = actualParams
  const router = useRouter()
  const { updateChamberMutation } = useChamberMutations()

  const {
    data: chamber,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chamber", chamberId],
    queryFn: () => chambersService.getChamberById(chamberId),
    enabled: !!chamberId,
  })

  const handleSubmit = async (values) => {
    try {
      await updateChamberMutation.mutateAsync({ chamberId, data: values })
      router.push("/dashboard/chambers")
    } catch (error) {
      console.error("চেম্বার আপডেট করতে সমস্যা হয়েছে:", error)
    }
  }

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

  if (!chamber) {
    return (
      <PageContainer>
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-2">চেম্বার পাওয়া যায়নি</h2>
          <p className="text-gray-600 dark:text-gray-400">নির্দিষ্ট চেম্বারটি খুঁজে পাওয়া যায়নি।</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/chambers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">চেম্বার এডিট করুন</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{chamber.chamberName} এর তথ্য আপডেট করুন।</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <ChamberForm onSubmit={handleSubmit} defaultValues={chamber} isLoading={updateChamberMutation.isPending} />
        </div>
      </div>
    </PageContainer>
  )
}
