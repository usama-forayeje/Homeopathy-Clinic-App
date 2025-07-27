"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { VoiceInput } from "@/components/common/VoiceInput"

const chamberSchema = z.object({
  chamberName: z.string().min(2, "চেম্বারের নাম প্রয়োজন"),
  location: z.string().optional(),
  contactNumber: z.string().optional(),
  contactPerson: z.string().optional(),
  openingHours: z.string().optional(),
  notes: z.string().optional(),
})

export function ChamberForm({ onSubmit, defaultValues, isLoading }) {
  const form = useForm({
    resolver: zodResolver(chamberSchema),
    defaultValues: {
      chamberName: defaultValues?.chamberName || "",
      location: defaultValues?.location || "",
      contactNumber: defaultValues?.contactNumber || "",
      contactPerson: defaultValues?.contactPerson || "",
      openingHours: defaultValues?.openingHours || "",
      notes: defaultValues?.notes || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="chamberName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>চেম্বারের নাম *</FormLabel>
              <FormControl>
                <VoiceInput component={Input} placeholder="চেম্বারের নাম লিখুন" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>অবস্থান</FormLabel>
              <FormControl>
                <VoiceInput component={Textarea} placeholder="চেম্বারের ঠিকানা" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>যোগাযোগকারী ব্যক্তি</FormLabel>
                <FormControl>
                  <VoiceInput component={Input} placeholder="নাম" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>যোগাযোগের নম্বর</FormLabel>
                <FormControl>
                  <Input placeholder="ফোন নম্বর" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="openingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>খোলার সময়</FormLabel>
              <FormControl>
                <Input placeholder="যেমন: সকাল ৯টা - বিকাল ৫টা" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>অতিরিক্ত নোট</FormLabel>
              <FormControl>
                <VoiceInput component={Textarea} placeholder="অতিরিক্ত তথ্য বা নোট" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {defaultValues ? "আপডেট করুন" : "সংরক্ষণ করুন"}
        </Button>
      </form>
    </Form>
  )
}
