"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Plus, Minus, Pill } from "lucide-react"
import { VoiceInput } from "@/components/common/VoiceInput"

/**
 * Prescription Section Component
 *
 * This section handles:
 * - Medicine prescriptions with dosage
 * - Dosage instructions (predefined and custom)
 * - Diet and lifestyle advice
 * - Prescription notes
 *
 * Key Features:
 * - Dynamic arrays for prescriptions, instructions, and advice
 * - Medicine selection from available medicines
 * - Instruction selection from predefined options or custom input
 * - Voice input support for text fields
 *
 * @param {Object} props - Component props
 * @param {Function} onNextTab - Function to navigate to next tab
 * @param {Function} onPreviousTab - Function to navigate to previous tab
 * @param {Array} medicines - Available medicines from store
 * @param {Array} instructions - Available instructions from store
 */
export function PrescriptionSection({ onNextTab, onPreviousTab, medicines, instructions }) {
  const form = useFormContext()

  console.log("💊 PrescriptionSection: Component rendered")
  console.log("💊 Available medicines:", medicines?.length || 0)
  console.log("📋 Available instructions:", instructions?.length || 0)

  // ========================================== DYNAMIC ARRAYS ==========================================
  /**
   * Prescriptions - Dynamic array management
   */
  const {
    fields: prescriptionFields,
    append: appendPrescription,
    remove: removePrescription,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.prescriptions",
  })

  /**
   * Dosage Instructions - Dynamic array management
   */
  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.dosageInstructions",
  })

  /**
   * Diet & Lifestyle Advice - Dynamic array management
   */
  const {
    fields: adviceFields,
    append: appendAdvice,
    remove: removeAdvice,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.dietAndLifestyleAdvice",
  })

  // ========================================== RENDER ==========================================
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Pill className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          Prescription & Treatment
        </CardTitle>
        <CardDescription>Medicine prescriptions and treatment instructions</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* ========================================== MEDICINES ========================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Prescribed Medicines</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                appendPrescription({ medicineId: "", dosage: "", notes: "" })
                console.log("➕ Added new prescription field")
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>

          {prescriptionFields.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No medicines prescribed yet</p>
              <p className="text-sm">Click "Add Medicine" to start prescribing</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptionFields.map((fieldItem, index) => (
                <Card key={fieldItem.id} className="p-4 border-l-4 border-l-purple-500">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Medicine {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        removePrescription(index)
                        console.log(`➖ Removed prescription ${index + 1}`)
                      }}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {/* Medicine Selection */}
                    <FormField
                      control={form.control}
                      name={`consultationDetails.prescriptions.${index}.medicineId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Medicine</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              console.log(`💊 Selected medicine ID for prescription ${index + 1}:`, value)
                            }}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Choose medicine" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {medicines?.map((medicine) => (
                                <SelectItem key={medicine.$id} value={medicine.$id}>
                                  <div>
                                    <div className="font-medium">{medicine.medicineName}</div>
                                    {medicine.potency && (
                                      <div className="text-xs text-muted-foreground">Potency: {medicine.potency}</div>
                                    )}
                                  </div>
                                </SelectItem>
                              )) || []}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Dosage */}
                    <FormField
                      control={form.control}
                      name={`consultationDetails.prescriptions.${index}.dosage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2 drops, 3 times daily" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name={`consultationDetails.prescriptions.${index}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Additional notes for this medicine"
                              className="min-h-[60px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* ========================================== DOSAGE INSTRUCTIONS ========================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Dosage Instructions</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                appendInstruction("")
                console.log("➕ Added new instruction field")
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Instruction
            </Button>
          </div>
          <div className="space-y-3">
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <FormField
                  control={form.control}
                  name={`consultationDetails.dosageInstructions.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex gap-3">
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              console.log(`📋 Selected instruction ${index + 1}:`, value)
                            }}
                            value={field.value || ""}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select instruction" />
                            </SelectTrigger>
                            <SelectContent>
                              {instructions?.map((instruction) => (
                                <SelectItem key={instruction.$id} value={instruction.instructionText}>
                                  {instruction.instructionText}
                                </SelectItem>
                              )) || []}
                            </SelectContent>
                          </Select>
                          <VoiceInput
                            component={Input}
                            placeholder="Or type custom instruction"
                            className="h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    removeInstruction(index)
                    console.log(`➖ Removed instruction ${index + 1}`)
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* ========================================== DIET & LIFESTYLE ADVICE ========================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Diet & Lifestyle Advice</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                appendAdvice("")
                console.log("➕ Added new advice field")
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Advice
            </Button>
          </div>
          <div className="space-y-3">
            {adviceFields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <FormField
                  control={form.control}
                  name={`consultationDetails.dietAndLifestyleAdvice.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <VoiceInput
                          component={Input}
                          placeholder={`Lifestyle advice ${index + 1}`}
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    removeAdvice(index)
                    console.log(`➖ Removed advice ${index + 1}`)
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription Notes */}
        <FormField
          control={form.control}
          name="consultationDetails.prescriptionNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prescription Notes</FormLabel>
              <FormControl>
                <VoiceInput
                  component={Textarea}
                  placeholder="Additional prescription notes"
                  className="min-h-[100px]"
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
              console.log("⬅️ Navigating back to consultation tab")
              onPreviousTab("consultation")
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              console.log("➡️ Navigating to habits tab")
              onNextTab("habits")
            }}
          >
            Next: Habits
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
