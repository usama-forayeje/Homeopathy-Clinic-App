import React, { useEffect } from "react";
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

// Static options - NEVER change these
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Age calculation hook
export function useAutoAgeCalculation(form) {
  const watchDob = form.watch("patientDetails.dob");

  useEffect(() => {
    if (watchDob) {
      const birthDate = new Date(watchDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age >= 0 && age <= 150) {
        form.setValue("patientDetails.age", age, { shouldValidate: false });
      } else {
        form.setValue("patientDetails.age", 0, { shouldValidate: false });
      }
    }
  }, [watchDob, form]);
}

export function PatientDetailsForm({ onNextTab }) {
  const form = useFormContext();

  // Debug logs
  console.log("PatientDetailsForm render");
  
  useAutoAgeCalculation(form);

  const watchDob = form.watch("patientDetails.dob");
  const patientDetailsName = form.watch("patientDetails.name");
  const patientDetailsAge = form.watch("patientDetails.age");
  const patientDetailsPhoneNumber = form.watch("patientDetails.phoneNumber");

  const isPatientTabComplete = patientDetailsName && patientDetailsAge && patientDetailsPhoneNumber;

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
            name="patientDetails.patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Patient ID *</FormLabel>
                <FormControl>
                  <Input placeholder="Auto-generated ID" className="h-11" {...field} disabled />
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
                  <Input type="date" className="h-11" {...field} />
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
                      const value = e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                    }}
                    readOnly={!!watchDob}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* COMPLETELY SIMPLIFIED Gender Select */}
          <FormField
            control={form.control}
            name="patientDetails.gender"
            render={({ field }) => {
              console.log("Gender field render, value:", field.value);
              return (
                <FormItem>
                  <FormLabel className="text-base font-medium">Gender *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      console.log("Gender onChange:", value);
                      field.onChange(value);
                    }} 
                    value={field.value || ""}
                  >
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
              );
            }}
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

          {/* COMPLETELY SIMPLIFIED Blood Group Select */}
          <FormField
            control={form.control}
            name="patientDetails.bloodGroup"
            render={({ field }) => {
              console.log("Blood group field render, value:", field.value);
              return (
                <FormItem>
                  <FormLabel className="text-base font-medium">Blood Group</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      console.log("Blood group onChange:", value);
                      field.onChange(value);
                    }} 
                    value={field.value || ""}
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
              );
            }}
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
            onClick={() => onNextTab("consultation")}
            disabled={!isPatientTabComplete}
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