// components/PatientConsultationForm/ConsultationDetailsTab.jsx
"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"
import { useFormStores } from "@/hooks/useFormStores" // To get chambers, medicines, instructions, habitDefinitions

export function ConsultationDetailsTab({
  chiefComplaintFields,
  appendChiefComplaint,
  removeChiefComplaint,
  diagnosisFields,
  appendDiagnosis,
  removeDiagnosis,
  otherComplaintFields,
  appendOtherComplaint,
  removeOtherComplaint,
  // Props for Prescription sub-section
  medicines,
  instructions,
  prescriptionFields,
  appendPrescription,
  removePrescription,
  dosageInstructionFields,
  appendDosageInstruction,
  removeDosageInstruction,
  // Props for Habits sub-section
  habitDefinitions,
  habitFields,
  appendHabit,
  removeHabit,
}) {
  const form = useFormContext()
  const { chambers } = useFormStores()

  // Ensure default chamber is set if available and form field is empty
  useEffect(() => {
    const currentChamberId = form.getValues("consultationDetails.chamberId");
    if (chambers.length > 0 && !currentChamberId) {
      form.setValue("consultationDetails.chamberId", chambers[0].$id);
    }
  }, [chambers]);

  const watchChiefComplaints = form.watch("consultationDetails.chiefComplaint");
  const watchDiagnosis = form.watch("consultationDetails.diagnosis");

  // Add a default empty chief complaint field if none exist
  useEffect(() => {
    if (watchChiefComplaints && watchChiefComplaints.length === 0) {
      appendChiefComplaint("");
    }
  }, [watchChiefComplaints, appendChiefComplaint]);

  // Add a default empty diagnosis field if none exist
  useEffect(() => {
    if (watchDiagnosis && watchDiagnosis.length === 0) {
      appendDiagnosis("");
    }
  }, [watchDiagnosis, appendDiagnosis]);

  // Add a default empty prescription field if none exist
  useEffect(() => {
    if (prescriptionFields.length === 0) {
      appendPrescription("")
    }
  }, [prescriptionFields.length, appendPrescription])

  // Add a default empty dosage instruction field if none exist
  useEffect(() => {
    if (dosageInstructionFields.length === 0) {
      appendDosageInstruction("");
    }
  }, [dosageInstructionFields.length, appendDosageInstruction]);


  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Consultation Basics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="consultationDetails.consultationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consultation Date <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>Chamber <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a chamber" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {chambers.map((chamber) => (
                    <SelectItem key={chamber.$id} value={chamber.$id}>
                      {chamber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consultationDetails.billAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 500" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <h3 className="text-lg font-semibold">Vitals & Measurements</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="consultationDetails.BP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Pressure</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 120/80 mmHg" {...field} />
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
              <FormLabel>Pulse</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 72 bpm" {...field} />
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
                <Input placeholder="e.g., 99.5°F" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <h3 className="text-lg font-semibold">Chief Complaints <span className="text-red-500">*</span></h3>
      {chiefComplaintFields.map((item, index) => (
        <FormField
          key={item.id}
          control={form.control}
          name={`consultationDetails.chiefComplaint.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{index === 0 ? "Chief Complaint" : `Complaint ${index + 1}`}</FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input placeholder="e.g., Headache" {...field} />
                </FormControl>
                <Button type="button" variant="outline" size="sm" onClick={() => appendChiefComplaint("")}>
                  <Plus className="h-4 w-4" />
                </Button>
                {chiefComplaintFields.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeChiefComplaint(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      <Separator />

      <h3 className="text-lg font-semibold">Diagnosis <span className="text-red-500">*</span></h3>
      {diagnosisFields.map((item, index) => (
        <FormField
          key={item.id}
          control={form.control}
          name={`consultationDetails.diagnosis.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{index === 0 ? "Diagnosis" : `Diagnosis ${index + 1}`}</FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input placeholder="e.g., Viral Fever" {...field} />
                </FormControl>
                <Button type="button" variant="outline" size="sm" onClick={() => appendDiagnosis("")}>
                  <Plus className="h-4 w-4" />
                </Button>
                {diagnosisFields.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeDiagnosis(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      <Separator />

      <h3 className="text-lg font-semibold">Medical History</h3>
      <FormField
        control={form.control}
        name="consultationDetails.historyOfPresentIllness"
        render={({ field }) => (
          <FormItem>
            <FormLabel>History of Present Illness</FormLabel>
            <FormControl>
              <Textarea placeholder="Details of the current illness..." {...field} />
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
              <Textarea placeholder="Any relevant family medical history..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      <h3 className="text-lg font-semibold">Other Complaints (Optional)</h3>
      {otherComplaintFields.map((item, index) => (
        <FormField
          key={item.id}
          control={form.control}
          name={`consultationDetails.otherComplaints.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{index === 0 ? "Other Complaint" : `Other Complaint ${index + 1}`}</FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input placeholder="e.g., Mild fatigue" {...field} />
                </FormControl>
                <Button type="button" variant="outline" size="sm" onClick={() => appendOtherComplaint("")}>
                  <Plus className="h-4 w-4" />
                </Button>
                {otherComplaintFields.length > 0 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeOtherComplaint(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      {otherComplaintFields.length === 0 && (
        <Button type="button" variant="outline" size="sm" onClick={() => appendOtherComplaint("")}>
          <Plus className="h-4 w-4 mr-2" /> Add Other Complaint
        </Button>
      )}

      <Separator />

      <h3 className="text-lg font-semibold">On Examination (O/E)</h3>
      <FormField
        control={form.control}
        name="consultationDetails.O_E"
        render={({ field }) => (
          <FormItem>
            <FormLabel>On Examination (O/E)</FormLabel>
            <FormControl>
              <Textarea placeholder="Findings during physical examination..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      {/* Prescription Sub-Section */}
      <h2 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
        <Pill className="h-6 w-6 text-primary" /> Prescription Details
      </h2>
      <div className="space-y-4">
        {prescriptionFields.map((item, index) => (
          <div key={item.id} className="flex flex-col md:flex-row gap-2 items-end">
            <FormField
              control={form.control}
              name={`consultationDetails.prescriptions.${index}`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>{index === 0 ? "Medicine" : `Medicine ${index + 1}`}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a medicine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {medicines.map((med) => (
                        <SelectItem key={med.$id} value={med.$id}>
                          {med.name} ({med.strength})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="icon" onClick={() => appendPrescription("")}>
                <Plus className="h-4 w-4" />
              </Button>
              {prescriptionFields.length > 1 && (
                <Button type="button" variant="outline" size="icon" onClick={() => removePrescription(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <h3 className="text-lg font-semibold">Dosage Instructions</h3>
      <div className="space-y-4">
        {dosageInstructionFields.map((item, index) => (
          <div key={item.id} className="flex flex-col md:flex-row gap-2 items-end">
            <FormField
              control={form.control}
              name={`consultationDetails.dosageInstructions.${index}`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>{index === 0 ? "Instruction" : `Instruction ${index + 1}`}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or type instruction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {instructions.map((inst) => (
                        <SelectItem key={inst.$id} value={inst.value}>
                          {inst.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="icon" onClick={() => appendDosageInstruction("")}>
                <Plus className="h-4 w-4" />
              </Button>
              {dosageInstructionFields.length > 1 && (
                <Button type="button" variant="outline" size="icon" onClick={() => removeDosageInstruction(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <h3 className="text-lg font-semibold">Diet & Lifestyle Advice</h3>
      <FormField
        control={form.control}
        name="consultationDetails.dietAndLifestyleAdvice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Advice (comma-separated for multiple)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Drink plenty of water, Regular exercise, Avoid sugary drinks"
                value={field.value ? field.value.join(", ") : ""}
                onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      <h3 className="text-lg font-semibold">Additional Prescription Notes</h3>
      <FormField
        control={form.control}
        name="consultationDetails.prescriptionNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Any specific notes for the pharmacist or patient</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Dispense with food, Complete the full course" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      {/* Habits Sub-Section */}
      <h2 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
        <Activity className="h-6 w-6 text-primary" /> Patient Habits & Lifestyle
      </h2>
      <p className="text-sm text-muted-foreground">
        Track relevant habits that may impact patient's health.
      </p>

      {habitFields.map((item, index) => (
        <div key={item.id} className="space-y-4 border p-4 rounded-md">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium">Habit #{index + 1}</h4>
            <Button type="button" variant="destructive" size="sm" onClick={() => removeHabit(index)}>
              <Minus className="h-4 w-4 mr-2" /> Remove Habit
            </Button>
          </div>
          <FormField
            control={form.control}
            name={`patientHabits.${index}.habitDefinitionId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Habit Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a habit type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {habitDefinitions.map((habitDef) => (
                      <SelectItem key={habitDef.$id} value={habitDef.$id}>
                        {habitDef.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`patientHabits.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value/Details</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 5 cigarettes/day, 3 times/week" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`patientHabits.${index}.notes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes for this habit</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any additional notes about this specific habit..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      <Button type="button" variant="outline" onClick={() => appendHabit({
        habitDefinitionId: habitDefinitions.length > 0 ? habitDefinitions[0].$id : "",
        value: "",
        notes: "",
      })}>
        <Plus className="h-4 w-4 mr-2" /> Add New Habit
      </Button>


      <Separator />

      <h3 className="text-lg font-semibold">Follow-up Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="consultationDetails.followUpDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Follow-up Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <h3 className="text-lg font-semibold">General Consultation Notes</h3>
      <FormField
        control={form.control}
        name="consultationDetails.notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Any other notes for this consultation</FormLabel>
            <FormControl>
              <Textarea placeholder="Add any additional notes here..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}