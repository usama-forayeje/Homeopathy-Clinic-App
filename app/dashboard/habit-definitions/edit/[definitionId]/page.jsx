// app/dashboard/habit-definitions/edit/[definitionId]/page.jsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { PageContainer } from "@/components/common/PageContainer"; // আপনার PageContainer পাথ চেক করুন
import { HabitDefinitionForm } from "@/components/forms/HabitDefinitionForm";
import { useHabitDefinition, useHabitDefinitionMutations } from "@/hooks/useHabitDefinitions";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditHabitDefinitionPage() {
  const router = useRouter();
  const params = useParams();
  const definitionId = params.definitionId;

  const { data: habitDefinition, isLoading, isError, error } = useHabitDefinition(definitionId);
  const { updateHabitDefinitionMutation } = useHabitDefinitionMutations();

  const handleEditSubmit = async (values) => {
    try {
      await updateHabitDefinitionMutation.mutateAsync({
        definitionId,
        data: values,
      });
      router.push("/dashboard/habit-definitions");
      toast.success("Habit definition updated successfully!");
    } catch (error) {
      console.error("Failed to update habit definition:", error);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Loading habit definition...</span>
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <div className="text-red-500 p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading data!</h2>
          <p>Failed to load habit definition: {error?.message || "An unknown error occurred."}</p>
          <Button onClick={() => router.push("/dashboard/habit-definitions")} className="mt-4">
            Go to Definitions List
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (!habitDefinition) {
    return (
      <PageContainer>
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-orange-500">Definition Not Found!</h2>
          <p className="text-muted-foreground">The habit definition with ID &quot;{definitionId}&quot; does not exist or has been deleted.</p>
          <Button onClick={() => router.push("/dashboard/habit-definitions")} className="mt-4">
            Go to Definitions List
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Habit Definition</h1>
        <HabitDefinitionForm
          onSubmit={handleEditSubmit}
          defaultValues={habitDefinition}
          isLoading={updateHabitDefinitionMutation.isPending}
          buttonText="Update Habit Definition"
        />
      </div>
    </PageContainer>
  );
}