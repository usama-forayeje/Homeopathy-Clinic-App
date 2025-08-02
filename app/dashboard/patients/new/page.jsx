"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

// রোগীর ডেটা লোড করার জন্য usePatient রাখা হয়েছে
import { usePatient } from "@/hooks/usePatients";

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";

// Custom Hooks and Services
import { useFormStores } from "@/hooks/useFormStores";

// Form Sections and Schemas
import { PatientDetailsForm } from "@/components/patients/PatientDetailsForm";
import { ConsultationDetailsForm } from "@/components/forms/ConsultationDetailsForm";
import { useParams } from "next/navigation";
import { useConsultationForm, useCreateConsultation } from "@/hooks/usePatientConsultations";
import { zodResolver } from "@hookform/resolvers/zod";
import { fullFormSchema } from "@/schemas/fullFormSchema";
import { toast } from "sonner";



export default function NewConsultationPage() {
  const [currentTab, setCurrentTab] = useState("patient");
  const [completedTabs, setCompletedTabs] = useState(new Set());

  const { chambers, isFormLoading, errors: formStoreErrors } = useFormStores();
  const memoizedChambers = useMemo(() => chambers, [chambers]);

  const initialDefaultValues = useMemo(() => ({
    patientDetails: {
      name: "",
      age: undefined,
      address: "",
      phoneNumber: "",
      occupation: "",
      serialNumber: "",
      gender: "",
      bloodGroup: "",
      notes: "",
      firstConsultationDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      dob: "",
    },
    consultationDetails: {
      consultationDate: new Date().toISOString(),
      chamberId: memoizedChambers[0]?.id || "", // প্রথম চেম্বার ডিফল্ট
      billAmount: 0,
      chiefComplaint: [],
      symptoms: "",
      BP: "",
      Pulse: "",
      Temp: "",
      notes: "",
      followUpDate: "",
      patientId: "", // এটি সার্ভিসে বা onSubmit এ সেট হবে
      otherComplaints: [],
      diagnosis: [],
      O_E: "",
      historyOfPresentIllness: "",
      advice: "", // এটি dietAndLifestyleAdvice এ ম্যাপ হবে
      familyHistory: "" // consultationDetails এর অংশ হিসেবে
    },
    prescription: {
      medicines: [],
      dosageInstructions: [],
      prescriptionNotes: "",
    },
    habitsAndHistory: {
      personalHistory: "",
      familyHistory: "", // habitsAndHistory এর অংশ হিসেবে
      allergies: "",
      pastMedicalHistory: "",
      drugHistory: "",
      smokingHistory: "",
      alcoholHistory: "",
    }
  }), [memoizedChambers]);

  const form = useForm({
    resolver: zodResolver(fullFormSchema),
    defaultValues: initialDefaultValues,
    mode: "onChange",
  });

  const params = useParams();
  const existingPatientId = params?.patientId;

  const { data: existingPatientData, isLoading: isPatientDataLoading, isError: isPatientDataError, error: patientDataError } = usePatient(existingPatientId);
  const { createCombinedMutation, isSubmittingCombined } = useConsultationForm();
  const { mutateAsync: createConsultationForExistingPatient, isPending: isCreatingConsultation } = useCreateConsultation();


  useEffect(() => {
    if (existingPatientData) {
      // শুধু patientDetails এবং consultationDetails এর patientId আপডেট করুন
      // বাকি ফর্মের ভ্যালুগুলো (যদি ইউজার আগে থেকে কিছু টাইপ করে থাকে) অক্ষত থাকবে
      const currentFormValues = form.getValues();

      const patientAge = existingPatientData.age !== null && existingPatientData.age !== undefined
        ? Number(existingPatientData.age) : undefined;

      form.reset({
        ...currentFormValues, // অন্যান্য ট্যাবের ডেটা অক্ষত রাখুন
        patientDetails: {
          ...currentFormValues.patientDetails, // আগের patientDetails ডেটা রাখুন
          name: existingPatientData.name || "",
          age: patientAge,
          dob: existingPatientData.dob ? new Date(existingPatientData.dob).toISOString().split('T')[0] : "", // YYYY-MM-DD
          gender: existingPatientData.gender || "",
          phoneNumber: existingPatientData.phoneNumber || "",
          serialNumber: existingPatientData.serialNumber || "",
          bloodGroup: existingPatientData.bloodGroup || "",
          occupation: existingPatientData.occupation || "",
          address: existingPatientData.address || "",
          notes: existingPatientData.notes || "",
          firstConsultationDate: existingPatientData.firstConsultationDate ? new Date(existingPatientData.firstConsultationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        },
        consultationDetails: {
          ...currentFormValues.consultationDetails, // বিদ্যমান consultationDetails রাখুন
          patientId: existingPatientData.$id, // শুধু patientId আপডেট করুন
        },
        // prescription এবং habitsAndHistory র ডেটা যদি লোড করতে চান এখানে সেট করুন
        // এখন আমরা শুধু patientDetails এবং consultationDetails এর patientId আপডেট করছি
      });
      console.log("Form reset with fetched patient data:", existingPatientData);
    } else {
      // যদি existingPatientId না থাকে, তাহলে ফর্মকে initialDefaultValues এ রিসেট করুন
      form.reset(initialDefaultValues);
    }
  }, [existingPatientData, form, initialDefaultValues]);

  const handleNextTab = useCallback((tabName) => {
    setCompletedTabs(prev => new Set(prev).add(tabName));
    const tabs = ["patient", "consultation", "prescription", "habits"];
    const currentIndex = tabs.indexOf(tabName);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  }, []);

  const handlePreviousTab = useCallback((tabName) => {
    const tabs = ["patient", "consultation", "prescription", "habits"];
    const currentIndex = tabs.indexOf(tabName);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  }, []);

  const onSubmit = async (data) => {
    console.log("Form submitted. Full Data:", data);
    console.log("Is existing patient ID present?", !!existingPatientId);

    if (!existingPatientId) {
      // নতুন রোগী এবং প্রথম কনসালটেশন তৈরি করুন
      console.log("Attempting to create new patient and first consultation.");
      await createCombinedMutation.mutateAsync(data); // পুরো 'data' অবজেক্ট পাঠান
      toast.success("New patient and first consultation successfully created!");
      console.log("New patient and consultation creation initiated.");
      form.reset(initialDefaultValues); // সফল হলে ফর্ম রিসেট
      setCurrentTab("patient");
      setCompletedTabs(new Set());
    } else {
      // বিদ্যমান রোগীর জন্য নতুন কনসালটেশন তৈরি করুন
      console.log("Attempting to create new consultation for existing patient.");
      try {
        // এখানে শুধু consultationDetails, prescription, habitsAndHistory ডেটা ব্যবহার করুন
        // কারণ patientDetails পরিবর্তিত হবে না
        const consultationDataForExistingPatient = {
          ...data.consultationDetails,
          patientId: existingPatientId, // রোগীর আইডি প্যারাম থেকে নেওয়া হয়েছে
          // prescription এবং habitsAndHistory এর ডেটা এখানে যোগ করুন
          prescriptions: data.prescription?.medicines?.map(med => ({
            name: med.name,
            dosage: med.dosage || "",
          })) || [],
          dosageInstructions: data.prescription?.dosageInstructions || [],
          prescriptionNotes: data.prescription?.prescriptionNotes || "",
          personalHistory: data.habitsAndHistory?.personalHistory || "",
          familyHistory: data.habitsAndHistory?.familyHistory || "",
          allergies: data.habitsAndHistory?.allergies || "",
          pastMedicalHistory: data.habitsAndHistory?.pastMedicalHistory || "",
          drugHistory: data.habitsAndHistory?.drugHistory || "",
          smokingHistory: data.habitsAndHistory?.smokingHistory || "",
          alcoholHistory: data.habitsAndHistory?.alcoholHistory || "",
          dietAndLifestyleAdvice: data.consultationDetails.advice ? [data.consultationDetails.advice] : [],
        };
        // অপ্রয়োজনীয় `advice` ফিল্ড মুছে ফেলুন
        delete consultationDataForExistingPatient.advice;
        // console.log("Final consultation data for existing patient:", consultationDataForExistingPatient);

        await createConsultationForExistingPatient(consultationDataForExistingPatient);
        toast.success("New consultation for existing patient successfully added!");
        console.log("New consultation for existing patient creation initiated.");
        form.reset(initialDefaultValues); // সফল হলে ফর্ম রিসেট
        setCurrentTab("patient");
        setCompletedTabs(new Set());
      } catch (error) {
        console.error("Error caught during consultation creation for existing patient:", error);
        toast.error(error.message || "Failed to add new consultation for existing patient.");
      }
    }
  };

  if (isFormLoading || isPatientDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading form data...</span>
      </div>
    );
  }

  if (formStoreErrors && (formStoreErrors.habitDefinitionError || formStoreErrors.medicineError || formStoreErrors.instructionError || formStoreErrors.chamberError)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <CardTitle>Error Loading Data</CardTitle>
          <CardDescription className="text-red-500">
            {formStoreErrors.habitDefinitionError?.message ||
              formStoreErrors.medicineError?.message ||
              formStoreErrors.instructionError?.message ||
              formStoreErrors.chamberError?.message ||
              "Failed to load essential form data. Please check console for details."}
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {Object.keys(form.formState.errors).length > 0 && (
            <Card className="border-red-500 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-600">Form Errors</CardTitle>
                <CardDescription className="text-red-500">
                  Please correct the following errors before submitting.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-red-700">
                {Object.entries(form.formState.errors).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {JSON.stringify(value)}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger className="cursor-pointer" value="patient">Patient Details</TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="consultation">Consultation</TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="prescription">Prescription</TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="habits">Habits & Allergies</TabsTrigger>
            </TabsList>

            <TabsContent value="patient">
              <PatientDetailsForm
                onNextTab={() => handleNextTab("patient")}
                onPreviousTab={() => handlePreviousTab("patient")}
              />
            </TabsContent>

            <TabsContent value="consultation">
              <ConsultationDetailsForm
                form={form}
                chambers={memoizedChambers}
                onNextTab={() => handleNextTab("consultation")}
                onPreviousTab={() => handlePreviousTab("consultation")}
              />
            </TabsContent>

            <TabsContent value="prescription">
              <Card>
                <CardHeader><CardTitle>Prescription Form (Coming Soon)</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <Button type="button" onClick={() => handlePreviousTab("prescription")}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button type="button" onClick={() => handleNextTab("prescription")}><ArrowRight className="ml-2 h-4 w-4" /> Next: Habits & Allergies</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="habits">
              <Card>
                <CardHeader><CardTitle>Habits & Allergies Form (Coming Soon)</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <Button type="button" onClick={() => handlePreviousTab("habits")}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button type="submit" disabled={isSubmittingCombined || isCreatingConsultation || isPatientDataLoading}>
                      {(isSubmittingCombined || isCreatingConsultation) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                      {(isSubmittingCombined || isCreatingConsultation) ? "Submitting..." : "Submit Consultation"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};