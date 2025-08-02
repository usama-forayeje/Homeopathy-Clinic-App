
"use client";

import React from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoAgeCalculation } from '@/hooks/useAutoAgeCalculation';
import { Calendar22, DatePicker } from '../ui/datePicker';
import { VoiceInput } from '../common/VoiceInput';

export function PatientDetailsForm({ onNextTab, onPreviousTab }) {
    const form = useFormContext();
    useAutoAgeCalculation();

    // Watch fields to check if this tab is complete
    const patientName = form.watch("patientDetails.name");
    const patientAge = form.watch("patientDetails.age");
    const patientPhone = form.watch("patientDetails.phoneNumber");
    const patientGender = form.watch("patientDetails.gender");
    const patientSerialNumber = form.watch("patientDetails.serialNumber");
    const patientFirstConsultationDate = form.watch("patientDetails.firstConsultationDate");

    const isPatientTabComplete =
        patientName && patientAge && patientPhone && patientGender && patientSerialNumber && patientFirstConsultationDate;

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Patient Details
                </CardTitle>
                <CardDescription>Basic information about the patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Name, Age, Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="patientDetails.name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-medium">Full Name *</FormLabel>
                                <FormControl>
                                    <VoiceInput
                                        component={Input}
                                        placeholder="Patient's Full Name"
                                        className="h-11"
                                        {...field}
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
                                    <Input type="number" placeholder="Calculated Age" {...field} />
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
                                    <Calendar22
                                        {...field}
                                    />
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
                                    <Input placeholder="+8801XXXXXXXXX" className="h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Gender, Blood Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select blood group" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="A+">A+</SelectItem>
                                        <SelectItem value="A-">A-</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                        <SelectItem value="B-">B-</SelectItem>
                                        <SelectItem value="AB+">AB+</SelectItem>
                                        <SelectItem value="AB-">AB-</SelectItem>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Address, Occupation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="patientDetails.address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-medium">Address</FormLabel>
                                <FormControl>
                                    <VoiceInput
                                        component={Textarea}
                                        placeholder="Patient's current address"
                                        className="min-h-[45px]"
                                        {...field}
                                    />
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
                                    <VoiceInput
                                        component={Input}
                                        placeholder="e.g. Student, Engineer"
                                        className="h-11"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Serial Number, First Consultation Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="patientDetails.serialNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-medium">Serial Number *</FormLabel>
                                <FormControl>
                                    <VoiceInput
                                        component={Input}
                                        placeholder="Unique patient serial"
                                        className="h-11"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="patientDetails.firstConsultationDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-medium">First Consultation Date *</FormLabel>
                                <FormControl>
                                    <Calendar22
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Notes */}
                <FormField
                    control={form.control}
                    name="patientDetails.notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-medium">Notes</FormLabel>
                            <FormControl>
                                <VoiceInput
                                    component={Textarea}
                                    placeholder="Any additional notes about the patient"
                                    className="min-h-[50px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                    <Button type="button" className="cursor-pointer" variant="outline" onClick={() => onPreviousTab("patient")} disabled>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="button" className="cursor-pointer" onClick={() => onNextTab("consultation")} disabled={!isPatientTabComplete}>
                        Next: Consultation <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}