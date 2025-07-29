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
import { VoiceInput } from "../common/VoiceInput"

export function ConsultationDetailsForm({ onNextTab, onPreviousTab, chambers }) {
  const form = useFormContext()

  const {
    fields: complaintFields,
    append: appendComplaint,
    remove: removeComplaint,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.chiefComplaint",
  })

  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = useFieldArray({
    control: form.control,
    name: "consultationDetails.diagnosis",
  })

  const consultationDetailsDate = form.watch("consultationDetails.consultationDate")
  const consultationDetailsChamberId = form.watch("consultationDetails.chamberId")
  const consultationDetailsChiefComplaint = form.watch("consultationDetails.chiefComplaint")
  const consultationDetailsDiagnosis = form.watch("consultationDetails.diagnosis")

  const isConsultationTabComplete =
    consultationDetailsDate &&
    consultationDetailsChamberId &&
    consultationDetailsChiefComplaint?.some((c) => c && c.trim()) &&
    consultationDetailsDiagnosis?.some((d) => d && d.trim())

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
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField
            control={form.control}
            name="consultationDetails.chamberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Chamber *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
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

        {/* Vital Signs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vital Signs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Chief Complaints */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Chief Complaints *</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => appendComplaint("")}>
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
                    className="cursor-pointer bg-transparent"
                    variant="outline"
                    size="icon"
                    onClick={() => removeComplaint(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* History & Examination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Patient History</h3>

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

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Physical Examination</h3>

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

            {/* Diagnosis */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-medium">Diagnosis *</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => appendDiagnosis("")}>
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
                    <Button type="button" variant="outline" size="icon" onClick={() => removeDiagnosis(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Follow-up and Billing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => onPreviousTab("patient")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="button" onClick={() => onNextTab("prescription")} disabled={!isConsultationTabComplete}>
            Next: Prescription <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}