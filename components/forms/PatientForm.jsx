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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { VoiceInput } from '@/components/common/VoiceInput'; // আপনার ভয়েস ইনপুট কম্পোনেন্ট

// Zod schema for patient validation
export const patientSchema = z.object({
  name: z.string().min(2, { message: "Patient name is required." }),
  age: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, { message: "Age must be a positive number." }),
  gender: z.enum(["Male", "Female", "Other"], { message: "Gender is required." }),
  contactNumber: z.string().min(10, { message: "Contact number is required and must be at least 10 digits." }),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  medicalHistory: z.string().optional().or(z.literal('')), // JSON string or plain text
});

export function PatientForm({ onSubmit, defaultValues, isLoading }) {
  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      age: defaultValues?.age ? String(defaultValues.age) : '',
      gender: defaultValues?.gender || 'Male',
      contactNumber: defaultValues?.contactNumber || '',
      email: defaultValues?.email || '',
      address: defaultValues?.address || '',
      medicalHistory: defaultValues?.medicalHistory || '',
    },
  });

  // Default values পরিবর্তন হলে ফর্ম রিসেট করুন (এডিট মোডের জন্য)
  React.useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,
        age: defaultValues.age ? String(defaultValues.age) : '',
        email: defaultValues.email || '',
        address: defaultValues.address || '',
        medicalHistory: defaultValues.medicalHistory || '',
      });
    }
  }, [defaultValues, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>রোগীর নাম *</FormLabel>
              <FormControl>
                <VoiceInput component={Input} placeholder="পূর্ণ নাম" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>বয়স *</FormLabel>
              <FormControl>
                <Input type="number" placeholder="বয়স" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>লিঙ্গ *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-1">
                    <FormControl>
                      <RadioGroupItem value="Male" />
                    </FormControl>
                    <FormLabel className="font-normal">পুরুষ</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-1">
                    <FormControl>
                      <RadioGroupItem value="Female" />
                    </FormControl>
                    <FormLabel className="font-normal">মহিলা</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-1">
                    <FormControl>
                      <RadioGroupItem value="Other" />
                    </FormControl>
                    <FormLabel className="font-normal">অন্যান্য</FormLabel>
                  </FormItem>
                </RadioGroup>
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
              <FormLabel>যোগাযোগের নম্বর *</FormLabel>
              <FormControl>
                <VoiceInput component={Input} placeholder="মোবাইল নম্বর" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ইমেইল (ঐচ্ছিক)</FormLabel>
              <FormControl>
                <VoiceInput component={Input} type="email" placeholder="ইমেইল ঠিকানা" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ঠিকানা (ঐচ্ছিক)</FormLabel>
              <FormControl>
                <VoiceInput component={Textarea} placeholder="রোগীর ঠিকানা" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medicalHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>চিকিৎসার পূর্ব ইতিহাস (ঐচ্ছিক)</FormLabel>
              <FormControl>
                <VoiceInput component={Textarea} placeholder="পূর্বের রোগ, এলার্জি ইত্যাদি" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          রোগী সংরক্ষণ করুন
        </Button>
      </form>
    </Form>
  );
}