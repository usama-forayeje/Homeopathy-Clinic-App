'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import patientsService from '@/services/patients';
import consultationsService from '@/services/consultations';
import patientHabitsService from '@/services/patientHabits';
import habitDefinitionsService from '@/services/habitDefinitions'; // Assuming you have this service to get all habit types
import { PatientConsultationForm } from '@/components/forms/PatientConsultationForm';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Pencil, ArrowLeft, XCircle } from 'lucide-react';

export default function PatientDetailPage({ params: paramsPromise }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Using React.use for suspense-like behavior with promises in Next.js App Router
  const params = React.use(paramsPromise);
  const { patientId } = params;

  // --- Fetch All Data Needed for Form ---
  const { data: patient, isLoading: isLoadingPatient, isError: isErrorPatient, error: errorPatient } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientsService.getPatient(patientId),
    enabled: !!patientId,
  });

  const { data: patientHabits, isLoading: isLoadingHabits, isError: isErrorHabits, error: errorHabits } = useQuery({
    queryKey: ['patientHabits', patientId],
    queryFn: () => patientHabitsService.getPatientHabitsByPatientId(patientId),
    enabled: !!patientId,
  });

  const { data: consultation, isLoading: isLoadingConsultation, isError: isErrorConsultation, error: errorConsultation } = useQuery({
    queryKey: ['consultation', patientId],
    queryFn: async () => {
      // Fetch all consultations for this patient and get the latest one
      const consultations = await consultationsService.getConsultationsByPatientId(patientId);
      // Sort by creation date or a specific consultation date if available
      return consultations.length > 0 ? consultations.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))[0] : null;
    },
    enabled: !!patientId,
  });

  const { data: habitDefinitions, isLoading: isLoadingHabitDefs, isError: isErrorHabitDefs, error: errorHabitDefs } = useQuery({
    queryKey: ['habitDefinitions'],
    queryFn: () => habitDefinitionsService.getAllActiveHabitDefinitions(), // Fetch all available habit types
    // This typically doesn't depend on patientId, so it can be fetched once
  });

  // --- Mutations for Updating Data ---
  const updatePatientMutation = useMutation({
    mutationFn: (updatedPatientData) => patientsService.updatePatient(patientId, updatedPatientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
      toast.success('রোগীর মৌলিক তথ্য সফলভাবে আপডেট হয়েছে।');
    },
    onError: (err) => {
      console.error("Error updating patient details:", err);
      toast.error(`রোগীর মৌলিক তথ্য আপডেটে সমস্যা হয়েছে: ${err.message || err.toString()}`);
    },
  });

  const updateHabitsMutation = useMutation({
    mutationFn: async (updatedHabits) => {
      const existingHabitIds = new Set(patientHabits?.map(h => h.$id));
      const newHabitIds = new Set(updatedHabits.map(h => h.$id).filter(Boolean)); // Filter out undefined/null IDs

      const promises = [];

      // 1. Create new habits
      const habitsToCreate = updatedHabits.filter(h => !h.$id);
      if (habitsToCreate.length > 0) {
        promises.push(
          ...habitsToCreate.map(habit => patientHabitsService.createPatientHabit({ ...habit, patientId: patientId }))
        );
      }

      // 2. Update existing habits
      const habitsToUpdate = updatedHabits.filter(h => h.$id && existingHabitIds.has(h.$id));
      if (habitsToUpdate.length > 0) {
        promises.push(
          ...habitsToUpdate.map(habit => patientHabitsService.updatePatientHabit(habit.$id, habit))
        );
      }

      // 3. Delete habits that are no longer in the form
      const habitsToDelete = patientHabits?.filter(h => !newHabitIds.has(h.$id));
      if (habitsToDelete && habitsToDelete.length > 0) {
        promises.push(
          ...habitsToDelete.map(habit => patientHabitsService.deletePatientHabit(habit.$id))
        );
      }

      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientHabits', patientId] });
      toast.success('রোগীর অভ্যাস সফলভাবে আপডেট হয়েছে।');
    },
    onError: (err) => {
      console.error("Error updating patient habits:", err);
      toast.error(`রোগীর অভ্যাস আপডেটে সমস্যা হয়েছে: ${err.message || err.toString()}`);
    },
  });

  const updateConsultationMutation = useMutation({
    mutationFn: (updatedConsultationData) => {
      if (consultation?.$id) {
        return consultationsService.updateConsultation(consultation.$id, updatedConsultationData);
      } else {
        return consultationsService.createConsultation({ ...updatedConsultationData, patientId: patientId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultation', patientId] });
      toast.success('কনসাল্টেশন তথ্য সফলভাবে আপডেট হয়েছে।');
    },
    onError: (err) => {
      console.error("Error updating consultation:", err);
      toast.error(`কনসাল্টেশন আপডেটে সমস্যা হয়েছে: ${err.message || err.toString()}`);
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      // Use Promise.allSettled to allow independent updates and collect all results
      const results = await Promise.allSettled([
        updatePatientMutation.mutateAsync(data.patientDetails),
        updateHabitsMutation.mutateAsync(data.patientHabits),
        updateConsultationMutation.mutateAsync(data.consultationDetails),
      ]);

      const allSucceeded = results.every(result => result.status === 'fulfilled');

      if (allSucceeded) {
        toast.success('রোগীর সমস্ত তথ্য সফলভাবে আপডেট হয়েছে!');
        setIsEditing(false); // Exit edit mode after successful update
      } else {
        // Log individual errors if any failed
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Error in part ${index}:`, result.reason);
          }
        });
        toast.error('কিছু তথ্য আপডেটে সমস্যা হয়েছে। বিস্তারিত কনসোলে দেখুন।');
      }
    } catch (submitError) {
      // This catch block will only hit if Promise.allSettled throws an error itself,
      // which is unlikely for individual mutation failures as they are caught in their onError.
      console.error("An unexpected error occurred during form submission:", submitError);
      toast.error('ফর্ম জমা দিতে একটি অপ্রত্যাশিত ত্রুটি হয়েছে।');
    }
  };

  const isLoadingOverall =
    isLoadingPatient ||
    isLoadingHabits ||
    isLoadingConsultation ||
    isLoadingHabitDefs ||
    updatePatientMutation.isPending ||
    updateHabitsMutation.isPending ||
    updateConsultationMutation.isPending;

  const isErrorOverall = isErrorPatient || isErrorHabits || isErrorConsultation || isErrorHabitDefs;

  if (isLoadingOverall) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Loader2 className="animate-spin" size={48} />
        <span className="ml-2 text-lg text-muted-foreground">রোগীর ডেটা লোড হচ্ছে...</span>
      </div>
    );
  }

  if (isErrorOverall) {
    return (
      <div className="p-6 text-red-600 text-center">
        <XCircle className="h-12 w-12 mx-auto mb-4" />
        <p className="mb-4">রোগীর তথ্য লোড করতে ব্যর্থ: {errorPatient?.message || errorHabits?.message || errorConsultation?.message || errorHabitDefs?.message || "একটি অজানা ত্রুটি ঘটেছে।"}</p>
        <Link href="/dashboard/patients">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> রোগীর তালিকা
          </Button>
        </Link>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-muted-foreground text-center">
        <p className="mb-4">রোগীর তথ্য পাওয়া যায়নি।</p>
        <Link href="/dashboard/patients">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> রোগীর তালিকা
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl"> {/* Increased max-width for better layout */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-extrabold text-gray-800">
            {isEditing ? 'রোগীর তথ্য আপডেট করুন' : 'রোগীর প্রোফাইল'}
          </CardTitle>
          <div className="flex gap-2">
            <Link href="/dashboard/patients">
              <Button variant="outline" size="sm" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> ফিরে যান
              </Button>
            </Link>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} size="sm" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                <Pencil className="mr-2 h-4 w-4" /> এডিট করুন
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <PatientConsultationForm
            onSubmit={handleFormSubmit}
            defaultPatient={patient}
            defaultPatientHabits={patientHabits || []}
            defaultConsultation={consultation}
            habitDefinitions={habitDefinitions || []} // Pass all habit definitions
            isLoading={isLoadingOverall}
            isEditing={isEditing}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
}