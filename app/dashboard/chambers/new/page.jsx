"use client"

import { ChamberForm } from "@/components/forms/ChamberForm"
import { useChamberMutations } from "@/hooks/useChamberMutations"
import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/common/PageContainer"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AddNewChamberPage() {
  const { createChamberMutation } = useChamberMutations()
  const router = useRouter()

  const handleSubmit = async (values) => {
    try {
      await createChamberMutation.mutateAsync(values)
      router.push("/dashboard/chambers")
    } catch (error) {
      console.error("চেম্বার তৈরি করতে সমস্যা হয়েছে:", error)
    }
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">নতুন চেম্বার যোগ করুন</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">নিচের ফর্মটি পূরণ করে আপনার নতুন চেম্বার ডেটাবেসে যোগ করুন।</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <ChamberForm onSubmit={handleSubmit} isLoading={createChamberMutation.isPending} />
        </div>
      </div>
    </PageContainer>
  )
}
