// app/dashboard/consultations/[consultationId]/page.jsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, PlusCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PatientConsultationForm } from '@/components/forms/PatientConsultationForm'; // এই ফর্মটি নতুন কনসাল্টেশন যোগ করার জন্য
import consultationsService from '@/services/consultations';
import patientsService from '@/services/patients';
import patientHabitsService from '@/services/patientHabits';

export default function ConsultationDetailsPage({ params }) {
  const { consultationId } = params;
  const queryClient = useQueryClient();
  const [isNewConsultationModalOpen, setIsNewConsultationModalOpen] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // TODO: লগইন করা ডাক্তারের আইডি এখানে আনুন
  const currentDoctorId = "doctor_abc123";

  // 1. বর্তমান কনসাল্টেশন ডেটা লোড করুন
  const { data: currentConsultation, isLoading: isLoadingCurrentConsultation, error: currentConsultationError } = useQuery({
    queryKey: ['consultation', consultationId],
    queryFn: () => consultationsService.getConsultationById(consultationId),
    enabled: !!consultationId,
  });

  // 2. বর্তমান কনসাল্টেশনের রোগীর ডেটা লোড করুন
  const { data: currentPatient, isLoading: isLoadingCurrentPatient, error: currentPatientError } = useQuery({
    queryKey: ['patient', currentConsultation?.patientId],
    queryFn: () => patientsService.getPatientById(currentConsultation.patientId),
    enabled: !!currentConsultation?.patientId,
  });

  // 3. বর্তমান কনসাল্টেশনের জন্য রোগীর অভ্যাস লোড করুন
  const { data: currentPatientHabits, isLoading: isLoadingCurrentPatientHabits, error: currentPatientHabitsError } = useQuery({
    queryKey: ['patientHabitsForConsultation', consultationId],
    queryFn: () => patientHabitsService.getPatientHabitsByConsultationId(consultationId),
    enabled: !!consultationId,
  });

  // 4. এই রোগীর পূর্ববর্তী সকল কনসাল্টেশন লোড করুন (History Tab এর জন্য)
  const { data: patientConsultationHistory, isLoading: isLoadingHistory, error: historyError } = useQuery({
    queryKey: ['patientConsultationHistory', currentPatient?.$id],
    queryFn: () => consultationsService.getConsultationsByPatientId(currentPatient.$id),
    enabled: !!currentPatient?.$id,
  });

  // Mutations for new consultation
  const createConsultationMutation = useMutation({
    mutationFn: consultationsService.createConsultation,
  });
  const createPatientHabitMutation = useMutation({
    mutationFn: patientHabitsService.createPatientHabit,
  });
  const updatePatientHabitMutation = useMutation({
    mutationFn: ({ habitId, data }) => patientHabitsService.updatePatientHabit(habitId, data),
  });

  const handleNewConsultationSubmit = async (data) => {
    // এই ফর্মে নতুন কনসাল্টেশন যোগ করা হচ্ছে, রোগীর আইডি বর্তমান রোগীর হবে
    const patientIdToUse = currentPatient.$id;
    let newConsultationId;

    try {
      // Step 1: Create New Consultation
      const consultationPayload = {
        patientId: patientIdToUse,
        doctorId: currentDoctorId,
        date: data.consultationDetails.date,
        time: data.consultationDetails.time,
        complaint: data.consultationDetails.complaint,
        diagnosis: data.consultationDetails.diagnosis,
        medicines: data.consultationDetails.medicines,
      };
      const newConsultation = await createConsultationMutation.mutateAsync(consultationPayload);
      newConsultationId = newConsultation.$id;
      alert('নতুন ফলো-আপ কনসালটেশন সফলভাবে তৈরি হয়েছে!');

      // Step 2: Create/Update Patient Habits for this New Consultation
      for (const habit of data.patientHabits) {
        const habitPayload = {
          habitDefinitionId: habit.habitDefinitionId,
          value: habit.value,
          notes: habit.notes,
          patientId: patientIdToUse,
          consultationId: newConsultationId,
        };
        // যেহেতু এটি একটি নতুন কনসাল্টেশনের জন্য অভ্যাস, তাই সবসময় তৈরি হবে।
        // পূর্ববর্তী অভ্যাসগুলো আপডেট করার প্রয়োজন হলে, সেটি আলাদাভাবে ম্যানেজ করতে হবে।
        await createPatientHabitMutation.mutateAsync(habitPayload);
      }
      alert('রোগীর অভ্যাস সফলভাবে সংরক্ষণ করা হয়েছে!');

      // Invalidate relevant queries to refetch data for the new consultation
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['patientConsultationHistory', patientIdToUse] }); // রোগীর ইতিহাস আপডেট করুন
      queryClient.invalidateQueries({ queryKey: ['patientHabitsForConsultation', newConsultationId] });

      setIsNewConsultationModalOpen(false); // Modal বন্ধ করুন
      // Optionally navigate to the new consultation's detail page
      // router.push(`/dashboard/consultations/${newConsultationId}`);
    } catch (error) {
      console.error("ফর্ম জমা দিতে সমস্যা হয়েছে:", error);
      alert(`ফর্ম জমা দিতে সমস্যা হয়েছে: ${error.message}`);
    }
  };

  const isSavingNewConsultation = createConsultationMutation.isPending || createPatientHabitMutation.isPending || updatePatientHabitMutation.isPending;


  if (isLoadingCurrentConsultation || isLoadingCurrentPatient || isLoadingCurrentPatientHabits) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" size={32} />
        <span className="ml-2">কনসাল্টেশন ডেটা লোড হচ্ছে...</span>
      </div>
    );
  }

  if (currentConsultationError || currentPatientError || currentPatientHabitsError) {
    return <div className="text-red-500 p-6">ডেটা লোড করতে সমস্যা হয়েছে: {currentConsultationError?.message || currentPatientError?.message || currentPatientHabitsError?.message}</div>;
  }

  if (!currentConsultation || !currentPatient) {
    return <div className="p-6">নির্দিষ্ট ID ({consultationId}) সহ কোনো কনসাল্টেশন বা রোগী খুঁজে পাওয়া যায়নি।</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">কনসাল্টেশন বিবরণ</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">রোগী: {currentPatient.name} ({currentPatient.serialNumber})</h2>
        <div className="flex space-x-2">
          {/* নতুন ফলো-আপ কনসাল্টেশন যোগ করার বাটন */}
          <Dialog open={isNewConsultationModalOpen} onOpenChange={setIsNewConsultationModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> নতুন ফলো-আপ কনসাল্টেশন
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>নতুন ফলো-আপ কনসাল্টেশন</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <PatientConsultationForm
                  onSubmit={handleNewConsultationSubmit}
                  isLoading={isSavingNewConsultation}
                  currentDoctorId={currentDoctorId}
                  defaultPatient={currentPatient} // বিদ্যমান রোগীর ডেটা পাস করুন
                  isEditing={false} // এটি নতুন কনসাল্টেশন তৈরি করছে
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* পূর্ববর্তী ইতিহাস দেখার বাটন */}
          <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="mr-2 h-4 w-4" /> পূর্ববর্তী ইতিহাস
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>রোগীর পূর্ববর্তী কনসাল্টেশন ইতিহাস</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-20"><Loader2 className="animate-spin" size={24} /></div>
                ) : historyError ? (
                  <div className="text-red-500">ইতিহাস লোড করতে সমস্যা হয়েছে: {historyError.message}</div>
                ) : patientConsultationHistory && patientConsultationHistory.length > 0 ? (
                  patientConsultationHistory.map((historyConsultation) => (
                    <Card key={historyConsultation.$id}>
                      <CardHeader>
                        <CardTitle>তারিখ: {new Date(historyConsultation.date).toLocaleDateString()}</CardTitle>
                        <CardDescription>সময়: {historyConsultation.time}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p><strong>অভিযোগ:</strong> {historyConsultation.complaint}</p>
                        <p><strong>রোগ নির্ণয়:</strong> {historyConsultation.diagnosis || 'নেই'}</p>
                        <p><strong>ঔষধ:</strong> {historyConsultation.medicines || 'নেই'}</p>
                        {/* এখানে এই কনসাল্টেশনের জন্য রোগীর অভ্যাসগুলিও দেখাতে পারেন */}
                        {/* Note: Fetch habits for each historyConsultation if needed, or if already available */}
                        {/* <Button variant="link" size="sm" onClick={() => router.push(`/dashboard/consultations/${historyConsultation.$id}`)}>বিস্তারিত দেখুন</Button> */}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">কোনো পূর্ববর্তী কনসাল্টেশন ইতিহাস নেই।</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>বর্তমান কনসাল্টেশন ({new Date(currentConsultation.date).toLocaleDateString()})</CardTitle>
          <CardDescription>
            সময়: {currentConsultation.time}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">রোগীর অভিযোগ:</h3>
            <p>{currentConsultation.complaint}</p>
          </div>
          <div>
            <h3 className="font-semibold">রোগ নির্ণয়:</h3>
            <p>{currentConsultation.diagnosis || 'নেই'}</p>
          </div>
          <div>
            <h3 className="font-semibold">ঔষধ:</h3>
            <p>{currentConsultation.medicines || 'নেই'}</p>
          </div>

          <Separator />
          <h3 className="font-semibold">রোগীর অভ্যাস:</h3>
          {currentPatientHabits && currentPatientHabits.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {currentPatientHabits.map(habit => (
                <Card key={habit.$id} className="p-3">
                  <CardTitle className="text-base">{habit.name || 'অভ্যাস'}</CardTitle> {/* habit.name এখানে নেই, definition থেকে আনতে হবে */}
                  <CardContent className="p-0">
                    <p>মান: {habit.value}</p>
                    {habit.notes && <p className="text-sm text-muted-foreground">নোট: {habit.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">এই কনসাল্টেশনে কোনো অভ্যাস রেকর্ড করা হয়নি।</p>
          )}
        </CardContent>
      </Card>

      {/* রোগীর মৌলিক তথ্য এখানে ডিসপ্লে করতে পারেন, এডিট করার জন্য পৃথক বাটন দিতে পারেন */}
      <Card>
        <CardHeader>
          <CardTitle>রোগীর মৌলিক তথ্য</CardTitle>
          <CardDescription>{currentPatient.serialNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>নাম:</strong> {currentPatient.name}</p>
          <p><strong>বয়স:</strong> {currentPatient.age}</p>
          <p><strong>লিঙ্গ:</strong> {currentPatient.gender}</p>
          <p><strong>ফোন নম্বর:</strong> {currentPatient.phoneNumber}</p>
          <p><strong>ঠিকানা:</strong> {currentPatient.address || 'নেই'}</p>
          <p><strong>পেশা:</strong> {currentPatient.occupation || 'নেই'}</p>
          <p><strong>শেষ পরিদর্শনের তারিখ:</strong> {currentPatient.lastVisitDate ? new Date(currentPatient.lastVisitDate).toLocaleDateString() : 'নেই'}</p>
          {/* এখানে রোগীর মৌলিক তথ্য এডিট করার জন্য একটি বাটন দিতে পারেন যা একটি মডাল বা নতুন পেজে নিয়ে যাবে */}
          {/* <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/patients/${currentPatient.$id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> রোগীর তথ্য এডিট করুন
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
}