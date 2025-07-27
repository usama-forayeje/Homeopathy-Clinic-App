'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2 } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import habitDefinitionsService from '@/services/habitDefinitions';
import { usePatientHabitMutations } from '@/hooks/usePatientHabits'; // নতুন স্কিমা
import { patientHabitSchema } from '@/schemas/patientHabitSchema';
import z from 'zod';

// পুরো ফর্মের জন্য একটি প্যারেন্ট স্কিমা
const consultationHabitsFormSchema = z.object({
    habits: z.array(patientHabitSchema.partial({ notes: true, consultationId: true })), // patientId এবং consultationId বাইরে থেকে আসবে
});


export function ConsultationHabitsSection({ patientId, consultationId, existingHabits = [] }) {
    // সকল সক্রিয় অভ্যাসের সংজ্ঞা লোড করুন
    const { data: habitDefinitions, isLoading: isLoadingDefinitions, error: definitionsError } = useQuery({
        queryKey: ['habitDefinitions'],
        queryFn: habitDefinitionsService.getAllActiveHabitDefinitions,
    });

    // existingHabits কে defaultValues এ মানিয়ে নিন
    const initialHabits = existingHabits.map(habit => {
        // habitDefinition থেকে name পেতে হবে, যা পরে useFieldArray তে দরকার
        const definition = habitDefinitions?.find(def => def.$id === habit.habitDefinitionId);
        return {
            ...habit,
            name: definition?.name, // FormField এর লেবেলের জন্য
            inputType: definition?.inputType, // ফর্ম ফিল্ড টাইপ ডিসপ্লে এর জন্য
            options: definition?.options ? JSON.parse(definition.options) : [], // অপশন পার্স করুন
        };
    }) || [];


    const form = useForm({
        resolver: zodResolver(consultationHabitsFormSchema),
        defaultValues: {
            habits: initialHabits,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'habits',
    });

    const { createPatientHabitMutation, updatePatientHabitMutation, deletePatientHabitMutation } = usePatientHabitMutations();

    const onSubmit = async (data) => {
        // এখানে প্রতিটি অভ্যাসের জন্য create/update/delete লজিক থাকবে
        for (const habit of data.habits) {
            try {
                const payload = {
                    habitDefinitionId: habit.habitDefinitionId,
                    value: habit.value,
                    notes: habit.notes,
                    patientId: patientId,
                    consultationId: consultationId,
                };

                if (habit.$id) { // যদি existing habit হয়, তাহলে আপডেট করুন
                    await updatePatientHabitMutation.mutateAsync({ habitId: habit.$id, data: payload });
                } else { // নতুন habit হলে তৈরি করুন
                    await createPatientHabitMutation.mutateAsync(payload);
                }
            } catch (error) {
                console.error("Error saving habit:", error);
                alert("অভ্যাস সংরক্ষণ করতে সমস্যা হয়েছে।");
            }
        }
    };

    if (isLoadingDefinitions) {
        return <div className="flex justify-center items-center h-20"><Loader2 className="animate-spin" size={24} /></div>;
    }

    if (definitionsError) {
        return <div className="text-red-500">অভ্যাসের ধরন লোড করতে ব্যর্থ: {definitionsError.message}</div>;
    }

    // যদি কোন অভ্যাস সংজ্ঞা না থাকে
    if (!habitDefinitions || habitDefinitions.length === 0) {
        return <p className="text-muted-foreground">কোনো অভ্যাসের ধরন সংজ্ঞায়িত করা হয়নি। অ্যাডমিনকে যোগ করতে বলুন।</p>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">রোগীর অভ্যাস</h3>

                {fields.map((field, index) => {
                    const definition = habitDefinitions.find(def => def.$id === field.habitDefinitionId);

                    if (!definition) return null; // যদি সংজ্ঞা খুঁজে না পায় তবে রেন্ডার করবেন না

                    return (
                        <Card key={field.id} className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{definition.name}</h4>
                                <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>

                            {/* Dynamic Input Field based on inputType */}
                            <FormField
                                control={form.control}
                                name={`habits.${index}.value`}
                                render={({ field: habitField }) => (
                                    <FormItem>
                                        <FormLabel>মান</FormLabel>
                                        <FormControl>
                                            {definition.inputType === 'boolean' ? (
                                                <Checkbox
                                                    checked={habitField.value === 'Yes'} // "Yes" হলে চেকড
                                                    onCheckedChange={(checked) => habitField.onChange(checked ? 'Yes' : 'No')}
                                                />
                                            ) : definition.inputType === 'select' ? (
                                                <Select onValueChange={habitField.onChange} defaultValue={habitField.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="নির্বাচন করুন" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {definition.options && JSON.parse(definition.options).map((option, i) => (
                                                            <SelectItem key={i} value={option}>{option}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : definition.inputType === 'number' ? (
                                                <Input type="number" placeholder="সংখ্যা" {...habitField} />
                                            ) : ( // default to text
                                                <Input placeholder="মান লিখুন" {...habitField} />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`habits.${index}.notes`}
                                render={({ field: notesField }) => (
                                    <FormItem>
                                        <FormLabel>মন্তব্য (ঐচ্ছিক)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="বিশেষ মন্তব্য" {...notesField} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </Card>
                    );
                })}

                {/* নতুন অভ্যাস যোগ করার জন্য বাটন ও ড্রপডাউন */}
                <div className="flex items-center space-x-2">
                    <Select onValueChange={(definitionId) => {
                        const def = habitDefinitions.find(d => d.$id === definitionId);
                        if (def) {
                            append({
                                habitDefinitionId: def.$id,
                                value: def.inputType === 'boolean' ? 'No' : '', // ডিফল্ট মান
                                notes: '',
                                patientId: patientId, // নিশ্চিত করুন patientId আসে
                                consultationId: consultationId, // নিশ্চিত করুন consultationId আসে
                            });
                        }
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="নতুন অভ্যাস যোগ করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            {habitDefinitions.map((def) => {
                                // যে অভ্যাসগুলো ইতিমধ্যেই যোগ করা হয়েছে, সেগুলো বাদ দিন
                                const isAlreadyAdded = fields.some(field => field.habitDefinitionId === def.$id);
                                return (
                                    <SelectItem key={def.$id} value={def.$id} disabled={isAlreadyAdded}>
                                        {def.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" className="w-full" disabled={createPatientHabitMutation.isPending || updatePatientHabitMutation.isPending}>
                    {(createPatientHabitMutation.isPending || updatePatientHabitMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    অভ্যাস সংরক্ষণ করুন
                </Button>
            </form>
        </Form>
    );
}