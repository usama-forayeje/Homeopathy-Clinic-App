// app/dashboard/habit-definitions/add/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/common/PageContainer"; // আপনার PageContainer পাথ চেক করুন
import { HabitDefinitionForm } from "@/components/forms/HabitDefinitionForm";
import { useHabitDefinitionMutations } from "@/hooks/useHabitDefinitions";
import { toast } from "sonner";

export default function AddHabitDefinitionPage() {
  const router = useRouter();
  const { createHabitDefinitionMutation } = useHabitDefinitionMutations();

  const handleAddSubmit = async (values) => {
    try {
      await createHabitDefinitionMutation.mutateAsync(values);
      router.push("/dashboard/habit-definitions");
      toast.success("Habit definition added successfully!");
    } catch (error) {
      console.error("Failed to add habit definition:", error);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Add New Habit Definition</h1>
        <HabitDefinitionForm
          onSubmit={handleAddSubmit}
          isLoading={createHabitDefinitionMutation.isPending}
          buttonText="Create Habit Definition"
        />
      </div>
    </PageContainer>
  );
}