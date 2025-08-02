// components/forms/PatientDetailsForm.jsx
"use client";

import React, { useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import { VoiceInput } from "../common/VoiceInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label"; // Imported Label for RadioGroup
import { DatePicker } from "../ui/datePicker";

// Static options - NEVER change these
const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Age calculation hook - MODIFIED for stability
export function useAutoAgeCalculation(form) {
  const watchDob = form.watch("patientDetails.dob");
  const currentAge = form.watch("patientDetails.age");

  useEffect(() => {
    if (watchDob) {
      const birthDate = new Date(watchDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // Only update if the calculated age is different from the current age in the form
      // and within a reasonable range (0-150 years)
      if (age >= 0 && age <= 150 && age !== currentAge) {
        form.setValue("patientDetails.age", age, { shouldValidate: false, shouldDirty: true });
      } else if ((age < 0 || age > 150) && currentAge !== 0) { // If calculated age is out of range, set to 0 if not already
        form.setValue("patientDetails.age", 0, { shouldValidate: false, shouldDirty: true });
      }
    } else if (currentAge !== 0 && !isNaN(currentAge)) { // If DOB is cleared, clear age to 0, but only if age isn't already 0 or NaN
      form.setValue("patientDetails.age", 0, { shouldValidate: false, shouldDirty: true });
    }
  }, [watchDob, form, currentAge]); // Added currentAge to dependencies
}

export function PatientDetailsForm({ onNextTab }) {
  const form = useFormContext();
  const { trigger, setFocus } = form;

  // Use the auto age calculation hook
  useAutoAgeCalculation(form);

  const handleNext = useCallback(async () => {
    // Validate all required fields in the patientDetails section before proceeding
    const isValid = await trigger([
      "patientDetails.patientId", // Even if disabled, if schema requires it, trigger validation
      "patientDetails.serialNumber",
      "patientDetails.name",
      "patientDetails.age",
      "patientDetails.gender",
      "patientDetails.phoneNumber",
      // "patientDetails.firstConsultationDate" // This field is derived/set on submission, so no direct validation needed here.
    ], { shouldFocus: true }); // shouldFocus to auto-scroll to the first error field

    if (isValid) {
      onNextTab("consultation");
    } else {
      // Manual focus to the first error if trigger fails to focus (as a fallback)
      const errors = form.formState.errors;
      const firstErrorField = Object.keys(errors).find(key => key.startsWith("patientDetails."));
      if (firstErrorField) {
        setFocus(firstErrorField);
      }
    }
  }, [trigger, onNextTab, form, setFocus]);

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
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patientDetails.patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Patient ID</FormLabel>
                <FormControl>
                  <Input placeholder="Auto-generated ID" className="h-11" {...field} disabled />
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
                <FormLabel className="text-base font-medium">Serial Number *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 001" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="patientDetails.dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Date of Birth</FormLabel>
                <FormControl>
                  {/* Using DatePicker component for better UX */}
                  <DatePicker
                    value={field.value}
                    onSelect={field.onChange}
                    placeholder="Select Date of Birth"
                  />
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
                <FormLabel className="text-base font-medium">Age *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Years"
                    className="h-11"
                    {...field}
                    onChange={(e) => {
                      // Allow empty string to clear the input, otherwise convert to number
                      const value = e.target.value === "" ? "" : Number(e.target.value);
                      field.onChange(value);
                    }}
                    readOnly={!!form.watch("patientDetails.dob")} // Make readonly if DOB is present
                  />
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
                <FormLabel className="text-base font-medium">Gender *</FormLabel>
                <FormControl> {/* FormControl wraps RadioGroup directly */}
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-wrap gap-4 pt-2" // Added pt-2 for spacing
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`gender-${option.toLowerCase().replace(/\s/g, '-')}`} />
                        <Label htmlFor={`gender-${option.toLowerCase().replace(/\s/g, '-')}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="patientDetails.bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Blood Group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""} // Ensure controlled component
                >
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
        </div>

        <Separator />

        {/* Address & Notes */}
        <div className="space-y-6">
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

          <FormField
            control={form.control}
            name="patientDetails.notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Additional Notes</FormLabel>
                <FormControl>
                  <VoiceInput
                    component={Textarea}
                    placeholder="Any special notes or allergies"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-end pt-4">
          <Button
            type="button"
            onClick={handleNext}
            className="px-8"
          >
            Next: Consultation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}