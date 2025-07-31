// components/PatientConsultationForm/PrescriptionTab.jsx
"use client"

import { useFormContext } from "react-hook-form"
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
import { useEffect, useState } from "react"

export function PrescriptionTab({
  medicines,
  instructions,
  prescriptionFields,
  appendPrescription,
  removePrescription,
  dosageInstructionFields,
  appendDosageInstruction,
  removeDosageInstruction,
}) {
  const form = useFormContext()

  // Ensure there's at least one prescription field by default
  useEffect(() => {
    if (prescriptionFields.length === 0) {
      appendPrescription("") // Append an empty string for medicine ID
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
      <h3 className="text-lg font-semibold">Prescription Details</h3>

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
    </div>
  )
}