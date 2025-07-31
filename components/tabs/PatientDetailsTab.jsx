// components/PatientConsultationForm/PatientDetailsTab.jsx
"use client"

import { useFormContext, Controller } from "react-hook-form"
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
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useEffect } from "react"

export function PatientDetailsTab({ isEditing }) {
  const form = useFormContext()

  // Auto-calculate age from DOB if DOB is provided
  const watchDob = form.watch("patientDetails.dob")
  useEffect(() => {
    const currentAge = form.getValues("patientDetails.age");
    if (watchDob) {
      const today = new Date()
      const birthDate = new Date(watchDob)
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      if (currentAge !== age) {
        form.setValue("patientDetails.age", age, { shouldValidate: true })
      }
    } else {
      if (currentAge !== 0) {
        form.setValue("patientDetails.age", 0, { shouldValidate: true })
      }
    }
  }, [watchDob]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Patient Demographics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="patientDetails.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientDetails.age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 30" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientDetails.dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientDetails.gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Unknown">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientDetails.phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g., 01712345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientDetails.address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main St, City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <h3 className="text-lg font-semibold">Other Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="patientDetails.occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientDetails.serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g., P2023-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientDetails.bloodGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Group</FormLabel>
              <FormControl>
                <Input placeholder="e.g., A+" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <h3 className="text-lg font-semibold">General Notes</h3>
      <FormField
        control={form.control}
        name="patientDetails.notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Any general notes about the patient</FormLabel>
            <FormControl>
              <Textarea placeholder="Any other relevant information about the patient..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}