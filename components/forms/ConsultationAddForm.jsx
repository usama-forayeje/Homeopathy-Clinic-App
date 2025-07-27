// components/forms/ConsultationAddForm.jsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { VoiceInput } from '@/components/common/VoiceInput'; // আপনার ভয়েস ইনপুট কম্পোনেন্ট
import { useQuery } from '@tanstack/react-query';
import patientsService from '@/services/patients'; // রোগীর তালিকা পাওয়ার জন্য

// Zod schema for consultation validation
export const consultationSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  doctorId: z.string().min(1, { message: "Doctor is required." }), // লগইন করা ডাক্তারের ID হতে পারে
  date: z.string().refine(val => !isNaN(new Date(val).getTime()), { message: "Invalid date format." }),
  time: z.string().min(1, { message: "Time is required." }),
  notes: z.string().optional().or(z.literal('')),
});

export function ConsultationAddForm({ onSubmit, defaultValues, isLoading, currentDoctorId }) {
  const form = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      patientId: defaultValues?.patientId || '',
      doctorId: defaultValues?.doctorId || currentDoctorId || '', // বর্তমান ডাক্তারের আইডি অটোফিল
      date: defaultValues?.date || new Date().toISOString().split('T')[0], // আজকের তারিখ ডিফল্ট
      time: defaultValues?.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), // বর্তমান সময় ডিফল্ট
      notes: defaultValues?.notes || '',
    },
  });

  // রোগীর তালিকা লোড করুন
  const { data: patients, isLoading: isLoadingPatients, error: patientsError } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsService.getAllPatients,
  });

  React.useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,
        date: defaultValues.date || new Date().toISOString().split('T')[0],
        time: defaultValues.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        notes: defaultValues.notes || '',
      });
    }
  }, [defaultValues, form]);


  if (isLoadingPatients) {
    return <div className="flex justify-center items-center h-20"><Loader2 className="animate-spin" size={24} /> <span className="ml-2">রোগী লোড হচ্ছে...</span></div>;
  }

  if (patientsError) {
    return <div className="text-red-500">রোগীর তালিকা লোড করতে সমস্যা হয়েছে: {patientsError.message}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>রোগী নির্বাচন করুন *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="রোগী নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients && patients.map((patient) => (
                    <SelectItem key={patient.$id} value={patient.$id}>
                      {patient.name} ({patient.contactNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Doctor ID hidden field - will be autofilled from auth context later */}
        <FormField
          control={form.control}
          name="doctorId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>তারিখ *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>সময় *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
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
              <FormLabel>মন্তব্য (ঐচ্ছিক)</FormLabel>
              <FormControl>
                <VoiceInput component={Textarea} placeholder="কনসাল্টেশনের নোটস" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          কনসালটেশন সংরক্ষণ করুন
        </Button>
      </form>
    </Form>
  );
}