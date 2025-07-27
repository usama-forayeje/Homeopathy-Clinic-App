"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, PlusCircle, MinusCircle, User, Stethoscope, Activity } from "lucide-react"
import { VoiceInput } from "@/components/common/VoiceInput"
import { useQuery } from "@tanstack/react-query"
import habitDefinitionsService from "@/services/habitDefinitions"

// Enhanced schema for comprehensive patient consultation
const patientConsultationSchema = z.object({
  // Patient Details
  patientDetails: z.object({
    name: z.string().min(2, "রোগীর নাম প্রয়োজন"),
    age: z.number().min(1, "বয়স প্রয়োজন"),
    gender: z.enum(["Male", "Female", "Other"], { message: "লিঙ্গ নির্বাচন করুন" }),
    phoneNumber: z.string().min(11, "সঠিক ফোন নম্বর দিন"),
    address: z.string().optional(),
    occupation: z.string().optional(),
    serialNumber: z.string().min(1, "সিরিয়াল নম্বর প্রয়োজন"),
    lastVisitDate: z.string().optional(),
  }),

  // Consultation Details
  consultationDetails: z.object({
    date: z.string().min(1, "তারিখ প্রয়োজন"),
    time: z.string().min(1, "সময় প্রয়োজন"),
    chiefComplaint: z.string().min(5, "প্রধান অভিযোগ লিখুন"),
    historyOfPresentIllness: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    familyHistory: z.string().optional(),
    personalHistory: z.string().optional(),
    generalExamination: z.string().optional(),
    systemicExamination: z.string().optional(),
    investigations: z.string().optional(),
    diagnosis: z.string().min(3, "রোগ নির্ণয় প্রয়োজন"),
    treatmentPlan: z.string().min(5, "চিকিৎসা পরিকল্পনা প্রয়োজন"),
    advice: z.string().optional(),
    followUpDate: z.string().optional(),
  }),

  // Patient Habits
  patientHabits: z.array(
    z.object({
      habitDefinitionId: z.string().min(1, "অভ্যাসের ধরন নির্বাচন করুন"),
      value: z.string().min(1, "মান প্রয়োজন"),
      notes: z.string().optional(),
    }),
  ),
})

