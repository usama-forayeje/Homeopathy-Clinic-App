"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight, User } from "lucide-react"
import { VoiceInput } from "@/components/common/VoiceInput"

// Static options - NEVER change these
const GENDER_OPTIONS = ["Male", "Female", "Other"]
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

/**
 * Patient Details Section Component
 *
 * This section handles:
 * - Basic patient information (name, age, gender, etc.)
 * - Contact information (phone, address)
 * - Medical information (blood group)
 * - Administrative information (patient ID, serial number)
 * - Auto-calculation of age from date of birth
 *
 * Key Features:
 * - Auto-generates patient ID for new patients
 * - Calculates age automatically when DOB is entered
 * - Validates required fields before allowing navigation
 * - Supports voice input for text fields
 *
 * @param {Object} props - Component props
 * @param {Function} onNextTab - Function to navigate to next tab
 */
export function PatientDetailsSection({ onNextTab }) {
  const form = useFormContext()

  console.log("🏥 PatientDetailsSection: Component rendered")

  // ========================================== AUTO AGE CALCULATION ==========================================
  /**
   * Auto-calculate age when date of birth changes
   */
  const watchDob = form.watch("patientDetails.dob")
  useEffect(() => {
    if (watchDob) {
      const birthDate = new Date(watchDob)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age >= 0 && age <= 150) {
        form.setValue("patientDetails.age", age, { shouldValidate: false })
        console.log(`📅 Auto-calculated age: ${age} years from DOB: ${watchDob}`)
      } else {
        form.setValue("patientDetails.age", 0, { shouldValidate: false })
        console.log("⚠️ Invalid age calculated, set to 0")
      }
    }
  }, [watchDob, form])

  // ========================================== FORM VALIDATION ==========================================
  /**
   * Check if patient tab is complete for navigation
   */
  const patientDetailsName = form.watch("patientDetails.name")
  const patientDetailsAge = form.watch("patientDetails.age")
  const patientDetailsPhoneNumber = form.watch("patientDetails.phoneNumber")
  const patientDetailsGender = form.watch("patientDetails.gender")

  const isPatientTabComplete =
    patientDetailsName?.trim() && patientDetailsAge > 0 && patientDetailsPhoneNumber?.trim() && patientDetailsGender

  console.log("✅ Patient tab completion status:", {
    name: !!patientDetailsName?.trim(),
    age: patientDetailsAge > 0,
    phone: !!patientDetailsPhoneNumber?.trim(),
    gender: !!patientDetailsGender,
    isComplete: isPatientTabComplete,
  })

  // ========================================== RENDER ==========================================
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          Patient Information
        </CardTitle>
        <CardDescription>Enter patient demographics and contact details</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* ========================================== BASIC INFORMATION ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Name - Required */}
          <FormField
            control={form.control}
            name="patientDetails.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Patient Name *</FormLabel>
                <FormControl>
                  <VoiceInput component={Input} placeholder="Enter full name" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Patient ID - Auto-generated, Read-only */}
          <FormField
            control={form.control}
            name="patientDetails.patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Patient ID *</FormLabel>
                <FormControl>
                  <Input placeholder="Auto-generated ID" className="h-11 bg-gray-50" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth - Optional, triggers age calculation */}
          <FormField
            control={form.control}
            name="patientDetails.dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age - Required, auto-calculated from DOB */}
          <FormField
            control={form.control}
            name="patientDetails.age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Age *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Years"
                    className="h-11"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : Number(e.target.value)
                      field.onChange(value)
                    }}
                    readOnly={!!watchDob}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender - Required */}
          <FormField
            control={form.control}
            name="patientDetails.gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Gender *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number - Required */}
          <FormField
            control={form.control}
            name="patientDetails.phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="+880 1XXX-XXXXXX" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Serial Number - Doctor enters this */}
          <FormField
            control={form.control}
            name="patientDetails.serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="Doctor will enter serial number" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Blood Group - Optional */}
          <FormField
            control={form.control}
            name="patientDetails.bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Blood Group</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BLOOD_GROUP_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Occupation - Optional */}
          <FormField
            control={form.control}
            name="patientDetails.occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Occupation</FormLabel>
                <FormControl>
                  <VoiceInput component={Input} placeholder="Patient's occupation" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* ========================================== ADDRESS & NOTES ========================================== */}
        <div className="space-y-6">
          {/* Address - Optional */}
          <FormField
            control={form.control}
            name="patientDetails.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Address</FormLabel>
                <FormControl>
                  <VoiceInput component={Textarea} placeholder="Complete address" className="min-h-[80px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes - Optional */}
          <FormField
            control={form.control}
            name="patientDetails.notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Additional Notes</FormLabel>
                <FormControl>
                  <VoiceInput
                    component={Textarea}
                    placeholder="Any special notes, allergies, or important information"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ========================================== NAVIGATION ========================================== */}
        <div className="flex justify-end pt-4">
          <Button
            type="button"
            onClick={() => {
              console.log("➡️ Navigating to consultation tab")
              onNextTab("consultation")
            }}
            disabled={!isPatientTabComplete}
            className="px-8"
          >
            Next: Consultation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
