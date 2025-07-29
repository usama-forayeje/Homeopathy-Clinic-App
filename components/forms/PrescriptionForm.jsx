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
import { VoiceInput } from "../common/VoiceInput"

export function PrescriptionForm({ onNextTab, onPreviousTab, medicines, instructions }) {
  const form = useFormContext()

  const {
    fields: prescriptionFields,
    append: appendPrescription,
    remove: removePrescription,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.prescriptions",
  })

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.dosageInstructions",
  })

  const {
    fields: adviceFields,
    append: appendAdvice,
    remove: removeAdvice,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.dietAndLifestyleAdvice",
  })

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
        {/* Medicines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Prescribed Medicines</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPrescription({ medicineId: "", dosage: "", notes: "" })}
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
                    <Button type="button" variant="outline" size="sm" onClick={() => removePrescription(index)}>
                      <Minus className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`consultationDetails.prescriptions.${index}.medicineId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Medicine</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
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

        {/* Dosage Instructions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Dosage Instructions</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => appendInstruction("")}>
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
                          <Select onValueChange={field.onChange} value={field.value || ""}>
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
                <Button type="button" variant="outline" size="icon" onClick={() => removeInstruction(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Diet & Lifestyle Advice */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Diet & Lifestyle Advice</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => appendAdvice("")}>
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
                <Button type="button" variant="outline" size="icon" onClick={() => removeAdvice(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

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

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => onPreviousTab("consultation")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="button" onClick={() => onNextTab("habits")}>
            Next: Habits
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}