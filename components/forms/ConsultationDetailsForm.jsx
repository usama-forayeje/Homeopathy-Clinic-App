// components/consultations/ConsultationDetailsForm.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { CalendarIcon, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

// একটি ইনপুট ফিল্ডের সাথে Add/Remove বাটন
const TagInput = ({ name, label, control, placeholder, initialValue = '' }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Initial value যদি থাকে এবং field array ফাঁকা থাকে, তাহলে যোগ করুন।
    // এখানে initialValue সরাসরি স্ট্রিং হবে আশা করছি, এবং append() কে অবজেক্ট পাঠাতে হবে।
    if (initialValue && fields.length === 0) {
      // console.log(`Appending initialValue to ${name}: ${initialValue}`);
      append({ value: initialValue }); // <-- এখানে পরিবর্তন: অবজেক্ট পাঠাতে হবে
    }
  }, [initialValue, fields.length, append, name]);

  const handleAdd = () => {
    // নিশ্চিত করুন যে input ফাঁকা নয় এবং এটি একটি ডুপ্লিকেট নয়
    if (inputValue.trim() && !fields.some(field => field.value === inputValue.trim())) { // <-- এখানে পরিবর্তন: field.value ব্যবহার করা হচ্ছে
      append({ value: inputValue.trim() }); // <-- এখানে পরিবর্তন: অবজেক্ট পাঠাতে হবে
      setInputValue('');
    }
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex space-x-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <Badge key={field.id} variant="secondary" className="pr-1"> {/* field.id ব্যবহার করা হচ্ছে */}
            {field.value} {/* <-- এখানে পরিবর্তন: field.value ব্যবহার করা হচ্ছে */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="ml-1 text-xs leading-none"
            >
              <Minus className="h-3 w-3 inline-block" />
            </button>
          </Badge>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  );
};


export function ConsultationDetailsForm({ onNextTab, onPreviousTab, chambers }) {
  console.log("chambers passed to ConsultationDetailsForm:", chambers);

  const { control, formState: { errors }, watch } = useFormContext();
  const currentConsultationDate = watch("consultationDetails.consultationDate");
  const currentFollowUpDate = watch("consultationDetails.followUpDate");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultation Details</CardTitle>
        <CardDescription>Medical examination and diagnosis information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Consultation Date */}
          <FormField
            control={control}
            name="consultationDetails.consultationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation Date <span className="text-red-500">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : null}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Chamber */}
          <FormField
            control={control}
            name="consultationDetails.chamberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Chamber <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a chamber" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {chambers?.map((chamber) => (
                      <SelectItem key={chamber.$id} value={chamber.$id}>
                        {chamber.chamberName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bill Amount */}
          <FormField
            control={control}
            name="consultationDetails.billAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Symptoms */}
          <FormField
            control={control}
            name="consultationDetails.symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symptoms</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe symptoms..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BP */}
          <FormField
            control={control}
            name="consultationDetails.BP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BP (Blood Pressure)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 120/80 mmHg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pulse */}
          <FormField
            control={control}
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

          {/* Temp */}
          <FormField
            control={control}
            name="consultationDetails.Temp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temp (Temperature)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 98.6°F" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* O_E (On Examination) */}
          <FormField
            control={control}
            name="consultationDetails.O_E"
            render={({ field }) => (
              <FormItem>
                <FormLabel>O/E (On Examination)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Findings on examination..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* History of Present Illness */}
          <FormField
            control={control}
            name="consultationDetails.historyOfPresentIllness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>History of Present Illness</FormLabel>
                <FormControl>
                  <Textarea placeholder="Details of current illness..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Advice (General) */}
          <FormField
            control={control}
            name="consultationDetails.advice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>General Advice</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any general advice for the patient..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Follow-up Date */}
          <FormField
            control={control}
            name="consultationDetails.followUpDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follow-up Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a follow-up date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : null}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Consultation Notes (General) */}
          <FormField
            control={control}
            name="consultationDetails.notes"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Consultation Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any additional notes for this consultation..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        ---

        {/* --- Specific Sections for TagInputs and Textareas --- */}

        {/* Chief Complaints Section */}
        <div className="mt-6">
          <TagInput
            name="consultationDetails.chiefComplaint"
            label="Chief Complaints *"
            control={control}
            placeholder="Add chief complaint"
            // initialValue="General Checkup" // Removed initial value for flexibility
          />
        </div>

        {/* Other Complaints Section - Directly below Chief Complaints */}
        <div className="mt-6">
          <TagInput
            name="consultationDetails.otherComplaints"
            label="Other Complaints"
            control={control}
            placeholder="Add other complaints"
            // initialValue="" // Removed initial value
          />
        </div>

        {/* Diagnosis Section */}
        <div className="mt-6">
          <TagInput
            name="consultationDetails.diagnosis"
            label="Diagnosis"
            control={control}
            placeholder="Add diagnosis"
            // initialValue="General Checkup" // Removed initial value
          />
        </div>

        {/* Patient History */}
        <div className="mt-6">
            <FormField
                control={control}
                name="consultationDetails.patientHistory"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Patient History</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter patient's medical history..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        {/* Physical Examination */}
        <div className="mt-6">
            <FormField
                control={control}
                name="consultationDetails.physicalExamination"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Physical Examination</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter physical examination findings..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        ---

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={onPreviousTab}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back: Patient Details
          </Button>
          <Button type="button" onClick={onNextTab}>
            Next: Prescription <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}