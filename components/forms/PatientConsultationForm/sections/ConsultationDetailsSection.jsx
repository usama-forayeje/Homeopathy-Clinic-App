"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Plus, Minus, Stethoscope } from "lucide-react"
import { VoiceInput } from "@/components/common/VoiceInput"

/**
 * Consultation Details Section Component
 *
 * This section handles:
 * - Basic consultation information (date, chamber, time)
 * - Vital signs (BP, Pulse, Temperature)
 * - Chief complaints (multiple entries supported)
 * - Medical history and examination
 * - Diagnosis (multiple entries supported)
 * - Follow-up and billing information
 *
 * Key Features:
 * - Dynamic arrays for complaints and diagnoses
 * - Chamber selection with details
 * - Vital signs tracking
 * - Medical history documentation
 * - Validation for required fields
 *
 * @param {Object} props - Component props
 * @param {Function} onNextTab - Function to navigate to next tab
 * @param {Function} onPreviousTab - Function to navigate to previous tab
 * @param {Array} chambers - Available chambers from store
 */
export function ConsultationDetailsSection({ onNextTab, onPreviousTab, chambers }) {
  const form = useFormContext()

  console.log("🩺 ConsultationDetailsSection: Component rendered")
  console.log("🏥 Available chambers:", chambers)

  // ========================================== DYNAMIC ARRAYS ==========================================
  /**
   * Chief Complaints - Dynamic array management
   */
  const {
    fields: complaintFields,
    append: appendComplaint,
    remove: removeComplaint,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.chiefComplaint",
  })

  /**
   * Diagnosis - Dynamic array management
   */
  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.diagnosis",
  })

  // ========================================== FORM VALIDATION ==========================================
  /**
   * Check if consultation tab is complete for navigation
   */
  const consultationDetailsDate = form.watch("consultationDetails.consultationDate")
  const consultationDetailsChamberId = form.watch("consultationDetails.chamberId")
  const consultationDetailsChiefComplaint = form.watch("consultationDetails.chiefComplaint")
  const consultationDetailsDiagnosis = form.watch("consultationDetails.diagnosis")

  const isConsultationTabComplete =
    consultationDetailsDate &&
    consultationDetailsChamberId &&
    consultationDetailsChiefComplaint?.some((c) => c && c.trim()) &&
    consultationDetailsDiagnosis?.some((d) => d && d.trim())

  console.log("✅ Consultation tab completion status:", {
    date: !!consultationDetailsDate,
    chamber: !!consultationDetailsChamberId,
    complaints: consultationDetailsChiefComplaint?.some((c) => c && c.trim()),
    diagnosis: consultationDetailsDiagnosis?.some((d) => d && d.trim()),
    isComplete: isConsultationTabComplete,
  })

  // ========================================== RENDER ==========================================
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          Consultation Details
        </CardTitle>
        <CardDescription>Medical examination and diagnosis information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* ========================================== BASIC CONSULTATION INFO ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consultation Date - Required */}
          <FormField
            control={form.control}
            name="consultationDetails.consultationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Consultation Date *</FormLabel>
                <FormControl>
                  <Input type="date" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Chamber Selection - Required */}
          <FormField
            control={form.control}
            name="consultationDetails.chamberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Chamber *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    console.log("🏥 Selected chamber ID:", value)
                  }}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select chamber" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {chambers?.map((chamber) => (
                      <SelectItem key={chamber.$id} value={chamber.$id}>
                        <div>
                          <div className="font-medium">{chamber.chamberName}</div>
                          <div className="text-xs text-muted-foreground">{chamber.location}</div>
                        </div>
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* ========================================== VITAL SIGNS ========================================== */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vital Signs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Blood Pressure */}
            <FormField
              control={form.control}
              name="consultationDetails.BP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Pressure</FormLabel>
                  <FormControl>
                    <Input placeholder="120/80 mmHg" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pulse Rate */}
            <FormField
              control={form.control}
              name="consultationDetails.Pulse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pulse Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="72 bpm" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Temperature */}
            <FormField
              control={form.control}
              name="consultationDetails.Temp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                    <Input placeholder="98.6°F" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* ========================================== CHIEF COMPLAINTS ========================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Chief Complaints *</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                appendComplaint("")
                console.log("➕ Added new chief complaint field")
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {complaintFields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <FormField
                  control={form.control}
                  name={`consultationDetails.chiefComplaint.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <VoiceInput
                          component={Textarea}
                          placeholder={`Chief complaint ${index + 1}`}
                          className="min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {complaintFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      removeComplaint(index)
                      console.log(`➖ Removed chief complaint ${index + 1}`)
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* ========================================== HISTORY & EXAMINATION ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Patient History Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Patient History</h3>

            {/* Current Symptoms */}
            <FormField
              control={form.control}
              name="consultationDetails.symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Symptoms</FormLabel>
                  <FormControl>
                    <VoiceInput
                      component={Textarea}
                      placeholder="Describe symptoms"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* History of Present Illness */}
            <FormField
              control={form.control}
              name="consultationDetails.historyOfPresentIllness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>History of Present Illness</FormLabel>
                  <FormControl>
                    <VoiceInput
                      component={Textarea}
                      placeholder="Timeline and progression"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Family History */}
            <FormField
              control={form.control}
              name="consultationDetails.familyHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family History</FormLabel>
                  <FormControl>
                    <VoiceInput
                      component={Textarea}
                      placeholder="Family medical history"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Physical Examination Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Physical Examination</h3>

            {/* On Examination */}
            <FormField
              control={form.control}
              name="consultationDetails.O_E"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>On Examination</FormLabel>
                  <FormControl>
                    <VoiceInput
                      component={Textarea}
                      placeholder="Physical examination findings"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Diagnosis Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-medium">Diagnosis *</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    appendDiagnosis("")
                    console.log("➕ Added new diagnosis field")
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {diagnosisFields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <FormField
                    control={form.control}
                    name={`consultationDetails.diagnosis.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <VoiceInput
                            component={Input}
                            placeholder={`Diagnosis ${index + 1}`}
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {diagnosisFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        removeDiagnosis(index)
                        console.log(`➖ Removed diagnosis ${index + 1}`)
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* ========================================== FOLLOW-UP AND BILLING ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Follow-up Date */}
          <FormField
            control={form.control}
            name="consultationDetails.followUpDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follow-up Date</FormLabel>
                <FormControl>
                  <Input type="date" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bill Amount */}
          <FormField
            control={form.control}
            name="consultationDetails.billAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="h-11"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Notes */}
        <FormField
          control={form.control}
          name="consultationDetails.notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <VoiceInput
                  component={Textarea}
                  placeholder="Any additional consultation notes"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ========================================== NAVIGATION ========================================== */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              console.log("⬅️ Navigating back to patient tab")
              onPreviousTab("patient")
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              console.log("➡️ Navigating to prescription tab")
              onNextTab("prescription")
            }}
            disabled={!isConsultationTabComplete}
          >
            Next: Prescription <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
