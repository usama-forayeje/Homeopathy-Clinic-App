'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { VoiceInput } from '@/components/common/VoiceInput';
import { patientSchema } from './PatientConsultationForm'; // Import the patientSchema

export function PatientEditViewForm({
    onSubmit,
    defaultPatient, // The patient data to display/edit
    isLoading,
    isEditing, // Boolean: true for edit mode, false for view mode
    onCancel, // Optional: for canceling edit and going back to view
}) {
    const form = useForm({
        resolver: zodResolver(patientSchema), // Using the existing patientSchema
        defaultValues: {
            name: defaultPatient?.name || '',
            age: defaultPatient?.age ?? '',
            address: defaultPatient?.address || '',
            phoneNumber: defaultPatient?.phoneNumber || '',
            occupation: defaultPatient?.occupation || '',
            lastVisitDate: defaultPatient?.lastVisitDate ? new Date(defaultPatient.lastVisitDate).toISOString().split('T')[0] : '',
            serialNumber: defaultPatient?.serialNumber || '',
            gender: defaultPatient?.gender || 'Male',
        },
    });

    // Reset form with new defaultPatient data if it changes (e.g., after an edit)
    useEffect(() => {
        if (defaultPatient) {
            form.reset({
                name: defaultPatient.name || '',
                age: defaultPatient.age ?? '',
                address: defaultPatient.address || '',
                phoneNumber: defaultPatient.phoneNumber || '',
                occupation: defaultPatient.occupation || '',
                lastVisitDate: defaultPatient.lastVisitDate ? new Date(defaultPatient.lastVisitDate).toISOString().split('T')[0] : '',
                serialNumber: defaultPatient.serialNumber || '',
                gender: defaultPatient.gender || 'Male',
            });
        }
    }, [defaultPatient, form]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin" size={32} />
                <span className="ml-2">ডেটা লোড হচ্ছে...</span>
            </div>
        );
    }

    // Helper function to render a field, either as input or just text
    const renderField = (label, name, type = 'text', Component = Input, options = []) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {isEditing ? (
                            // Editable mode
                            type === 'textarea' ? (
                                <VoiceInput component={Textarea} placeholder={label} {...field} />
                            ) : type === 'number' ? (
                                <Input
                                    type="number"
                                    placeholder={label}
                                    {...field}
                                    onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            ) : type === 'select' ? (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={label} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((option, i) => (
                                            <SelectItem key={i} value={option}>{option}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : type === 'date' ? (
                                <Input type="date" {...field} />
                            ) : (
                                <VoiceInput component={Component} placeholder={label} {...field} />
                            )
                        ) : (
                            // View mode - display as text
                            <p className="p-2 border rounded-md min-h-[38px] flex items-center bg-muted/50 text-foreground/80">
                                {field.value || 'N/A'}
                            </p>
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">
                    {isEditing ? 'রোগীর তথ্য আপডেট করুন' : 'রোগীর তথ্য দেখুন'}
                </h2>
                <Separator />

                {renderField('রোগীর নাম *', 'name', 'text', Input)}
                {renderField('বয়স *', 'age', 'number', Input)}
                {renderField(
                    'লিঙ্গ *',
                    'gender',
                    'select',
                    Select,
                    ['Male', 'Female', 'Other']
                )}
                {renderField('যোগাযোগের নম্বর *', 'phoneNumber', 'text', Input)}
                {renderField('সিরিয়াল নম্বর *', 'serialNumber', 'text', Input)}
                {renderField('পেশা (ঐচ্ছিক)', 'occupation', 'text', Input)}
                {renderField('ঠিকানা (ঐচ্ছিক)', 'address', 'textarea', Textarea)}
                {renderField('শেষ পরিদর্শনের তারিখ (ঐচ্ছিক)', 'lastVisitDate', 'date', Input)}

                <Separator className="my-6" />

                {isEditing && (
                    <div className="flex gap-4">
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            আপডেট করুন
                        </Button>
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                                বাতিল করুন
                            </Button>
                        )}
                    </div>
                )}
            </form>
        </Form>
    );
}