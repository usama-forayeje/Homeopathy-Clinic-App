import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function FormHeader({ isEditing, defaultPatient, completedTabs, totalTabs, isSubmitting, submitProgress }) {
  const completionPercentage = Math.round((completedTabs.size / totalTabs) * 100)

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 via-white to-green-50">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          {/* Title and Description */}
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {isEditing ? "Update Patient Consultation" : "New Patient Consultation"}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {isEditing
                ? `Updating consultation for ${defaultPatient?.name || "patient"}`
                : "Complete patient registration and medical consultation"}
            </CardDescription>
          </div>

          {/* Status and Progress */}
          <div className="text-right space-y-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {completedTabs.size}/{totalTabs} Completed
            </Badge>
            {isSubmitting && (
              <div className="space-y-2">
                <Progress value={submitProgress} className="w-32" />
                <p className="text-sm text-muted-foreground">Submitting...</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Progress Indicator */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Form Progress</span>
            <span className="text-sm text-gray-500">{completionPercentage}% Complete</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>
    </Card>
  )
}