export function PatientConsultationForm({
  onSubmit,
  isLoading,
  currentDoctorId,
  defaultPatient,
  isEditing = true,
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState("patient")

  // Load habit definitions
  const {
    data: habitDefinitions,
    isLoading: isLoadingHabits,
    error: habitsError,
  } = useQuery({
    queryKey: ["habitDefinitions"],
    queryFn: habitDefinitionsService.getAllActiveHabitDefinitions,
    staleTime: 5 * 60 * 1000,
  })

  const form = useForm({
    resolver: zodResolver(patientConsultationSchema),
    defaultValues: {
      patientDetails: {
        name: defaultPatient?.name || "",
        age: defaultPatient?.age || 0,
        gender: defaultPatient?.gender || "Male",
        phoneNumber: defaultPatient?.phoneNumber || "",
        address: defaultPatient?.address || "",
        occupation: defaultPatient?.occupation || "",
        serialNumber: defaultPatient?.serialNumber || "",
        lastVisitDate: defaultPatient?.lastVisitDate
          ? new Date(defaultPatient.lastVisitDate).toISOString().split("T")[0]
          : "",
      },
      consultationDetails: {
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        chiefComplaint: "",
        historyOfPresentIllness: "",
        pastMedicalHistory: "",
        familyHistory: "",
        personalHistory: "",
        generalExamination: "",
        systemicExamination: "",
        investigations: "",
        diagnosis: "",
        treatmentPlan: "",
        advice: "",
        followUpDate: "",
      },
      patientHabits: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "patientHabits",
  })

  // Helper function to safely parse JSON
  const safeParseJSON = (jsonString) => {
    try {
      return jsonString ? JSON.parse(jsonString) : []
    } catch {
      return []
    }
  }

  // Helper function to render form fields
  const renderField = (label, name, type = "text", Component = Input, options = [], useVoice = false) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              useVoice ? (
                <VoiceInput component={Textarea} placeholder={label} {...field} />
              ) : (
                <Textarea placeholder={label} {...field} />
              )
            ) : type === "number" ? (
              <Input
                type="number"
                placeholder={label}
                {...field}
                onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
              />
            ) : type === "select" ? (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option, i) => (
                    <SelectItem key={i} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "date" ? (
              <Input type="date" {...field} />
            ) : type === "time" ? (
              <Input type="time" {...field} />
            ) : useVoice ? (
              <VoiceInput component={Component} placeholder={label} {...field} />
            ) : (
              <Component placeholder={label} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  if (isLoadingHabits) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" size={32} />
        <span className="ml-2">ফর্ম লোড হচ্ছে...</span>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patient" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              রোগীর তথ্য
            </TabsTrigger>
            <TabsTrigger value="consultation" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              কনসালটেশন
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              অভ্যাস
            </TabsTrigger>
          </TabsList>

          {/* Patient Details Tab */}
          <TabsContent value="patient" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  রোগীর ব্যক্তিগত তথ্য
                </CardTitle>
                <CardDescription>রোগীর মৌলিক তথ্য এবং যোগাযোগের বিবরণ</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("রোগীর নাম *", "patientDetails.name", "text", Input, [], true)}
                {renderField("বয়স *", "patientDetails.age", "number")}
                {renderField("লিঙ্গ *", "patientDetails.gender", "select", Select, ["Male", "Female", "Other"])}
                {renderField("যোগাযোগের নম্বর *", "patientDetails.phoneNumber", "text", Input, [], true)}
                {renderField("সিরিয়াল নম্বর *", "patientDetails.serialNumber", "text", Input)}
                {renderField("পেশা (ঐচ্ছিক)", "patientDetails.occupation", "text", Input, [], true)}
                <div className="md:col-span-2">
                  {renderField("ঠিকানা (ঐচ্ছিক)", "patientDetails.address", "textarea", Textarea, [], true)}
                </div>
                {renderField("শেষ পরিদর্শনের তারিখ (ঐচ্ছিক)", "patientDetails.lastVisitDate", "date")}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultation Details Tab */}
          <TabsContent value="consultation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  কনসালটেশন বিবরণ
                </CardTitle>
                <CardDescription>রোগীর অভ���যোগ, পরীক্ষা এবং চিকিৎসা পরিকল্পনা</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("তারিখ *", "consultationDetails.date", "date")}
                  {renderField("সময় *", "consultationDetails.time", "time")}
                </div>

                <Separator />

                {/* Chief Complaint & History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">অভিযোগ ও ইতিহাস</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {renderField("প্রধান অভিযোগ *", "consultationDetails.chiefComplaint", "textarea", Textarea, [], true)}
                    {renderField(
                      "বর্তমান অসুস্থতার ইতিহাস",
                      "consultationDetails.historyOfPresentIllness",
                      "textarea",
                      Textarea,
                      [],
                      true,
                    )}
                    {renderField(
                      "পুরানো চিকিৎসা ইতিহাস",
                      "consultationDetails.pastMedicalHistory",
                      "textarea",
                      Textarea,
                      [],
                      true,
                    )}
                    {renderField("পারিবারিক ইতিহাস", "consultationDetails.familyHistory", "textarea", Textarea, [], true)}
                    {renderField(
                      "ব্যক্তিগত ইতিহাস",
                      "consultationDetails.personalHistory",
                      "textarea",
                      Textarea,
                      [],
                      true,
                    )}
                  </div>
                </div>

                <Separator />

                {/* Examination */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">পরীক্ষা-নিরীক্ষা</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField(
                      "সাধারণ পরীক্ষা",
                      "consultationDetails.generalExamination",
                      "textarea",
                      Textarea,
                      [],
                      true,
                    )}
                    {renderField(
                      "সিস্টেমিক পরীক্ষা",
                      "consultationDetails.systemicExamination",
                      "textarea",
                      Textarea,
                      [],
                      true,
                    )}
                    {renderField("তদন্ত/পরীক্ষা", "consultationDetails.investigations", "textarea", Textarea, [], true)}
                  </div>
                </div>

                <Separator />

                {/* Diagnosis & Treatment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">রোগ নির্ণয় ও চিকিৎসা</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {renderField("রোগ নির্ণয় *", "consultationDetails.diagnosis", "textarea", Textarea, [], true)}
                    {renderField(
                      "চিকিৎসা পরিকল্পনা *",
                      "consultationDetails.treatmentPlan",
                      "textarea",
                      Textarea,
                      [],
                      true,
                    )}
                    {renderField("পরামর্শ", "consultationDetails.advice", "textarea", Textarea, [], true)}
                    {renderField("ফলোআপের তারিখ (ঐচ্ছিক)", "consultationDetails.followUpDate", "date")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patient Habits Tab */}
          <TabsContent value="habits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  রোগীর অভ্যাস ট্র্যাকিং
                </CardTitle>
                <CardDescription>রোগীর জীবনযাত্রার অভ্যাস এবং স্বাস্থ্য প্যাটার্ন</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg shadow-sm bg-accent/10">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium">অভ্যাস {index + 1}</h4>
                      {isEditing && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                          <MinusCircle className="mr-2 h-4 w-4" />
                          সরান
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`patientHabits.${index}.habitDefinitionId`}
                        render={({ field: habitDefField }) => (
                          <FormItem>
                            <FormLabel>অভ্যাসের ধরন *</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const selectedDef = habitDefinitions?.find((def) => def.$id === value)
                                habitDefField.onChange(value)
                                // Reset value when type changes
                                form.setValue(`patientHabits.${index}.value`, "")
                              }}
                              value={habitDefField.value}
                              disabled={!isEditing}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="একটি অভ্যাস নির্বাচন করুন" />
                              </SelectTrigger>
                              <SelectContent>
                                {habitDefinitions?.map((def) => (
                                  <SelectItem key={def.$id} value={def.$id}>
                                    {def.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch(`patientHabits.${index}.habitDefinitionId`) && (
                        <>
                          <FormField
                            control={form.control}
                            name={`patientHabits.${index}.value`}
                            render={({ field: valueField }) => {
                              const selectedDefId = form.watch(`patientHabits.${index}.habitDefinitionId`)
                              const selectedDef = habitDefinitions?.find((def) => def.$id === selectedDefId)
                              const inputType = selectedDef?.inputType
                              const options = safeParseJSON(selectedDef?.options)

                              if (!isEditing) {
                                return (
                                  <FormItem>
                                    <FormLabel>মান</FormLabel>
                                    <p className="p-2 border rounded-md min-h-[38px] flex items-center bg-muted/50 text-foreground/80">
                                      {valueField.value || "N/A"}
                                    </p>
                                  </FormItem>
                                )
                              }

                              switch (inputType) {
                                case "text":
                                  return (
                                    <FormItem>
                                      <FormLabel>মান</FormLabel>
                                      <VoiceInput component={Input} placeholder="অভ্যাসের মান লিখুন" {...valueField} />
                                      <FormMessage />
                                    </FormItem>
                                  )
                                case "number":
                                  return (
                                    <FormItem>
                                      <FormLabel>মান</FormLabel>
                                      <Input
                                        type="number"
                                        placeholder="অভ্যাসের মান লিখুন"
                                        {...valueField}
                                        onChange={(e) =>
                                          valueField.onChange(
                                            e.target.value === "" ? "" : Number(e.target.value).toString(),
                                          )
                                        }
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )
                                case "select":
                                  return (
                                    <FormItem>
                                      <FormLabel>মান</FormLabel>
                                      <Select onValueChange={valueField.onChange} value={valueField.value}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="একটি মান নির্বাচন করুন" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {options?.map((option, i) => (
                                            <SelectItem key={i} value={option}>
                                              {option}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )
                                case "boolean":
                                  return (
                                    <FormItem>
                                      <FormLabel>মান</FormLabel>
                                      <Select onValueChange={valueField.onChange} value={valueField.value}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="হ্যাঁ বা না নির্বাচন করুন" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="হ্যাঁ">হ্যাঁ</SelectItem>
                                          <SelectItem value="না">না</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )
                                case "scale":
                                  return (
                                    <FormItem>
                                      <FormLabel>মান (১-১০)</FormLabel>
                                      <Select onValueChange={valueField.onChange} value={valueField.value}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="১-১০ স্কেলে নির্বাচন করুন" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>
                                              {num}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )
                                default:
                                  return null
                              }
                            }}
                          />

                          <FormField
                            control={form.control}
                            name={`patientHabits.${index}.notes`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>নোটস (ঐচ্ছিক)</FormLabel>
                                {isEditing ? (
                                  <VoiceInput component={Textarea} placeholder="নোটস লিখুন" {...field} />
                                ) : (
                                  <p className="p-2 border rounded-md min-h-[38px] flex items-center bg-muted/50 text-foreground/80">
                                    {field.value || "N/A"}
                                  </p>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ habitDefinitionId: "", value: "", notes: "" })}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    নতুন অভ্যাস যোগ করুন
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "সংরক্ষণ করুন" : "আপডেট করুন"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              বাতিল করুন
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
