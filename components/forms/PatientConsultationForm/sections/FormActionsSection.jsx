"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, X } from "lucide-react"

/**
 * Form Actions Section Component
 *
 * This section handles:
 * - Form submission button with loading states
 * - Cancel button functionality
 * - Progress indicators
 * - Form validation status display
 *
 * Key Features:
 * - Visual progress tracking
 * - Loading states during submission
 * - Form completion status
 * - Debug information in development
 *
 * @param {Object} props - Component props
 * @param {boolean} isLoading - Loading state from parent
 * @param {boolean} isSubmitting - Whether form is being submitted
 * @param {boolean} isEditing - Whether we're editing existing data
 * @param {Function} onCancel - Cancel handler function
 * @param {Set} completedTabs - Set of completed tab IDs
 * @param {number} totalTabs - Total number of tabs
 * @param {Array} tabsArray - Array of tab IDs
 * @param {boolean} isFormDisabled - Whether the form is disabled
 */
export function FormActionsSection({
  isLoading,
  isSubmitting,
  isEditing,
  onCancel,
  completedTabs,
  totalTabs,
  tabsArray,
  isFormDisabled,
}) {
  console.log("🎬 FormActionsSection: Component rendered")
  console.log("📊 Form status:", {
    isLoading,
    isSubmitting,
    isEditing,
    completedTabs: completedTabs.size,
    totalTabs,
    isFormDisabled,
  })

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Submit Button */}
          <Button type="submit" className="flex-1 h-12 text-base font-semibold" disabled={isFormDisabled}>
            {(isLoading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Patient & Consultation" : "Create Patient & Consultation"}
          </Button>

          {/* Cancel Button */}
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 text-base font-semibold bg-transparent"
              disabled={isFormDisabled}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Progress: {completedTabs.size}/{totalTabs} sections completed
          </div>
          <div className="flex space-x-2">
            {tabsArray.map((tab) => (
              <div
                key={tab}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  completedTabs.has(tab) ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Debug: Submitting: {isSubmitting ? "Yes" : "No"} | Loading: {isLoading ? "Yes" : "No"} | Disabled:{" "}
              {isFormDisabled ? "Yes" : "No"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
